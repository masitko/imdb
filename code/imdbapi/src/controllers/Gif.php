<?php

namespace gif\controllers;

use Symfony\Component\HttpFoundation\Request;
 

class Gif {
    
    protected $client;
    
    function __construct( $client ) {
        $this->client = $client;
    }
    
    function getGif(Request $request, $id = null) {
        var_dump($id);
        var_dump($this->client->get('http://localhost:8019/api/gifs/'.$id)->json());
    
        return 'Done';
        
    }
    
}
