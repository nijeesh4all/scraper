import * as cheerio from 'cheerio';
import * as request from 'request'
import Airdrop from './Airdrop';

class Scrapper_airdropster {
    private uri: string;
    constructor(uri : string) {
        this.uri = uri;
    }

    scrap(callback :Function) {
        request(this.uri , (error,resonse,html) => {
            if(!error && resonse.statusCode ==200) {
                var $ = cheerio.load(html);
                $('tr').each((i,element) =>{
                    let airdrop_object = {};
                    let test;
                    const airdrop_div = $(element);
                    
                    const airdrop_logo = airdrop_div.find('.logo-campaign').first().find('img').attr('src');
                    let airdrop_name = airdrop_div.find('.title').text().split('(');
                    const airdrop_symbol = airdrop_name[1].replace(')','').trim();
                    airdrop_name = airdrop_name[0].trim();
                    
                    const airdrop_value = airdrop_div.find('p.text').html().replace('Estimated value :','').trim();

                    airdrop_object = {
                        name : airdrop_name,
                        symbol:airdrop_symbol,
                        value:airdrop_value,
                        icon_url:airdrop_logo
                    }
                    callback(airdrop_object)
                })
            }
        });      
    }
}

export = Scrapper_airdropster;