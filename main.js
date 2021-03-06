(function () {
    'use strict';

    window.app = angular.module('jinyufeili.web', [
        'ngRoute',
        'ngResource',
        'angular-google-analytics'
    ]);

    $.getJSON('/api/wechat/js_signature', {
        url: location.href
    }, function (resp) {
        window.wx.config({
            appId: resp.appid,
            timestamp: resp.timestamp,
            nonceStr: resp.noncestr,
            signature: resp.signature,
            jsApiList: [
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'onMenuShareQQ',
                'onMenuShareWeibo',
                'onMenuShareQZone',
                'getNetworkType',
                'openLocation',
                'getLocation',
                'hideOptionMenu',
                'showOptionMenu',
                'hideMenuItems',
                'showMenuItems',
                'hideAllNonBaseMenuItem',
                'showAllNonBaseMenuItem',
                'closeWindow'
            ]
        });
    });
}());
