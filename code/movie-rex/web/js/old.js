
        //animate loading on ajax calls
//        $(document).ajaxStart(function () {
//            $('body').toggleClass('searching');
//        });
//        $(document).ajaxComplete(function () {
//            $('body').toggleClass('searching');
//        });

        //DOCUMENT READY =======================================================
        $(function () {

            //for browsers that don't support pointer-events:none
            $('#home-logo').click(function () {
                setTimeout(function () {
                    $('.title-box').focus();
                }, 0.01);
            });

            //sync checkboxes
//            $("#tv").change(function () {
//                $("#tvm").prop("checked", this.checked);
//            });
//            $("#tvm").change(function () {
//                $("#tv").prop("checked", this.checked);
//            });

//            setTitleBoxEvents();

            //fade in and animate logo
            $('body').addClass('loaded');
            var homeSearch = $('#home-search');

            if (mobileVersion == false) {
                TweenMax.from(homeSearch, 2.5, {ease: Bounce.easeOut, top: -600});
                TweenMax.from($('#rexinfo'), 1, {opacity: 0, delay: 2.5});
            } else {
                TweenMax.from($('#home-search h1'), 2.5, {ease: Bounce.easeOut, top: -600});
                TweenMax.from($('#mobileSearch'), 1, {top: -200, delay: 1.5});
                TweenMax.from($('#rexinfo h2'), 1, {delay: 1.5, opacity: 0});
                TweenMax.from($('#rexinfo p'), 1, {delay: 1.5, opacity: 0, y: '+=6'});
            }
            //typing class
            $('.title-box').focus(function () {
                this.placeholder = '';
                $('body').addClass('typing');
            });
            $('.title-box').click(function () {
                this.select();
            });
            $('.title-box').blur(function () {
                this.placeholder = 'Tell me a movie you like';
                $('body').removeClass('typing');
            });


            //tooltips
            $('.title-box').keyup(function (e) {
                setTimeout(function () {
                    if ($('.title-box').val().length > 1) {
                        if ($('.search-list li').length > 0) {
                            $('#home-search').attr('class', 'choose');
                        } else if (($('.search-list li').length === 0)) {
                            $('#home-search').attr('class', 'spell');
                        }
                    } else {
                        $('#home-search').attr('class', '');
                    }
                }, 900);
            });

            //empty searchAssist
            $('#slider-container').click(function () {
                $('.search-list').html('');
            });

            if (window.location.hash.length > 0) {
                hashChanged();
            }

            window.onhashchange = hashChanged;

        });//end of doc ready

        function getSearchData(title) {
            var url = "/s";
            $.ajax({
                url: url + '/' + title
            }).success(function (data) {
                if (data !== undefined) {
                    displaySearchTitles(data);
                }
            });
        }
/*
        //search Assist
        function getSearchAssist(title) {
            var url = "{{ url('_imdb_api_fuzzy_search') }}";
            return $.ajax({
                global: false,
                url: url + '/' + title
            }).success(function (data) {
                if (data.d !== undefined) {
                    displaySearchAssist(data.d);
                }
            });
        }

        //search Assist results
        function displaySearchAssist(titles) {
            $('.search-list').html(''); //empty search assist
            $.each(titles, function (index, title) {
                var check1 = "movie";
                var check2 = "feature";
                var check3 = "TV series";
                var image = '/img/no-poster.png';

                if (title.i !== undefined) {
                    var ia = title.i[0].split('.');
                    var type = ia.pop();
                    ia.pop();
                    ia.push('_V1');
                    ia.push('_UX40_CR0,0,40,54_');
                    ia.push(type);
                    image = ia.join('.');
                }
                if ($('#tv').is(':checked') || $('#tvm').is(':checked')) {
                    if (title.q && (title.q.indexOf(check3) !== -1)) {
                        var tvId = ' TV';
                    } else {
                        var tvId = '';
                    }
                    if (title.q && (title.q.indexOf(check1) !== -1 || title.q.indexOf(check2) !== -1 || title.q.indexOf(check3) !== -1)) {
                        var html = '<li><div class="row title-container" data-id="' + title.id + '" data-title="' + title.l + '"><div class="columns small-2 fuzzy-image"><img src="' + image + '" alt="' + title.l + '"/></div><div class="columns small-10 fuzzy-title"><strong>' + title.l + '</strong> (' + title.y + ')' + tvId + '</div></div></li>';
                        $('.search-list').append(html);
                    }
                }
                else {
                    if (title.q && (title.q.indexOf(check1) !== -1 || title.q.indexOf(check2) !== -1)) {
                        var html = '<li><div class="row title-container" data-id="' + title.id + '" data-title="' + title.l + '"><div class="columns small-2 fuzzy-image"><img src="' + image + '" alt="' + title.l + '"/></div><div class="columns small-10 fuzzy-title"><strong>' + title.l + '</strong> (' + title.y + ')</div></div></li>';
                        $('.search-list').append(html);
                    }
                }
                searchAssistSelect();
            });
                
            //Move title into input field, toggle searching class, start search
            $('.title-container').click(function (e) {
                $('.title-box').val($(this).data('title'));
                movieRex($(this).data('id'), $(this).data('title')); //find recommendations
        {#                    $('body').toggleClass('searching');#}
                    $('#home-search').attr('class', '');
                    return false;
                });

            }
                */

            //'enter' search results
