

define(['aui!pages/MainPage.aui', 'aui!pages/AboutPage.aui'], function(MainPage, AboutPage){
    const router = auicomponents.Page.router;

    router.add([
        {
            path: '/',
            redirect: '/main'
        },
        {
            path: '/main',
            component: MainPage
        },
        {
            path: '/about',
            component: AboutPage
        }
    ]);
    return {};
});

