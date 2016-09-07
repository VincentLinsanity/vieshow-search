'use strict';

var fs = require('fs');
var $ = require('cheerio');
var request = require('request');
request = request.defaults({ jar: true });

var tickUrl = 'https://sales.vscinemas.com.tw/vsTicketing/ticketing/booking.aspx?cinemacode=1&txtSessionId=1067212';
var testUrl = 'https://sales.vscinemas.com.tw/Ticketing/visSelectTickets.aspx?agree=on&cinemacode=1&txtSessionId=1067212';
var finaurl = 'https://sales.vscinemas.com.tw/Ticketing/visSelectSeats.aspx?visLang=1';

// function test() {
//   request.get(tickUrl, function (err, res, body) {
//     console.log('step1');
//     request.get(testUrl, function (err, res, body) {
//       console.log('step2');
//       request.post({url: testUrl, formData: formData}, function (err, res, body) {
//         console.log('step3');
//         request.get(finaurl, function (err, res, body) {
//           console.log('step4');
//           console.log(body);
//           fs.writeFile('./tmp.html', body, function(err) {
//             console.log(err);
//           })
//         });
//       });
//     });
//   });


// }

function test(n) {
  var list = n.toString(2).split('');
  var d = 0;
  for (var i = 0; i < list.length; i++) {
    if (list[i] == 1) {
      for (var j = i + 1; j < list.length; j++) {
        if (list[j] == 1) {
          var td = j - i - 1;
          //i = j + 1;
          if (d < td) d = td;
          break;
        }
      }
    }
  }
  return d;
}

test1([0,1,2,3,4,5,6], 3);

function test1(array, k) {
  var n = array.length;
  var init = k;
  while(k > n) {
    k -= n;
  }
  if (k == 0) {
    return
  }
  k = n - k;
  var result = [];
  for (var i = k; i < n; i++) {
    result.push(array[i]);
  }
  for (var j = 0 ; j < k; j++) {
    result.push(array[j]);
  }
  return result;
}

