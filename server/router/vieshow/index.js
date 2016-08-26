'use strict';

var $ = require('cheerio');
var request = require('request');

var lib = require('../../lib');
var basicUrl = 'https://sales.vscinemas.com.tw/vsTicketing/ticketing/';
var url = basicUrl + 'ticket.aspx';
var prefix = '?cinema=';
var vieshowLib = require('./vieshowLib');
var basicBookUrl = 'https://sales.vscinemas.com.tw/Ticketing/';
var fs = require('fs');

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
    this.set("Access-Control-Allow-Origin", "http://localhost:8000");
    this.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    this.set('Access-Control-Allow-Credentials', 'true');
    this.response.body = {
        data: cinemas
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

    this.set("Access-Control-Allow-Origin", "http://localhost:8000");
    this.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    this.set('Access-Control-Allow-Credentials', 'true');

    this.response.body = {
        data: movies
    }
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
    let movieInfo = vieshowLib.parseListToInfo(infoLists);
    dayInfo.push(movieInfo);
    for (let i = 0; i < timeLists.length; i++) {
        vieshowLib.parseListToBookInfo(timeLists[i], dayInfo);
    };

    this.set("Access-Control-Allow-Origin", "http://localhost:8000");
    this.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    this.set('Access-Control-Allow-Credentials', 'true');

    this.response.body = {
        data: dayInfo
    }
}

function* getSeat() {
    var body = yield vieshowLib.getSeat(this.params.href);

    var seatBody = $(body).html('.Seating-Theatre');
    console.log(seatBody);
    fs.writeFile('seat.html', seatBody.html(), (err) => {
        if (err) throw err;
        console.log('It\'s saved!');
    });
}

module.exports.register = (router) => {
    router.get('/vieshow/cinemaList', getCinemaList);
    router.get('/vieshow/movieList/:id', getMovieList);
    router.get('/vieshow/movieTime/:id', getMovieTime);
    router.get('/vieshow/seat/:href', getSeat);
};