/*            function displaySearchTitles(titles) {
                $('.search-list').html('');
                $.each(titles, function (index, title) {
                    var check1 = "TV";
                    var image = '/img/no-poster.png';

                    if (title.image !== undefined) {
                        var ia = title.image.split('.');
                        var type = ia.pop();
                        ia.pop();
                        ia.push('_UX40_CR0,0,40,54_');
                        ia.push(type);
                        image = ia.join('.');
                    }
                    if (title.title && (title.title.indexOf(check1) === -1)) {
                        var html = '<li tabindex="-1"><div class="row title-container" data-id="' + title.id + '" data-title="' + title.title + '"><div class="columns small-2 fuzzy-image"><img src="' + image + '" alt="' + title.title + '"/></div><div class="columns small-10 fuzzy-title"><strong>' + title.title + '</strong>' + title.additional + '</div></div></li>';
                        $('.search-list').append(html);
                    }
                    searchAssistSelect();
                });

                //Move title into input field, toggle searching class, start search
                $('.title-container').click(function (e) {
                    $('.title-box').val($(this).data('title'));
                    movieRex($(this).data('id'), $(this).data('title')); //find recommendations
                    $('#home-search').attr('class', '');
                    return false;
                });

            }
*/
//            function searchAssistSelect() {
//                liSelected = null;
//            }

            //crop poster images
            var cropImageX = 198;
            var cropImageY = 296;
            var multiply = cropImageY / 132;

            function cropImage(imageText) {
                var it = imageText.split('_');
                if (it[3] === undefined) {
                    return imageText;
                }
                it[2] = (it[2][1] === 'Y') ? 'UY' + cropImageY : 'UX' + cropImageX;
                it[3] = cropImageCR(it[3]);
                return it.join('_');
            }

            function cropImageCR(crText) {
                var ct = crText.split(',');
                ct[0] = 'CR' + (ct[0].substring(2) * multiply | 0);
                ct[2] = cropImageX;
                ct[3] = cropImageY;
                return ct.join(',');
            }

            function hashChanged() {
                var hash = window.location.hash;
                var hashArray = hash.split('/');
                console.log(hashArray);

                switch (hashArray[0]) {
                    case '#':
                        hashArray.shift();
                    case '#rex':
                    case '#!rex':
                        var url = "/t";
                        return $.ajax({
                            url: url + '/' + hashArray[1]
                        }).success(function (data) {
                            if (data !== undefined) {
                                $('.title-box').val(hashArray[2].replace(/_+/g, ' ').replace(/\w\S*/g, function (txt) {
                                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                                }));
                                //clear the welcome text 
                                $('#rexinfo').css('margin-top', '0').css('padding', '10px 6px 1px').css('max-width', '600px').html("<p>Film and TV recommendations based on '" + $('.title-box').val() + "'</p>");

                                displayRex(data);
                            }
                        });
                }
            }

            //Search for recommendations
