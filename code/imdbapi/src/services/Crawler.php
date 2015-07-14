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
  
//        var_dump($node);
        $rec = [
            'imdbId' => $node->attr["data-tconst"],
            'title'  => $node->find('.rec-title > a > b')[0]->innertext,
            'years'  => $node->find('.rec-title > span.nobr')[0]->innertext,
        ];
        
        return $rec;
    }
    
}
