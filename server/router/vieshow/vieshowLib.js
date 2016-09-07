'use strict';

let $ = require('cheerio');
let request = require('request');

request = request.defaults({ jar: true });

exports.parseListToInfo = function (lists) {
    let movieInfo = {
        date: '',
        time: '',
        href: '',
    };
    lists.map((index, list) => {
        let movieObj = list.children[0];
        let info = movieObj.data;
        if (index == 0) {
            movieInfo.date = info;
        }
        if (index == 1) {
            movieInfo.time = info;
        }
        if (index == 2) {
            movieInfo.href = info;
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
            let href = bookList[i].children[0].attribs.href;
            bookObj.href = href.split('?')[1];
            dayInfo.push(bookObj);
        }
    }
    return dayInfo;
}

exports.getSeat = function (param, callback) {
    return new Promise(function (resolve, reject) {
        var nextUrl = 'https://sales.vscinemas.com.tw/Ticketing/visSelectTickets.aspx?agree=on&'
        nextUrl += param;
        var finaurl = 'https://sales.vscinemas.com.tw/Ticketing/visSelectSeats.aspx?visLang=1';

        request.get(nextUrl, function (err, res, body) {
            var form = parseForm(res.body);
            request.post({ url: nextUrl, formData: form }, function (err, res, body) {
                request.get(finaurl, function (err, res, body) {
                    if (err) {
                        return false;
                    }
                    resolve(body);
                });
            });
        });
    });
}

function parseForm(body) {
    var formData = require('./config/formData');
    var __VIEWSTATE = $(body).find('#__VIEWSTATE')[0].attribs.value;
    var __EVENTARGUMENT = '';
    var __VIEWSTATEGENERATOR = $(body).find('#__VIEWSTATEGENERATOR')[0].attribs.value;
    var __EVENTVALIDATION = $(body).find('#__EVENTVALIDATION')[0].attribs.value;
    //var VistaUserSessionId = $(body).find('#VistaUserSessionId')[0].attribs.value;
    formData.__VIEWSTATE = __VIEWSTATE;
    formData.__EVENTARGUMENT = __EVENTARGUMENT;
    formData.__VIEWSTATEGENERATOR = __VIEWSTATEGENERATOR;
    formData.__EVENTVALIDATION = __EVENTVALIDATION;
    return formData;
    //formData.VistaUserSessionId = VistaUserSessionId;
}

exports.getTitle = function (resBody) {
    let titleBody = $(resBody).find('#theater');
    var title = '';
    var titleList = titleBody[0].children;
    for (var index in titleList) {
        if (titleList[index].attribs && titleList[index].attribs.selected) {
            title = titleList[index].children[0].data;
        }
    }
    return title;
}

exports.getTitleList = function (resBody) {
    let titleBody = $(resBody).find('#theater');
    var title = '';
    var titleList = titleBody[0].children;
    var result = [];

    for (var index in titleList) {
        if (titleList[index].attribs && !titleList[index].attribs.selected) {
            var titleObj = {
                title: '',
                id: '',
            }
            titleObj.title = titleList[index].children[0].data;
            titleObj.id = titleList[index].attribs.value;
            result.push(titleObj);
        }
    }
    return result;
}