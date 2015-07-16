<?php

namespace imdb\services;

use Sunra\PhpSimple\HtmlDomParser;

class Crawler {

    public function getRecommendations($html) {

        $dom = HtmlDomParser::str_get_html($html);
        
        $elem = $dom->find('.rec_overviews');
        
        $result = [];
        foreach( $elem[0]->children as $child ) {
            $result[] = $this->parseRecommendation($child);
        }

       return json_encode($result);
    }

    
    private function parseRecommendation( $node ) {
        
        $directors = explode(':',$node->find('.rec-director', 0)->plaintext);
        $rec = [
            'imdbId' => $node->attr["data-tconst"],
            'title'  => $node->find('.rec-title > a > b', 0)->plaintext,
            'years'  => $node->find('.rec-title > span.nobr', 0)->plaintext,
            'genres' => $node->find('.rec-cert-genre', 0)->plaintext,
            'rating' => $node->find('.rating-rating > span.value', 0)->plaintext,
            'outline' => $node->find('.rec-outline > p', 0)->plaintext,
            'actors' => trim(ltrim($node->find('.rec-actor', 0)->plaintext, 'Stars: ')),
            'director' => sizeof($directors)>1?trim($directors[1]):"",
        ];
        
        return $rec;
    }
    
}
