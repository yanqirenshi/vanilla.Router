///// ////////////////////////////////////////////////////////////////
/////
/////
///// Vanilla Router. Ver Beta (0.0.2)
/////
/////
///// ////////////////////////////////////////////////////////////////


///// ////////////////////////////////////////////////////////////////
///// Class VanillaRouterData
///// ////////////////////////////////////////////////////////////////
class VanillaRouterData {
    constructor () {
        let pages = this.pages();
    }
    // テストのために。とりあえず
    pages () {
        return {
            active: 'home',
            default: 'home',
            home: {
                regex: '',  //  Path: /
                tag: '${tagn-name}',
                children: {}
            },
            page01: {
                regex: 'page01',  //  Path: /page01
                tag: '${tag-name}',
                children: {
                    subpage01: {
                        regex: 'subpage01',  //  Path: /page01/subpage01
                        tag: '${tag-name}',
                        children: {}
                    }
                }
            },
            page02: {
                regex: 'page02',  //  Path: /page02
                tag: 'page02',
                children: {
                    nilpage: {
                        regex: 'user',  //  Path: /page02/user:id/subpage01
                        tag: null,
                        children: {
                            subpage01: {
                                regex: '(\n+)',  //  Path: /page02/user/:id
                                tag: '${tag-name}',
                                children: {}
                            }
                        }
                    }
                }
            }
        };
    }
    routeNodeModel (regex, tag, children) {
        return {
            regex: regex,      // string
            tag: tag,          // string
            children: children // hash table
        };
    }
    assertHaveChildren (page) {
        console.assert(page, page);

        if (page.tag)
            return;

        if (page.children && page.children.length > 0)
            return;

        throw new Error('Page に Children が設定されていません。\n' +
                        'Ppage:\n' +
                        JSON.stringify(page, null , "\t"));
    }
    setHashTo (page) {
        this.assertHaveChildren(page);

        for (let child of page.children) {
            let hash = '#' + page.code;

            if (child.code!='root')
                hash += '/' + child.code;

            child.hash = hash;
        }
    }
    metamorphose (node) {
        if (!node.children)
            node.children = [];

        if (!node.style)
            node.style = {};

        if (!node.code || node.code.length==0)
            console.warn('code が空です。', node);

        if (!node.tag || node.tag.length==0)
            if (node.children.length==0)
                console.warn('tag が空です。', node);

        this.setHashTo(node);
    }
    mature (routes) {
        for (let node of routes) {
            this.metamorphose(node);

            if (node.children.length==0)
                continue;

            this.mature(node.children); // 再帰だけど、ゆるしてね。
        }

        return this;
    }
}


///// ////////////////////////////////////////////////////////////////
///// Class VanillaRouter
///// ////////////////////////////////////////////////////////////////
class VanillaRouter extends VanillaRouterData {
    constructor (options) {
        super();

        // TODO: init Method を追加しよう。
        if (options) {
            this._root = options.root;
            this.getRoutes = options.callbacks.routes;
            this.action = {
                changed: options.callbacks.changed,
                error:   options.callbacks.error,
            };
        }

        this.setRouteAction();
    }
    setRouteAction () {
        let self = this;

        route(function () { // ここはアロー関数だとダメみたい。
            let route = Array.prototype.slice.call(arguments);

            self.changed(route);
        });
    }
    changed (route) {
        if (this.action.changed)
            this.action.changed(route);
    }
    getStartRoute () {
        let hash = location.hash;
        let len = hash.length;

        if (len==0)
            return '/';

        return hash.substring(1);
    }
    start () {
        route.start(this.getStartRoute());
    }
    /**
     * routes から route で指定した node を取得します。
     *
     * @route Array
     */
    getNode (routes, route, path_params) {
        if (!path_params)
            path_params = {};

        if (!route)
            return null;

        let route_length = route.length;

        if (route_length==0)
            return null;

        let key = route[0];


        let node = routes.find((n) => {
            if (!n.regex)
                return n.code == key;

            if (!n.regex.exec(key))
                return false;

            path_params[n.code] = key;

            return true;
        });

        if (!node)
            return null;

        if (route_length==1)
            return {
                node: node,
                params: { path: path_params },
            };

        return this.getNode(node.children, route.slice(1), path_params);
    }
}

class VanillaRouterRiot extends VanillaRouter {
    constructor (routes, options) {
        super(options);

        this.mature(routes);
    }
    unmounts (root_tag, targets) {
        for (let tag of targets.unmount) {
            let unmount_tag_name = tag.root.tagName.toLowerCase();

            tag.unmount();
            delete root_tag.tags[unmount_tag_name];
        }
    }
    mountCore (root_tag, tag_name, params) {
        try {
            let new_page_tag = riot.mount(tag_name, { _route: { params: params } });
            root_tag.tags[tag_name] = new_page_tag[0];
        } catch (e) {
            dump(e);
            dump({ root_tag:root_tag, tag_name:tag_name });
            throw new Error('タグのマウントに失敗しました。');
        }
    }
    mount (root_tag, tag_name, targets, params) {
        if (targets.mounted.length==1) {
            targets.mounted[0].update();
        } else {
            let elem = document.createElement(tag_name);
            elem.classList.add('page');

            let page_holder_elem = root_tag.root;
            page_holder_elem.appendChild(elem);

            this.mountCore(root_tag, tag_name, params);
        }
    }
    getTagNmae (node, data) {
        let tag = node.tag;

        if (typeof tag=='function')
            return tag(node, data);

        return tag;
    }
    assertNode (node, data) {
        if (node)
            return;

        console.warn('指定されたノードが存在しません。');
        console.warn(node);
        console.warn(data);

        if (this.action.error || this.action.error['404'])
            this.action.error['404'](node, data);
        else
            throw new Error('指定されたノードが存在しません。');
    }
    /**
     * routes から route で指定した node を取得します。
     *
     * @root_tag マウントするタグ
     * @routes   ルート情報(木構造)
     * @data     ルート情報(配列)
     */
    draw (root_tag, routes, data) {
        let retsult = this.getNode(routes, data);

        let node = retsult ? retsult.node : null;
        this.assertNode(node, data);

        let tag_name = this.getTagNmae(retsult.node, data);

        let children  = root_tag.tags;
        let targets = {
            mounted: [],
            unmount: [],
        };

        for (let key in children) {
            let child = children[key];

            if (key==tag_name) {
                targets.mounted.push(child);
            } else {
                targets.unmount.push(child);
            }
        }

        this.unmounts(root_tag, targets);
        this.mount(root_tag, tag_name, targets, retsult.params);
    }
}