/*           function movieRex(id, title) {
                window.location.hash = "#!rex/" + id + "/" + title.replace(/\s+/g, '_').toLowerCase();
                ga('send', 'event', 'Movies', 'search', title);
                ga('set', 'page', window.location.hash);
                ga('send', 'pageview');
                $('.search-list').html('');
            }
*/
            //display recommendations
            function displayRex(titles) {

                //empty the fuzzy search
//                $('.search-list').html('');

                //clear tooltips
                $('#home-search').attr('class', 'rawr');
                setTimeout(function () {
                    $('#home-search').attr('class', '');
                }, 1500);
                //destroy and empty the slider if it exists
                if ($('#suggestive-slider').hasClass('slick-initialized')) {
                    $('#suggestive-slider').slick('unslick');
                }
                $('#suggestive-slider').html('');

                //clear the welcome text 
                $('#rexinfo').css('opacity', '0');

                //remove searching class
//                        $('body').toggleClass('searching');

                //create results
                $.each(titles, function (index, title) {
                    var image1 = (title.i !== undefined) ? title.i[0] : '';
                    var titleShort = title.title.trimToLength(40); //create short title
                    var image;
                    if (title.image) {
                        var ia = title.image.split('.');
                        var type = ia.pop();
                        var cropText = cropImage(ia.pop());
                        ia.push(cropText);
                        ia.push(type);
                        image = ia.join('.');
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
                    var posterCheck = '';
                    if (cropText.substring(1, 5) === 'CB35') {
                        image = '/img/no-poster.png';
                        posterCheck = 'no-poster';
                    }
                    var imdbScore = '';
                    if (title.rating) {
                        imdbScore = title.rating;
                    } else {
                        imdbScore = '?';
                    }
                    //populate the slider 
                    if ($('#tv').is(':checked') || (title.years && (title.years.indexOf('Series') === -1))) {
                        if (mobileVersion === false) {
                            var html = '<div><div class="suggestion ' + posterCheck + '" style="background-image:url(' + image + ')" data-id="' + title.imdbId + '"><h4>' + titleShort + ' <i>' + title.years + '</i></h4><h5>' + imdbScore + '</h5><a class="rex-it" data-title="' + titleShort + '" data-id="' + title.imdbId + '">Rex this!</a><div class="synopsis"><h2>' + title.title + '</h2><span>' + title.genres + '</span>' + outline + '<hr/><strong>Director:</strong> ' + title.director + '<br/><strong>Stars:</strong> ' + title.actors + '</div></div></div>';
                        } else {
                            var html = '<div><div class="mobile-suggestion ' + posterCheck + '" data-id="' + title.imdbID + '"><div class="mobile-poster"><img src="' + image + '" alt="movie poster" /></div><h3><img src="img/imdb.png" alt="imdb"/>' + imdbScore + '</h3><h2>' + title.title + '</h2><h4>' + title.genres + '</h4></div><div class="mobile-synopsis"><strong>Director:</strong>' + title.director + ' <strong>Stars:</strong>' + title.actors + '<hr/><p>' + outline + '</p><a class="rex-it" data-title="' + titleShort + '" data-id="' + title.imdbId + '">Rex this!</a></div></div></div>';
                        }
                        ;
                        $('#suggestive-slider').append(html);

                    }
                });
                //mobile settings
                if (mobileVersion === true) {
                    $('#slider-container').css('bottom', '0');
                    $('#suggestive-slider').on('afterChange', function (event, slick, currentSlide) {
//                                $('#slider-container').animate({scrollTop: 0}).stop();
//                                $('#suggestive-slider').off('afterChange');

                    });

                } else {
                    $('#slider-container').css('bottom', 'initial');
                }
                //initialise the slider
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

                //rex it 
                $('.rex-it').click(function (e) {
                    $('.title-box').val($(this).data('title'));
                    movieRex($(this).data('id'), $(this).data('title')); //find recommendations
        //                    $('body').toggleClass('searching');
                });

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



            }

            //animate the slides in on creation and focus on slider
            $('#suggestive-slider').on('init', function () {
                var tl = new TimelineMax();
                var $slides = $('.slick-slide');
                tl.staggerFrom($('.slick-slide'), 1, {x: 1000}, 0.1);
                $('.slick-track').attr('tabindex', '1');
                setTimeout(function () {
                    $('.slick-track').focus();
                }, 200);
            });

            //truncation function
            String.prototype.trimToLength = function (m) {
                return (this.length > m)
                        ? jQuery.trim(this).substring(0, m).split(" ").slice(0, -1).join(" ") + "..."
                        : this;
            };


//        var liSelected = null;

//        function setTitleBoxEvents() {
            // callback for changes in title-box
/*            $('.title-box').on('input', function () {
                (this.value.length > 0) ? getSearchAssist(this.value.replace(/ /g, '_').toLowerCase()) : $('.search-list').html('');
            });

    
            $('.title-box').keyup(function (e) {
                switch (e.which) {
                    case 13: // if Enter 
                        if ($('li.selected').length > 0) {
                            $('li.selected .title-container').click();
                        }
                        else if ($('.title-box').val().length > 0) {
                            getSearchData(this.value.replace(/ /g, '_').toLowerCase());
                        }
                        break
                }
            });
*/
//            $('.title-box').keydown(function (e) {
//                if ($('.search-list li').length > 0) {
//                    switch (e.which) {
//                        case 40:
//                            $('li.selected').removeClass('selected');
//                            if (liSelected && liSelected.nextAll(':visible:first').length > 0) {
//                                liSelected = liSelected.nextAll(':visible:first');
//                            } else {
//                                liSelected = $('.search-list li').first();
//                            }
//                            liSelected.addClass('selected').focus();
//                            break;
//                        case 38:
//                            $('li.selected').removeClass('selected');
//                            if (liSelected && liSelected.prevAll(':visible:first').length > 0) {
//                                liSelected = liSelected.prevAll(':visible:first');
//                            } else {
//                                liSelected = $('.search-list li').last();
//                            }
//                            liSelected.addClass('selected').focus();
//                            break;
//                    }
//                    $('.title-box').focus();
//                }
//            });

//        }