var formData = {
  __EVENTTARGET: 'ctl00$ContentBody$ibtnOrderTickets',
  __EVENTARGUMENT: '',
  __VIEWSTATE: '/wEPDwUKLTY2OTkxMDc3Mg9kFgJmD2QWAgIDD2QWAgIBD2QWBAIEDw8WAh4HVmlzaWJsZWhkFgJmD2QWDGYPDxYCHgRUZXh0BQ3lqIHnp4Ag5pyD5ZOhZGQCAQ8PFgIfAQUM56uL5Y2z55m75YWlZGQCAg8PFgIfAQVx5oKo5b+F6aCI55m75YWl5omN6IO96YCy6KGMLuiri+WcqOS4i+aWuei8uOWFpeaCqOeahOS/oeaBry7lpoLmgqjpgoTkuI3mmK/mnIPlk6Hmgqjlj6/ku6XpgJrpgY7ku6XkuIvpgKPntZDoqLvlhopkZAIEDw8WBB8BBRvlv5joqJjlr4bnorzjgIHos4fmlpnkv67mlLkeC05hdmlnYXRlVXJsBTgvL3NhbGVzLnZzY2luZW1hcy5jb20udHcvQnJvd3NpbmcvTG95YWx0eS9Gb3Jnb3RQYXNzd29yZGRkAgUPDxYEHwEFDOWKoOWFpeacg+WToR8CBTIvL3NhbGVzLnZzY2luZW1hcy5jb20udHcvQnJvd3NpbmcvTG95YWx0eS9TaWduVXAvMmRkAgYPDxYCHwEFDOeri+WNs+eZu+WFpWRkAgUPZBYIAgEPZBYIAgEPDxYCHwEFDeWogeengCDmnIPlk6FkZAIDDw8WAh8BBRXmgqjnm67liY3lsJrmnKrnmbvlhaVkZAIFDw8WBB8BBQznq4vljbPnmbvlhaUfAgUBI2RkAgcPD2QWAh4Fc3R5bGUFDWRpc3BsYXk6bm9uZTsWBgIBDw8WBB8BBRvlv5joqJjlr4bnorzjgIHos4fmlpnkv67mlLkfAgU4Ly9zYWxlcy52c2NpbmVtYXMuY29tLnR3L0Jyb3dzaW5nL0xveWFsdHkvRm9yZ290UGFzc3dvcmRkZAICDw8WBB8BBQzliqDlhaXmnIPlk6EfAgUyLy9zYWxlcy52c2NpbmVtYXMuY29tLnR3L0Jyb3dzaW5nL0xveWFsdHkvU2lnblVwLzJkZAIDDw8WAh8BBQznq4vljbPnmbvlhaVkZAICDw8WAh8AaGQWBAIBDw8WAh8BBQ3lqIHnp4Ag5pyD5ZOhZGQCCQ8PFgIfAQUG55m75Ye6ZGQCBQ8PFgIfAQUBMWRkAgYPDxYCHwEFBzEwNjcyMTNkZGRrdzpxuTYaT9Rf8J6bOD/bcN5ZLlA36nSz+sr8W9o7Zg==',
  __VIEWSTATEGENERATOR: '1923BA21',
  __EVENTVALIDATION: '/wEdAA6IXBymCQy3kKxxxHMb0eI1JEe3Vs7uRA825ZCV4pqpi4MM/whuCcxJUOuuu2qqE6CZ4s/j0RpNuWCP69XYAAp206fhldqDZu8T2fYDgPCHqJ33kTlPq/4nMdyZH1vUjLyDuxuG3MafB9oerxAcWzdurunBdtzgTQvSeirn20oRmNfkCsmFAn4naBRM/XYApoZbkJLReHVlbZSlxun9fPcwDYpms/Q4dUVDQz2IEuRaPxQv085c8o1suJHAmfJiaNlOOg4zSkagU/cis/f4YEd7fJvbP6q097bs8FuSaHN+iRzfwLdaxdQ0aaMYL3Lm4McMUPxMixk+1FR83/mwbOZS',
  'ticket-0001;ltyRecogId-;ltyRecogSeqNo-0': 1,
  'ticket-0143;ltyRecogId-;ltyRecogSeqNo-0': 0,
  'ticket-0903;ltyRecogId-;ltyRecogSeqNo-0': 0,
  'ticket-0913;ltyRecogId-;ltyRecogSeqNo-0': 0,
  'ticket-0144;ltyRecogId-;ltyRecogSeqNo-0': 0,
  'third-party-member-ticket-card-number': '',
  'ticket-0361;ltyRecogId-;ltyRecogSeqNo-0': 0,
  'ticket-0378;ltyRecogId-;ltyRecogSeqNo-0': 0,
  'ticket-0341;ltyRecogId-;ltyRecogSeqNo-0': 0,
  'ticket-0287;ltyRecogId-;ltyRecogSeqNo-0': 0,
  'VistaUserSessionId': '38faf160518c4455a05669d1a30324de',
  ctl00$ContentBody$txtTechnicalDetails: '',
  ctl00$ContentBody$txtDoNotRehydrate: '',
  ctl00$ContentBody$txtAllocatedSeating: '',
  ctl00$ContentBody$txtForceSeatSelection: 'Y',
  ctl00$ContentBody$txtEnableManualSeatSelection: 'Y',
  ctl00$ContentBody$txtHideAllVoucherRows: '',
  ctl00$ContentBody$txtEnableConcessionSales: 'Y',
  ctl00$ContentBody$txtVoucherSubmit: '',
  ctl00$ContentBody$txtVoucherPINSubmit: '',
  ctl00$ContentBody$txtDateOrderChanged: '',
  ctl00$ContentBody$txtCancelOrder: ''
}