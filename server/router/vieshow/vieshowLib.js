'use strict';

let $ = require('cheerio');

exports.parseListToInfo = function (lists) {
    let movieInfo = {
        movieName: '',
        movieEngName: '',
        movieTime: '',
    };
    lists.map((index, list) => {
        let movieObj = list.children[0];
        let info = movieObj.data;
        if (index == 0) {
            movieInfo.movieName = info;
        }
        if (index == 1) {
            movieInfo.movieEngName = info;
        }
        if (index == 2) {
            movieInfo.movieTime = info;
        }
    });
    return movieInfo;
}

exports.parseListToBookInfo = function (lists, dayInfo) {
    let date = lists.children[1].children[0].data;
    let body = $(lists).children('.bookList');
    let bookList = body[0].children;
    let books = [];
    for (let i = 0; i < bookList.length; i++) {
        let bookObj = {
            'date': date,
            'time': '',
            'href': '',
        }
        if (bookList[i].children) {
            bookObj.time = bookList[i].children[0].children[0].data
            bookObj.href = bookList[i].children[0].attribs.href;
            dayInfo.push(bookObj);
        }
    }
    return dayInfo;
}