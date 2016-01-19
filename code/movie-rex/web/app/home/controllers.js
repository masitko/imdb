
var homeControllers = angular.module('homeControllers', ['ngResource', 'homeServices']);

homeControllers.controller('SearchController', ['$scope', '$log', '$resource', '$timeout', '$location', 'loadingService',
    function ($scope, $log, $resource, $timeout, $location, loadingService) {

        var fuzzySearch = $resource('/fs/:title');
        var enterSearch = $resource('/s/:title');
        var sugestionsSearch = $resource('/t/:id');
        var searchContainer = [];

        $scope.searchContainer = [];
        $scope.selectedTitle = null;
        $scope.movieTitle = '';
        $scope.suggestionsData = [];
        $scope.suggestions = [];


        $scope.loadingService = loadingService;

        $scope.$watch('includeTV', function () {
            $scope.updateSuggestions();
//            $log.info('TV: ' + $scope.includeTV);
        });

        $scope.$watch(function () {
            return searchContainer;
        }, function () {
            $scope.updateTitleList();
        });

        $scope.$watch('suggestionsData', function () {
            $scope.updateSuggestions();
        });

        $scope.$on('$locationChangeSuccess', function (event, newLocation, oldLocation) {
            if ($location.path().length > 0) {
                $scope.hashChanged($location.path());
            }
        });

        $timeout(function () {
            $scope.includeTV = true;
            $('body').addClass('loaded');

            if (mobileVersion == false) {
                TweenMax.from($('#home-search'), 2.5, {ease: Bounce.easeOut, top: -600});
                TweenMax.from($('#rexinfo'), 1, {opacity: 0, delay: 2.5});
            } else {
                TweenMax.from($('#home-search h1'), 2.5, {ease: Bounce.easeOut, top: -600});
                TweenMax.from($('#mobileSearch'), 1, {top: -200, delay: 1.5});
                TweenMax.from($('#rexinfo h2'), 1, {delay: 1.5, opacity: 0});
                TweenMax.from($('#rexinfo p'), 1, {delay: 1.5, opacity: 0, y: '+=6'});
            }
        });

        $scope.titleChange = function () {
            if ($scope.movieTitle.length === 0) {
                $scope.clearSearchContainer();
                return;
            }
            var searchFor = $scope.movieTitle.replace(/ /g, '_').toLowerCase();
            $scope.selectedTitle = null;
            fuzzySearch.get({title: searchFor}, function (data) {
                searchContainer = data.d;
                angular.forEach(searchContainer, function (title, key) {
                    title.img = title.i === undefined ? '/img/no-poster.png' : (function () {
                        var ia = title.i[0].split('.');
                        var type = ia.pop();
                        ia.pop();
                        ia.push('_V1', '_UX40_CR0,0,40,54_', type);
                        return ia.join('.');
                    })();
                    title.movie = (title.q !== undefined) && (title.q.search(/(movie|feature)/) !== -1);
                    title.tv = (title.q !== undefined) && (title.q.search(/TV series/) !== -1);
                    title.title = title.l;
                    title.additional = '(' + title.y + ')';
                });
                // remove all non-tv or non-movie items
                searchContainer = searchContainer && searchContainer.filter(function (title) {
                    return title.movie || title.tv;
                });
            });
        };

        $scope.titleEnter = function () {
            var searchFor = $scope.movieTitle.replace(/ /g, '_').toLowerCase();
            $scope.selectedTitle = null;
            enterSearch.query({title: searchFor}, function (data) {
                searchContainer = data;
                angular.forEach(searchContainer, function (title, key) {
                    title.img = title.image === undefined ? '/img/no-poster.png' : (function () {
                        var ia = title.image.split('.');
                        var type = ia.pop();
                        ia.pop();
                        ia.push('_UX40_CR0,0,40,54_', type);
                        return ia.join('.');
                    })();
                    title.movie = true;
                    title.tv = (title.q !== undefined) && (title.q.search(/TV/) !== -1);
                });
                $scope.updateTitleList();
            });
        };

        $scope.hashChanged = function (hash) {
            var hashArray = hash.split('/');
            hashArray.shift();
            switch (hashArray[0]) {
                case 'rex':
                    sugestionsSearch.query({id: hashArray[1]}, function (data) {
                        if (data !== undefined) {
                            $('.title-box').val(hashArray[2].replace(/_+/g, ' ').replace(/\w\S*/g, function (txt) {
                                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                            }));
                            //clear the welcome text 
                            $('#rexinfo').css('margin-top', '0').css('padding', '10px 6px 1px').css('max-width', '600px').html("<p>Film and TV recommendations based on '" + $('.title-box').val() + "'</p>");

                            $scope.displaySuggestions(data);
                        }
                    });
                    break;
            }
        };

        $scope.displaySuggestions = function (titles) {
            //clear tooltips
            $('#home-search').attr('class', 'rawr');
            $timeout(function () {
                $('#home-search').attr('class', '');
            }, 1500);
//            $('#suggestive-slider').html('');

            //clear the welcome text 
            $('#rexinfo').css('opacity', '0');

            angular.forEach(titles, function (title, key) {
                title.titleShort = title.title.trimToLength(40); //create short title
                var image;
                if (title.image) {
                    var ia = title.image.split('.');
                    var type = ia.pop();
                    var cropText = cropImage(ia.pop());
                    ia.push(cropText);
                    ia.push(type);
                    title.image = ia.join('.');
                }
                else {
                    var cropText = 'ACB35';
                }
                var outline = title.outline;
                if (outline == null || outline.indexOf('Plot is unknown.') !== -1) {
                    outline = '<em>RAWR! MovieRex doesn\'t know the plot to this film yet. Check back later</em>';
                } else {
                    outline = outline.trimToLength(260);
                }
                title.outline = outline;

                title.posterCheck = '';
                if (cropText.substring(1, 5) === 'CB35') {
                    title.image = '/img/no-poster.png';
                    title.posterCheck = 'no-poster';
                }
                title.imdbScore = '';
                if (title.rating) {
                    title.imdbScore = title.rating;
                } else {
                    title.imdbScore = '?';
                }
                title.id = title.imdbId;
                title.movie = title.years && (title.years.indexOf('Series') === -1) && (title.years.indexOf('–') === -1);

            });
            $scope.suggestionsData = titles;
        };

        $scope.updateTitleList = function () {
            if (searchContainer === undefined) {
                return;
            }
            $scope.searchContainer = searchContainer.filter(function (title) {
                return title.movie || (title.tv && $scope.includeTV);
            });
        };

        $scope.updateSuggestions = function () {
            if ($scope.suggestionsData === undefined) {
                return;
            }
            $scope.suggestions = $scope.suggestionsData.filter(function (title) {
                return title.movie || $scope.includeTV;
            });

            $scope.initSLider();
        };

        $scope.titleBoxKeyDown = function (e) {
            if ($scope.searchContainer.length > 0) {
                switch (e.which) {
                    case 40:
                        if ($scope.selectedTitle === null) {
                            $scope.selectedTitle = 0;
                        }
                        else {
                            if ($scope.searchContainer.length - 1 > $scope.selectedTitle) {
                                $scope.selectedTitle++;
                            }
                        }
                        break;
                    case 38:
                        if ($scope.selectedTitle === null) {
                            $scope.selectedTitle = $scope.searchContainer.length - 1;
                        }
                        else {
                            if ($scope.selectedTitle > 0) {
                                $scope.selectedTitle--;
                            }
                        }
                        break;
                }
                $scope.scFocus();
            }

        };

        $scope.clearSearchContainer = function () {
            searchContainer = [];
            $scope.selectedTitle = null;
        };

        $scope.scFocus = function () {
            $timeout(function () {
                angular.element('li.selected').focus();
                angular.element('.title-box').focus();
            });
        };

        $scope.movieRex = function (id, title) {
            $location.path("rex/" + id + "/" + title.replace(/\s+/g, '_').toLowerCase());
            ga('send', 'event', 'Movies', 'search', title);
            ga('set', 'page', window.location.hash);
            ga('send', 'pageview');
            $scope.clearSearchContainer();
        };

        $scope.initSLider = function () {
            //destroy and empty the slider if it exists
            if ($('#suggestive-slider').hasClass('slick-initialized')) {
                $('#suggestive-slider').slick('unslick');
            }
            //mobile settings
            if (mobileVersion === true) {
                $('#slider-container').css('bottom', '0');
            } else {
                $('#slider-container').css('bottom', 'initial');
            }
            $timeout(function () {
                $('#suggestive-slider').slick({
                    slidesToShow: 4,
                    slidesToScroll: 4,
                    speed: 1200,
                    //                    swipeToSlide: true,
                    prevArrow: '<a class="slider-control slick-prev transition"></a>',
                    nextArrow: '<a class="slider-control slick-next transition"></a>',
                    responsive: [
                        {
                            breakpoint: 500,
                            settings: {
                                slidesToShow: 1,
                                slidesToScroll: 1,
                                infinite: true,
                                speed: 300
                            }
                        },
                        {
                            breakpoint: 1600,
                            settings: {
                                slidesToShow: 3,
                                slidesToScroll: 3,
                                infinite: true,
                                speed: 1200
                            }
                        }
                    ]
                });

                //animate the slides in on creation and focus on slider
//                $('#suggestive-slider').on('init', function () {
//                    var tl = new TimelineMax();
//                    var $slides = $('.slick-slide');
//                    tl.staggerFrom($('.slick-slide'), 1, {x: 1000}, 0.1);
//                    $('.slick-track').attr('tabindex', '1');
//                    $timeout(function () {
//                        $('.slick-track').focus();
//                    }, 200);
//                });

                //synopsis hovers
                var timeoutHover;
                $('.suggestion').mouseenter(function () {
                    clearTimeout(timeoutHover);
                    $('#slider-container').addClass('hover');
                });
                $('.suggestion').mouseleave(function () {
                    timeoutHover = setTimeout(function () {
                        $('#slider-container').removeClass('hover');
                    }, 250);

                });


            });
        };

    }]);


