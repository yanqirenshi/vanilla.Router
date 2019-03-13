<home_tab_usage>

    <section class="section">

        <div class="container">
            <h1 class="title">HTML</h1>
            <h2 class="subtitle"></h2>

            <div class="contents">
                <p>page-area にルートのページを表示します。</p>
                <p>
                    <pre>{html.join('\n')}</pre>
                </p>
            </div>
        </div>
    </section>

    <section class="section">

        <div class="container">
            <h1 class="title">Javascript</h1>
            <h2 class="subtitle"></h2>

            <section class="section">

                <div class="container">
                    <h1 class="title is-4">(1) 開始</h1>
                    <h2 class="subtitle"></h2>

                    <div class="contents">
                        <p>VanillaRouter.start()で riot-router を startさせています。</p>
                        <p>callbacks.routes は VanillaRouter がルートのデータを取得するためのものです。</p>
                        <p>changed は VanillaRouter が url の変更を感知したとき実行されるものです。</p>
                        <p>
                            <pre>{js_start.join('\n')}</pre>
                        </p>
                    </div>
                </div>

            </section>
        </div>

    </section>

    <script>
     this.html = [
         '<app>',
         '    <div ref="page-area"></div>',
         '</app>',
     ];
     this.js_start = [
         "var ROUTER = new VanillaRouter({",
         "    root: {",
         "        element: null,",
         "    },",
         "    callbacks: {",
         "        routes: () => {",
         "            STORE.get('site');",
         "        },",
         "        changed: (site) => {",
         "            ACTIONS.movePage({",
         "                site: site",
         "            });",
         "        },",
         "    }",
         "});",
         "ROUTER.start();",
     ];
    </script>

</home_tab_usage>
