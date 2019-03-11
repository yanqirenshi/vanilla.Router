const _SAMPLE_DATA_STRUCTURE = {
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
