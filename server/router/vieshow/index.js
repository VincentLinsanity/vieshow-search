'use strict';

var $ = require('cheerio');
var request = require('request');

var lib = require('../../lib');
var basicUrl = 'https://sales.vscinemas.com.tw/vsTicketing/ticketing/';
var url = basicUrl + 'ticket.aspx';
var prefix = '?cinema=';
var vieshowLib = require('./vieshowLib');
var basicBookUrl = 'https://sales.vscinemas.com.tw/Ticketing/';

/**
 * function getCinemaList
 * get cinema list url = url
 */
function* getCinemaList() {
    let resBody = yield lib.parseBody(url).then((body) => {
        return body;
    });
    let body = $(resBody).find('#theater').children();

    var cinemas = [];
    body.map((index, list) => {
        let cinemaName = list.children[0].data;
        let postfix = list.attribs.value;
        let cinemaUrl = url + prefix + postfix;
        let cinemaObj = {
            'cinemaName': cinemaName,
            'cinemaID': postfix,
            'cinemaUrl': cinemaUrl
        }
        cinemas.push(cinemaObj);
    });
    cinemas.shift();
    this.response.body = {
        cinemaList: cinemas
    };
}

/**
 * function getMovieList
 * get movie list url = url + prefix + cinemaId
 */
function* getMovieList() {
    let cinemaId = this.params.id;
    let movieUrl = url + prefix + cinemaId;
    let resBody = yield lib.parseBody(movieUrl).then((body) => {
        return body;
    });
    let body = $(resBody).find('.movieList').children();

    let movies = [];
    body.map((index, list) => {
        let movieList = list.children[0];
        let movieHref = movieList.attribs.href;
        let movieName = movieList.children[0].data;
        let movieObj = {
            'movieName': movieName,
            'movieHref': movieHref.substr(1)
        }
        movies.push(movieObj);
    });

    var html = "<div class='list-group'>";
    for (var movie in movies) {
        html　+=
            "<a href=http://localhost:9001/vieshow/movieTime/" + movies[movie].movieHref
          + " class='list-group-item list-group-item-success'>" + movies[movie].movieName + "</a>"
          ;
    }
    html += "</div>";

    this.response.body = html;
        
}

/**
 * function getMovieTime
 * get movie time url = url + ? + movieHref
 */
function* getMovieTime() {
    let movieTimeId = this.params.id;
    let movieTimeUrl = url + '?' + movieTimeId;
    console.log(movieTimeUrl);

    let resBody = yield lib.parseBody(movieTimeUrl).then((body) => {
        return body;
    });
    let infoLists = $(resBody).find('.movieDescribe').children();
    let timeLists = $(resBody).find('.movieDay');

    let dayInfo = [];
    for (let i = 0; i < timeLists.length; i++ ) {
        vieshowLib.parseListToBookInfo(timeLists[i], dayInfo);
    };
    console.log(dayInfo);

    let movieInfo = vieshowLib.parseListToInfo(infoLists);
    console.log(movieInfo);

    // 
    // step1 basicUrl/booking.aspx?cinemacode=1&txtSessionId=1067212

    // step2 get bookUrl/visSelectTickets.aspx?agree=on&cinemacode=1&txtSessionId=1067214
    // step3 post bookUrl/visSelectTickets.aspx?agree=on&cinemacode=1&txtSessionId=1067214
    // setop4 get bookUrl/visSelectSeats.aspx?visLang=1
}

module.exports.register = (router) => {
    router.get('/vieshow/cinemaList', getCinemaList);
    router.get('/vieshow/movieList/:id', getMovieList);
    router.get('/vieshow/movieTime/:id', getMovieTime);
};