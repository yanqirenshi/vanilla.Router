<home_page_root>

    <section-header title="Vanilla Router Docs"></section-header>

    <page-tabs core={page_tabs}
               callback={clickTab}
               style="display:block; margin-top: 33px;"></page-tabs>

    <div>
        <home_tab_readme             class="hide"></home_tab_readme>
        <home_tab_usage              class="hide"></home_tab_usage>
        <home_tab_find-data-tructure class="hide"></home_tab_find-data-tructure>
        <home_tab_find-node          class="hide"></home_tab_find-node>
        <home_tab_classes></home_tab_classes>
    </div>

    <section-footer></section-footer>

    <script>
     this.page_tabs = new PageTabs([
         {code: 'readme',         label: 'README',       tag: 'home_tab_readme' },
         {code: 'usage',          label: 'Usage',        tag: 'home_tab_usage' },
         {code: 'datas-tructure', label: 'データ構造',   tag: 'home_tab_find-data-tructure' },
         {code: 'find-node',      label: 'ノードの検索', tag: 'home_tab_find-node' },
         {code: 'classes',        label: 'Classes',      tag: 'home_tab_classes' },
     ]);

     this.on('mount', () => {
         this.page_tabs.switchTab(this.tags)
         this.update();
     });

     this.clickTab = (e, action, data) => {
         if (this.page_tabs.switchTab(this.tags, data.code))
             this.update();
     };
    </script>

</home_page_root>
