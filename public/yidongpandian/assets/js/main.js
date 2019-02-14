
require.config({
    baseUrl: './',
    paths: {
        aui : 'build/js/cn/default/aui',
        less: 'assets/libs/amd/less',
        lessc: 'assets/libs/amd/lessc',
        normalize: 'assets/libs/amd/normalize'
        // aui : 'assets/js/aui.h5'
    }
});


require(['aui!pages/Frame.aui'], function(Frame){
    $('#app').html('<aui-frame></aui-frame>');
});