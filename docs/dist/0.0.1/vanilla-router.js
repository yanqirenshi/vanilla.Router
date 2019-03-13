///// ////////////////////////////////////////////////////////////////
/////
/////
///// Vanilla Router. Ver Beta (0.0.1)
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
    getNode (route) {
    }
}
