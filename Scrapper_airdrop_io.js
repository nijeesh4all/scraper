"use strict";
exports.__esModule = true;
var cheerio = require("cheerio");
var request = require("request");
var Scrapper_airdrop_io = /** @class */ (function () {
    function Scrapper_airdrop_io(uri) {
        this.uri = uri;
    }
    Scrapper_airdrop_io.prototype.scrap = function (callback) {
        request(this.uri, function (error, resonse, html) {
            if (!error && resonse.statusCode == 200) {
                var $ = cheerio.load(html);
                $('.inside-article').each(function (i, element) {
                    var test;
                    var airdrop_object = {};
                    var regEx = /&apos[\S]{1,}&apos/g;
                    var isExpired = $(element).parent().attr('class').indexOf('expired') != -1;
                    var reg_url = $(element).parent().html().match(regEx);
                    if (reg_url) {
                        reg_url = reg_url[0].replace(/&apos;/g, '');
                        reg_url = reg_url.replace(/&apos/g, '');
                    }
                    else {
                        return null;
                    }
                    var isExclusive = $(element).parent().attr('class').indexOf('exclusive') != -1;
                    var airdrop = $(element).find('.air-wrapper').first();
                    var img_url = airdrop.find('.air-thumbnail').first().find('img').attr('src');
                    var content = $(airdrop.find('.air-content-front').first());
                    var airdrop_name = content.find('a > h3').html();
                    var airdrop_description_url = content.find('a > h3').attr('href');
                    var airdrop_value = content.find('.est-value').first().find('span').text();
                    var airdrop_requirment = {};
                    content.find('ul.req-drop-list > li').each(function (i, req) {
                        test = $(req).attr('title');
                        if (test) {
                            test = test.replace(' required', '').toLowerCase();
                            airdrop_requirment[test] = true;
                        }
                    });
                    airdrop_object = {
                        source: 'http://airdrops.io',
                        name: airdrop_name,
                        icon_url: img_url,
                        value: airdrop_value,
                        requirements: airdrop_requirment,
                        reg_url: reg_url,
                        isExclusive: isExclusive,
                        expired: isExpired
                    };
                    request(reg_url, function (dec_error, dec_response, dec_html) {
                        if (!dec_error && dec_response.statusCode == 200) {
                            var dec_page = $(dec_html).find('.inside-article').first();
                            //info
                            var info = $(dec_page).find('.airdrop-info > ul').children('li').first();
                            var start_date = info.next().text().replace('Airdrop starts ', '');
                            var platform = info.next().next().next().next().text().replace('Platform:', '').trim();
                            //description
                            var description_text = $(dec_page).find('.drop-features > p').text();
                            description_text += "\n" + $(dec_page).find('.drop-features').next().text();
                            //Steps
                            var steps_html = $(dec_page).find('.airdrop-guide').first().html();
                            airdrop_object['start_date'] = start_date;
                            airdrop_object['platform'] = platform;
                            airdrop_object['decription'] = description_text;
                            airdrop_object['steps_html'] = steps_html;
                            var ico_info = $(dec_html).find('.airdrop-list>ul').find('li');
                            console.log(ico_info.length);
                            ico_info.each(function (ind, htm) {
                                var li_element = $(htm);
                                var data = li_element.text();
                                var flag = -1;
                                if (data.indexOf('Ticker') != -1)
                                    flag = 1;
                                else if (data.indexOf('Website') != -1)
                                    flag = 0;
                                else if (data.indexOf('Twitter') != -1)
                                    flag = 2;
                                else if (data.indexOf('Facebook') != -1)
                                    flag = 3;
                                else if (data.indexOf('Telegram Group') != -1)
                                    flag = 4;
                                else if (data.indexOf('Discord Chat') != -1)
                                    flag = 5;
                                else if (data.indexOf('Medium') != -1)
                                    flag = 7;
                                switch (flag) {
                                    case -1:
                                        break;
                                    case 1:
                                        {
                                            airdrop_object['symbol'] = data.split(":")[1].trim();
                                            break;
                                        }
                                    case 0:
                                        {
                                            airdrop_object['website'] = data.split(':').toString().replace(',', '').replace('Website', '').replace('https,', 'http:').trim();
                                            break;
                                        }
                                    default:
                                        {
                                            if (data.indexOf('Ticker') != -1)
                                                break;
                                            airdrop_object[(data.toLowerCase().replace(':', '').replace(" ", "_").trim() + "_url").replace('__', '_')] = li_element.find('a').attr('href');
                                        }
                                }
                                callback(airdrop_object);
                            });
                        }
                    });
                    console.log("---------");
                });
            }
        });
    };
    return Scrapper_airdrop_io;
}());
exports["default"] = Scrapper_airdrop_io;
