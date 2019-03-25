var ROUTER = new VanillaRouterRiot(
    STORE.get('site.pages'),
    {
        callbacks: {
            changed: (route) => {
                ACTIONS.movePage({
                    route: route,
                });
            },
        }
    });
ROUTER.start();
