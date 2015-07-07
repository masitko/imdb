<?php

namespace imdb\controllers;

use Symfony\Component\HttpFoundation\Request;
 

class Imdb {
    
    protected $client;
    
    function __construct( $client ) {
        $this->client = $client;
    }
    
    function imdbSearch(Request $request, $name ) {

        $response = $this->client->get('http://sg.media-imdb.com/suggests/'.$name[0].'/'.$name.'.json');
        
        return $response->getBody();
        
    }
    
}
