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
    getNode (routes, route) {
        if (!route)
            return null;

        let route_length = route.length;

        if (route_length==0)
            return null;

        let key = route[0];

        let node = routes.find((n) => {
            return n.code == key;
        });

        if (!node)
            return null;

        if (route_length==1)
            return node;

        return this.getNode(node.children, route.slice[1]);
    }
}

class VanillaRouterRiot extends VanillaRouter {
    constructor (options) {
        super(options);
    }
    unmounts (root_tag, targets) {
        for (let tag of targets.unmount) {
            let unmount_tag_name = tag.root.tagName.toLowerCase();

            tag.unmount();
            delete root_tag.tags[unmount_tag_name];
        }
    }
    mount (root_tag, tag_name, targets) {
        if (targets.mounted.length==1) {
            targets.mounted[0].update();
        } else {
            let elem = document.createElement(tag_name);
            elem.classList.add('page');

            let page_holder_elem = root_tag.root;
            page_holder_elem.appendChild(elem);

            let new_page_tag = riot.mount(tag_name);
            root_tag.tags[tag_name] = new_page_tag[0];
        }
    }
    draw (root_tag, routes, data) {
        let node = this.getNode(routes, data.route);
        let tag_name = node.tag;

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
        this.mount(root_tag, tag_name, targets);
    }
}
