<?php

namespace app;

use \gif\controllers;

use GuzzleHttp\Client;

class Dependencies {

    static function configure($app) {

        $app["controllers.gif"] = $app->share(function($app) {
            return new controllers\Gif($app["services.guzzle.client"]);
        });        
        
        $app["services.guzzle.client"] = function() {
            return new Client();
        };
    }

}
