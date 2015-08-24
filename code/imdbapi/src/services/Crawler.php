<?php

namespace imdb\services;

use Sunra\PhpSimple\HtmlDomParser;

class Crawler {

    public function getRecommendations($html, $html2 = null) {

        $dom = HtmlDomParser::str_get_html($html);
        $dom2 = HtmlDomParser::str_get_html($html2);
        
        $elem = $dom->find('.rec_overviews', 0);
        $elem2 = $dom2->find('#sims', 0);
        
        $result = [];
        foreach( $elem->children as $child ) {
            $result[] = $this->parseRecommendation($child, $elem2 );
        }

       return json_encode($result);
    }

    
    private function parseRecommendation( $node, $elem2 ) {
        
        $id = $node->attr["data-tconst"];
        $directors = explode(':',$node->find('.rec-director', 0)->plaintext);
        $rec = [
            'imdbId' => $id,
            'title'  => $node->find('.rec-title > a > b', 0)->plaintext,
            'years'  => $node->find('.rec-title > span.nobr', 0)->plaintext,
            'genres' => $node->find('.rec-cert-genre', 0)->plaintext,
            'rating' => $node->find('.rating-rating > span.value', 0)->plaintext,
            'outline' => $node->find('.rec-outline > p', 0)->plaintext,
            'actors' => trim(ltrim($node->find('.rec-actor', 0)->plaintext, 'Stars: ')),
            'director' => sizeof($directors)>1?trim($directors[1]):"",
            'image' => $elem2->find('li[data-tconst="'.$id.'"] > img', 0)->attr["src"]
        ];
        
        return $rec;
    }
    
}
