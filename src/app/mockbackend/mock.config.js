(function() {
    'use strict';
angular.module('app')
.config(function($provide) {
    $provide.decorator('$httpBackend', function($delegate) {
        var minDelay = 2000;
        var maxDelay = 5000;
        //Adding random delays to calls for more realistic testing
        var randomDelayFn = function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        var proxy = function(method, url, data, callback, headers) {
            var delay = null; 
            if(/assets\//.test(url) || /\.html$/.test(url) || /\.js$/.test(url)){
                delay = 0;
                // delay = randomDelayFn(100,300); //Return static fast between 100 to 300 ms
            } else{

                delay= randomDelayFn(minDelay,maxDelay);//delay data request between 2000 to 5000 ms

            }
            var interceptor = function() {
                var _this = this,
                    _arguments = arguments;
                setTimeout(function() {
                    callback.apply(_this, _arguments);
                }, delay);
            };
            return $delegate.call(this, method, url, data, interceptor, headers);
        };
        for(var key in $delegate) {
            proxy[key] = $delegate[key];
        }
        return proxy;
    });
})
})();