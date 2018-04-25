"use strict";
exports.__esModule = true;
var cheerio = require("cheerio");
var request = require("request");
var Scrapper_airdropster = /** @class */ (function () {
    function Scrapper_airdropster(uri) {
        this.uri = uri;
    }
    Scrapper_airdropster.prototype.scrap = function (callback) {
        request(this.uri, function (error, resonse, html) {
            if (!error && resonse.statusCode == 200) {
                var $ = cheerio.load(html);
                $('tr').each(function (i, element) {
                    var airdrop_object = {};
                    var test;
                    var airdrop_div = $(element);
                    var airdrop_logo = airdrop_div.find('.logo-campaign').first().find('img').attr('src');
                    var airdrop_name = airdrop_div.find('.title').text().split('(');
                    var reg_url = airdrop_div.find('.title').attr('href');
                    var airdrop_symbol = airdrop_name[1].replace(')', '').trim();
                    airdrop_name = airdrop_name[0].trim();
                    var airdrop_value = airdrop_div.find('p.text').html().replace('Estimated value :', '').trim();
                    airdrop_object = {
                        name: airdrop_name,
                        symbol: airdrop_symbol,
                        value: airdrop_value,
                        icon_url: airdrop_logo,
                        reg_url: reg_url
                    };
                    callback(airdrop_object);
                });
            }
        });
    };
    return Scrapper_airdropster;
}());
exports["default"] = Scrapper_airdropster;
