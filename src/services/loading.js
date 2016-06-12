'use strict';

app.service('Loading', function () {
    var Loading = {
        message: null,

        info: function (message, $promise) {
            Loading.message = message;

            $promise.finally(function () {
                Loading.message = null;
            });
        }
    };

    return Loading;
});
