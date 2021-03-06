'use strict';

app.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push([
        '$q',
        '$injector',
        '$timeout',
        'API_SERVER',
        'UnauthorizedException',
        function (
            $q,
            $injector,
            $timeout,
            API_SERVER,
            UnauthorizedException
        ) {
            return {
                request: function (config) {
                    if (!config) {
                        return config;
                    }

                    if (typeof config === 'string') {
                        config = {
                            url: config
                        };
                    }

                    if (config.url.indexOf('.html') !== -1) {
                        return config;
                    }

                    config.origUrl = config.url;

                    config.url = (config.url[0] === '/' ? API_SERVER.substr(0, API_SERVER.length - 1) : API_SERVER) + config.url;

                    if (!config.cache) {
                        // avoid cache
                        config.url = config.url + (config.url.indexOf('?') === -1 ? '?' : '&') + '_=' + Date.now();
                    }

                    return config;
                },

                responseError: function (resp) {
                    var processed = false;

                    resp.processed = function (code) {
                        if (!code || resp.status === code) {
                            processed = true;
                        }

                        return $q.reject(resp);
                    };

                    if (resp.config && resp.config.statusText && resp.config.statusText[resp.status]) {
                        resp.statusText = resp.config.statusText[resp.status];
                    }

                    if (resp.status === 401)  {
                        throw new UnauthorizedException();
                    } else if (resp.status === 403)  {
                        return $q.reject(resp);
                    } else {
                        // next tick
                        var message = null;
                        if (resp && resp.data && resp.data.exceptionMessage) {
                            message = resp.data.exceptionMessage;
                        } else if (resp && resp.data && resp.data.message) {
                            message = resp.data.message;
                        }

                        $timeout(function () {
                            if (processed) {
                                return;
                            }

                            if (resp.config && resp.config.statusText && resp.config.statusText[resp.status]) {
                                $injector.get('Toast').info(resp.config.statusText[resp.status]);
                            } else {
                                $injector.get('Toast').info('请求出错');
                            }
                        }, 25);
                    }

                    return $q.reject(resp);
                }
            };
        }
    ]);
}]);

app.run(['$http', '$location', function ($http, $location) {
    var origin = $location.protocol() + '://' + $location.host();
    if ($location.port()) {
        origin += ':' + $location.port();
    }

    $http.defaults.headers.Origin = origin;
    $http.defaults.withCredentials = true;
}]);
