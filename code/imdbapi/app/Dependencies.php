<?php

namespace app;

use \imdb\controllers;

use GuzzleHttp\Client;

class Dependencies {

    static function configure($app) {

        $app["controllers.imdb"] = $app->share(function($app) {
            return new controllers\Imdb($app["services.guzzle.client"]);
        });        
        
        $app["services.guzzle.client"] = function() {
            return new Client();
        };
    }

}
