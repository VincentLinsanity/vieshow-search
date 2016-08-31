'use strict';

var $ = require('cheerio');
var request = require('request');

var lib = require('../../lib');
var basicUrl = 'https://sales.vscinemas.com.tw/vsTicketing/ticketing/';
var url = basicUrl + 'ticket.aspx';
var prefix = '?cinema=';
var vieshowLib = require('./vieshowLib');
var fs = require('fs');
var dirName = require('path').dirname;

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
        data: cinemas
    };
}

/**
 * function getMovieList
 * get movie list url = url + prefix + cinemaId
 */
function* getMovieList() {
    var cinemaId = this.params.id;
    var movieUrl = url + prefix + cinemaId;
    var resBody = yield lib.parseBody(movieUrl).then((body) => {
        return body;
    });
    var body = $(resBody).find('.movieList').children();
    var movies = [];
    var title = vieshowLib.getTitle(resBody);
    movies.push({movieName: title});
    body.map((index, list) => {
        var movieList = list.children[0];
        var movieHref = movieList.attribs.href;
        var movieName = movieList.children[0].data;
        var movieObj = {
            'movieName': movieName,
            'movieHref': movieHref.substr(1)
        }
        movies.push(movieObj);
    });

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
    var title = vieshowLib.getTitle(resBody);
    dayInfo.push({date:title});
    let movieInfo = vieshowLib.parseListToInfo(infoLists);
    dayInfo.push(movieInfo);
    for (let i = 0; i < timeLists.length; i++) {
        vieshowLib.parseListToBookInfo(timeLists[i], dayInfo);
    };

    this.response.body = {
        data: dayInfo
    }
}

function* getSeat() {
    var href = this.params.href;
    var result = null;
    var body = null;
    try {
        result = fs.readFileSync(__dirname + '/store/' + href + '.html');
    } catch (err) {
        body = yield vieshowLib.getSeat(href);
        result = arrangeBody(body);
        writeFile(result, href);
    }
    if (!result) return;

    this.response.body = {
        data: result.toString()
    };
}

function arrangeBody(body) {
    var basicBody = '<div class="Seating-Theatre" style="width:450px;height:225px;" data-originalsize="225"></div>';
    var seatBody = $(body).find('.Seating-Theatre');
    return $(basicBody).prepend(seatBody);
}

function writeFile(data, path) { 
    fs.writeFile(__dirname + '/store/' + path + '.html',
        data.toString(), (err) => {
            if (err) throw err;
        });
}

module.exports.register = (router) => {
    router.get('/vieshow/cinemaList', getCinemaList);
    router.get('/vieshow/movieList/:id', getMovieList);
    router.get('/vieshow/movieTime/:id', getMovieTime);
    router.get('/vieshow/seat/:href', getSeat);
};