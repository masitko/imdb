<?php

namespace imdb\controllers;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use GuzzleHttp\Exception\ClientException;
 

class Api {
    
    protected $client;
    protected $crawler;
    protected $headers;
    
    function __construct( $client, $crawler ) {
        $this->client = $client;
        $this->crawler = $crawler;
        $this->headers = [
            'User-Agent' => 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:39.0) Gecko/20100101 Firefox/39.0'
        ];
    }
    
    function imdbSuggests(Request $request, $name ) {

        try{ 
            $response = $this->client->get('http://sg.media-imdb.com/suggests/'.$name[0].'/'.$name.'.json', [ 'headers' => $this->headers ]);
            $result = rtrim( strstr($response->getBody()->getContents(), '{'), ')');
        }
        catch (ClientException $e){
            $result = '{}';
        }
        
        return new Response($result, 200, array('Content-Type' => 'application/json'));
    }

    /**
     * 
     * @param Request $request
     * @param type $id - in imdb format tt1553656
     * @return string
     */
    function imdbTitle(Request $request, $id ) {

        try{ 
            $response = $this->client->get('http://www.imdb.com/title/'.$id, [ 'headers' => $this->headers ]);
            $response2 = $this->client->get('http://m.imdb.com/title/'.$id, [ 'headers' => $this->headers ]);
            
//            $response = $this->client->get('http://www.google.co.uk' );
            $result = $this->crawler->getRecommendations($response->getBody()->getContents(), $response2->getBody()->getContents());
        }
        catch (ClientException $e){
            $result = '{error}';
        }
        
        return new Response($result, 200, array('Content-Type' => 'application/json'));
    }
    
}
