<?php

namespace imdb\controllers;

use Symfony\Component\HttpFoundation\Request;
 

class Home {
    
    protected $twig;
    
    function __construct( $twig ) {
        $this->twig = $twig;
    }
    
    function index(Request $request) {
        return $this->twig->render('home.html.twig', array(
            'dupa' => 'DUPA',
        ));        
    }
    
}
