<?php

namespace imdb\controllers;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use GuzzleHttp\Exception\ClientException;

class Api {

    protected $client;
    protected $crawler;
    protected $mongodb;
    protected $headers;

    function __construct($client, $crawler, $mongodb) {
        $this->client = $client;
        $this->crawler = $crawler;
        $this->mongodb = $mongodb->selectDatabase('m-rex');
        $this->headers = [
            'User-Agent' => 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:39.0) Gecko/20100101 Firefox/39.0'
        ];
    }

    function imdbFuzzySearch(Request $request, $name) {

        $source = 'database';
        $key = '/s/' . $name;
        $document = $this->mongodb
                ->selectCollection('fuzzysearch')
                ->findOne(['_id' => $key])
        ;

        if ($document) {
            if ($this->expiryCheck($document['timestamp'])) {
                $source = 'updated';
                $document = $this->prepareFSDocument($name, $key);
                $this->mongodb
                    ->selectCollection('fuzzysearch')
                    ->update(['_id' => $key], $document)
                ;
            }
        } else {

            $source = 'external';
            $document = $this->prepareFSDocument($name, $key);
            $this->mongodb
                    ->selectCollection('fuzzysearch')
                    ->insert($document)
            ;
        }

        return new Response($document['result'], 200, array(
            'Content-Type' => 'application/json',
            'Source-Type' => $source
        ));
    }

    /**
     * 
     * @param type $name
     * @return type
     */
    function prepareFSDocument($name, $key) {
        
        try {
            $response = $this->client->get('http://sg.media-imdb.com/suggests/' . $name[0] . '/' . $name . '.json', [ 'headers' => $this->headers]);
            $result = rtrim(strstr($response->getBody()->getContents(), '{'), ')');
        } catch (ClientException $e) {
            $result = '{}';
        }
        $timestamp = new \DateTime();
        return array(
            '_id' => $key,
            'result' => $result,
            'timestamp' => $timestamp->format('c')
        );
    }

    /**
     * 
     * @param Request $request
     * @param type $id - in imdb format tt1553656
     * @return string
     */
    function imdbRecommends(Request $request, $id) {

        try {
            $response = $this->client->get('http://www.imdb.com/title/' . $id, [ 'headers' => $this->headers]);
            $response2 = $this->client->get('http://m.imdb.com/title/' . $id, [ 'headers' => $this->headers]);

//            $response = $this->client->get('http://www.google.co.uk' );
            $result = $this->crawler->getRecommendations($response->getBody()->getContents(), $response2->getBody()->getContents());
        } catch (ClientException $e) {
            $result = '{error}';
        }

        return new Response($result, 200, array('Content-Type' => 'application/json'));
    }

    /**
     * 
     * function return true if $date is equal or more than $expiryDays from today
     * 
     * @param string $date
     * @param int $expiryDays
     * @return boolean
     */
    function expiryCheck($date, $expiryDays = 7) {

        return ( round(abs(time() - strtotime($date)) / 86400) >= $expiryDays );
    }

}
