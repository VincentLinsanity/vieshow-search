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
            request.post({ url: nextUrl, formData: formData }, function (err, res, body) {
                request.get(finaurl, function (err, res, body) {
                    resolve (body);
                });
            });
        });
    });
}

var formData = {
    '__EVENTTARGET': 'ctl00$ContentBody$ibtnOrderTickets',
    '__EVENTARGUMENT': '',
    '__VIEWSTATE': '/wEPDwUKLTY2OTkxMDc3Mg9kFgJmD2QWAgIDD2QWAgIBD2QWBAIEDw8WAh4HVmlzaWJsZWhkFgJmD2QWDGYPDxYCHgRUZXh0BQ3lqIHnp4Ag5pyD5ZOhZGQCAQ8PFgIfAQUM56uL5Y2z55m75YWlZGQCAg8PFgIfAQVx5oKo5b+F6aCI55m75YWl5omN6IO96YCy6KGMLuiri+WcqOS4i+aWuei8uOWFpeaCqOeahOS/oeaBry7lpoLmgqjpgoTkuI3mmK/mnIPlk6Hmgqjlj6/ku6XpgJrpgY7ku6XkuIvpgKPntZDoqLvlhopkZAIEDw8WBB8BBRvlv5joqJjlr4bnorzjgIHos4fmlpnkv67mlLkeC05hdmlnYXRlVXJsBTgvL3NhbGVzLnZzY2luZW1hcy5jb20udHcvQnJvd3NpbmcvTG95YWx0eS9Gb3Jnb3RQYXNzd29yZGRkAgUPDxYEHwEFDOWKoOWFpeacg+WToR8CBTIvL3NhbGVzLnZzY2luZW1hcy5jb20udHcvQnJvd3NpbmcvTG95YWx0eS9TaWduVXAvMmRkAgYPDxYCHwEFDOeri+WNs+eZu+WFpWRkAgUPZBYIAgEPZBYIAgEPDxYCHwEFDeWogeengCDmnIPlk6FkZAIDDw8WAh8BBRXmgqjnm67liY3lsJrmnKrnmbvlhaVkZAIFDw8WBB8BBQznq4vljbPnmbvlhaUfAgUBI2RkAgcPD2QWAh4Fc3R5bGUFDWRpc3BsYXk6bm9uZTsWBgIBDw8WBB8BBRvlv5joqJjlr4bnorzjgIHos4fmlpnkv67mlLkfAgU4Ly9zYWxlcy52c2NpbmVtYXMuY29tLnR3L0Jyb3dzaW5nL0xveWFsdHkvRm9yZ290UGFzc3dvcmRkZAICDw8WBB8BBQzliqDlhaXmnIPlk6EfAgUyLy9zYWxlcy52c2NpbmVtYXMuY29tLnR3L0Jyb3dzaW5nL0xveWFsdHkvU2lnblVwLzJkZAIDDw8WAh8BBQznq4vljbPnmbvlhaVkZAICDw8WAh8AaGQWBAIBDw8WAh8BBQ3lqIHnp4Ag5pyD5ZOhZGQCCQ8PFgIfAQUG55m75Ye6ZGQCBQ8PFgIfAQUBMWRkAgYPDxYCHwEFBzEwNzEyNDZkZGSwbg15VY7VVO6oxXBf838StZeQpy7Kc4+pGKksCdSq7Q==',
    '__VIEWSTATEGENERATOR': '1923BA21',
    '__EVENTVALIDATION': '/wEdAA4nXLt9DcGrfPkiTP+GoZErJEe3Vs7uRA825ZCV4pqpi4MM/whuCcxJUOuuu2qqE6CZ4s/j0RpNuWCP69XYAAp206fhldqDZu8T2fYDgPCHqJ33kTlPq/4nMdyZH1vUjLyDuxuG3MafB9oerxAcWzdurunBdtzgTQvSeirn20oRmNfkCsmFAn4naBRM/XYApoZbkJLReHVlbZSlxun9fPcwDYpms/Q4dUVDQz2IEuRaPxQv085c8o1suJHAmfJiaNlOOg4zSkagU/cis/f4YEd7fJvbP6q097bs8FuSaHN+iQQ1qAAC2hdUbygtL/SKek4O0DwrE6sfSFZJRP/S129u',
    'ticket-0001;ltyRecogId-;ltyRecogSeqNo-0': 1,
    'ticket-0143;ltyRecogId-;ltyRecogSeqNo-0': 0,
    'ticket-0903;ltyRecogId-;ltyRecogSeqNo-0': 0,
    'ticket-0913;ltyRecogId-;ltyRecogSeqNo-0': 0,
    'ticket-0150;ltyRecogId-;ltyRecogSeqNo-0': 0,
    'third-party-member-ticket-card-number': '',
    'VistaUserSessionId': '38faf160518c4455a05669d1a30324de',
    'ctl00$ContentBody$txtTechnicalDetails': '',
    'ctl00$ContentBody$txtDoNotRehydrate': '',
    'ctl00$ContentBody$txtAllocatedSeating': '',
    'ctl00$ContentBody$txtForceSeatSelection': 'Y',
    'ctl00$ContentBody$txtEnableManualSeatSelection': 'Y',
    'ctl00$ContentBody$txtHideAllVoucherRows': '',
    'ctl00$ContentBody$txtEnableConcessionSales': 'Y',
    'ctl00$ContentBody$txtVoucherSubmit': '',
    'ctl00$ContentBody$txtVoucherPINSubmit': '',
    'ctl00$ContentBody$txtDateOrderChanged': '',
    'ctl00$ContentBody$txtCancelOrder': ''
}

function parseForm(body) {
    var __VIEWSTATE = $(body).find('#__VIEWSTATE')[0].attribs.value;
    var __EVENTARGUMENT = '';
    var __VIEWSTATEGENERATOR = $(body).find('#__VIEWSTATEGENERATOR')[0].attribs.value;
    var __EVENTVALIDATION = $(body).find('#__EVENTVALIDATION')[0].attribs.value;
    //var VistaUserSessionId = $(body).find('#VistaUserSessionId')[0].attribs.value;
    formData.__VIEWSTATE = __VIEWSTATE;
    formData.__EVENTARGUMENT = __EVENTARGUMENT;
    formData.__VIEWSTATEGENERATOR = __VIEWSTATEGENERATOR;
    formData.__EVENTVALIDATION = __EVENTVALIDATION;
    //formData.VistaUserSessionId = VistaUserSessionId;
}