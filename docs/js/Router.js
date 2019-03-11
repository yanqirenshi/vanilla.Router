/**
 *   自分用ルーター。
 *
 *   store (hash-table)
 *   ==================
 *   site: {
 *       pages: [
 *          {
 *             code: "home",
 *             test: '{regex} or {function}'
 *             tag: 'tag-name-1' or null
 *             children: [ // ここは children に変更しよう。
 *                 {
 *                    code: 'root',
 *                    test: 'regex' or function
 *                    tag: 'tag-name-2'
 *                    children: [...]
 *                 },
 *             ]
 *             active_section: 'root',  // これは自動で付与するようにしても良いのかもしれない
 *             home_section: 'root',    //   〃
 *          }
 *       ]
 *       active_page: 'home', // これは自動で付与するようにしても良いのかもしれない
 *       home_page: 'home',   //   〃
 *   }
 *
 */
class Router {
    constructor(store, actions) {
        this._store = store;
        this._actions = actions;

        let self = this;
        route(function (a) {
            self.routing(arguments);
        });
    }
    start () {
        route.start(function () {
            let hash = location.hash;
            let len = hash.length;

            if (len==0)
                return '/';

            return hash.substring(1);
        }());
    }
    /* **************************************************************** *
     *  Routing
     *  =======
     *
     * **************************************************************** */
    /**
     * ???
     * @param {hash-table}  site サイト(ページ)の全データ
     * @param {array} args ハッシュを '/' で split した配列
     */
    getPageCode (site, args) {
        let len = args.length;

        return args[0] ? args[0] : site.home_page;
    }
    /**
     * ???
     * @param {hash-table}  site サイト(ページ)の全データ
     * @param {string}      page_code 取得したいページのコード
     */
    getPage (site, page_code) {
        return site.pages.find((d) => {
            return d.code == page_code;
        });
    }
    /**
     * これ、何しているんだったっけ？
     * @param {hash-table}  page サイトのデータ
     * @param {array}       args ハッシュを '/' で split した配列
     */
    getActiveSection (page, args) {
        // TODO: ここを階層でもイケるようにする。
        //   args で page の階層を検索し、ヒットしたものを返す。
        //   ヒットしない場合はエラーにする。
        return args.length>=2 ? args[1] : page.home_section;
    }
    /**
     * this is constructor description.
     * @param {array} args ハッシュを '/' で split した配列
     */
    routing (args) {
        let site = this._store.state().get('site');
        let actions = this._actions;

        let page_code = this.getPageCode(site, args);
        let page = this.getPage (site, page_code);

        if (!page) throw new Error('Page が存在しません。 Page code=' + page_code);

        site.active_page = page_code;
        page.active_section = this.getActiveSection(page, args);

        this._store.dispatch(actions.movePage({
            site: site
        }));
    }
    /* **************************************************************** *
     *  Draw
     *  ====
     *    mixin から呼ばれている。
     * **************************************************************** */
    draw (requester, page_code) {
        let pages = this._store.state().get('site').pages;
        let page = pages.find((d) => {
            return d.code == page_code;
        });

        this.switchSection(requester, page);
    }
    /* **************************************************************** *
     *  Page
     *  =======
     *    site の階層再上位のものを page とします。
     *    その page を切り換える処理です。
     *    app.tag から呼ばれている。
     * **************************************************************** */
    isfindPageTag (tag) {
        let cls = tag.opts.class;

        return cls && cls.split(' ').find((c)=>{
            return c=='page';
        });
    }
    findPageTags (tags) {
        let page_tags = {};

        for (var k in tags) {
            let tag = tags[k];
            if (this.isfindPageTag(tag))
                page_tags[k] = tag;
        }

        return page_tags;
    }
    splitPageKey (site, code, tag) {
        let active_code = site.active_page;

        if (active_code==code) {
            if (!tag)                  return { key:'show',   value: code };
            if (tag && !tag.isMounted) return { key:'show',   value: code };
            if (tag &&  tag.isMounted) return { key:'update', value: tag };
        } else {
            if (tag && tag.isMounted)
                return { key:'unmount', value: tag };
        }
        return null;
    }
    splitPage (site, tags) {
        let out = { show: [], unmount: [], update: [] };

        for (let page of site.pages) {
            let key = page.code;
            let tag = tags[key];

            let target = this.splitPageKey (site, key, tag);

            if (target)
                out[target.key].push(target.value);
        }

        return out;
    }
    switchPage (root_tag, page_holder_elem, site) {
        let tags = root_tag.tags;
        let trg_show = [];

        let targets = this.splitPage(site, tags);

        for (let tag of targets.update)
            tag.update();

        for (let tag of targets.unmount)
            tag.unmount();

        for (let tag_name of targets.show) {
            var elem = document.createElement(tag_name);

            elem.classList.add('page');

            page_holder_elem.appendChild(elem);

            let new_page_tag = riot.mount(tag_name);
            root_tag.tags[tag_name] = new_page_tag[0];
        }
    }
    /* **************************************************************** *
     *  Section
     *  =======
     *    page の配下(children) のノードを section とします。
     *    その section を切り替える処理です。
     * **************************************************************** */
    mountSections (page, active_section_code, sections) {
        let root = page.root;

        for (var i in sections) {
            let section = sections[i];
            let tag_name = 'func-' + section.code;

            var elem = document.createElement(tag_name);

            if (section.code==active_section_code)
                elem.classList.add('page-section');
            else
                elem.classList.add('page-section', 'hide');

            root.appendChild(elem);

            let opts = {};
            if (section.code=='root')
                opts.sections = sections;

            let new_tags = riot.mount(tag_name, opts);

            page.tags[tag_name] = new_tags[0];
        }
    }
    splitSectionKey (page, code, tag) {
        let active_code = page.active_section;

        if (active_code==code) {
            if (!tag)                  return { key:'show',   value: code };
            if (tag && !tag.isMounted) return { key:'show',   value: code };
            if (tag &&  tag.isMounted) return { key:'update', value: tag };
        } else {
            if (tag && tag.isMounted)  return { key:'unmount', value: tag };
        }

        return null;
    }
    splitSection (tags, page) {
        let sections = page.children;
        let out = { show: [], unmount: [], update: [] };

        for (let section of sections) {
            let tag = tags[section.tag];

            let target = this.splitSectionKey (page, section.code, tag);
            if (target)
                out[target.key].push(target.value);
        }

        return out;
    }
    getSectionData (sections_data, tag_code) {
        return sections_data.find((d) => {
            return d.code==tag_code;
        });
    }
    mountSectionTag (root_tag, tag_name) {
        var elem = document.createElement(tag_name);

        elem.classList.add('page-section');

        root_tag.root.appendChild(elem);
    }
    showSectionTag (root_tag, page, tag_code) {
        let sections = page.children;
        let section = this.getSectionData (sections, tag_code);
        let tag_name = section.tag;

        this.mountSectionTag (root_tag, tag_name);

        let new_page_tag = riot.mount(tag_name, { page_code: root_tag.pageCode() });

        root_tag.tags[tag_name] = new_page_tag[0];
    }
    switchSection (root_tag, page) {
        let tags = root_tag.tags;

        let targets = this.splitSection(tags, page);

        for (let tag of targets.update)
            tag.update();

        for (let tag of targets.unmount)
            tag.unmount();

        for (let tag_code of targets.show)
            this.showSectionTag (root_tag, page, tag_code);
    };
    /* **************************************************************** *
     *  Util
     *  =======
     *
     * **************************************************************** */
    isHaveClass (class_trg, class_string) {
        if (!class_string) return false;

        let classes = class_string.trim().split(' ');
        let results = classes.find((cls) => { return cls==class_trg; });

        return !(results.length==0);
    };
    rmClass (class_trg, class_string) {
        let classes = class_string.trim().split(' ');
        let results = classes.filter((cls) => { return cls!=class_trg; });

        return results.join(' ');
    };
    addClass (class_trg, class_string) {
        let classes = class_string.trim().split(' ');
        if (classes.filter((cls) => { return cls==class_trg; }).length==0)
            classes.push(class_trg);

        return classes.join(' ');
    };
}
