<?php

namespace app;

use \imdb\controllers;
use \imdb\services;

use GuzzleHttp\Client;

class Dependencies {

    static function configure($app) {

        $app["controllers.api"] = $app->share(function($app) {
            return new controllers\Api($app["services.guzzle.client"], $app["services.crawler"], $app['mongodb']);
        });        
        
        $app["controllers.home"] = $app->share(function($app) {
            return new controllers\Home($app["twig"]);
        });        
        
        $app["services.guzzle.client"] = function() {
            return new Client();
        };
        
        $app["services.crawler"] = function() {
            return new services\Crawler();
//            return new services\Counter($app["services.gif.encoder"]);
        };
        
    }

}
