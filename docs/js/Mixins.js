let MIXINS = {
    page: {
        pageCode: function () {
            return this.root.tagName.toLowerCase();
        },
        draw: function () {
            ROUTER.draw(this, this.pageCode());
        }
    }
};
