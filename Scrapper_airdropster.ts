import * as cheerio from 'cheerio';
import * as request from 'request'
import Airdrop from './Airdrop';

class Scrapper_airdropster {
    private uri: string;
    constructor(uri : string) {
        this.uri = uri;
    }

    scrap() {
        request(this.uri , (error,resonse,html) => {
            if(!error && resonse.statusCode ==200) {
                var $ = cheerio.load(html);
                $('tr').each((i,element) =>{
                    let airdrop_object = {};
                    let test;
                    const airdrop_div = $(element);
                    
                    const airdrop_logo = airdrop_div.find('.logo-campaign').first().find('img').attr('src');
                    const airdrop_name = airdrop_div.find('.title').html() //.first().text();

                    console.log(airdrop_logo,'=>',airdrop_name);
                })
            }
        });      
    }
}

console.log('Latest');
new Scrapper_airdropster('https://www.airdropster.com/?sort=rating').scrap();
// new Scrapper_airdrop_io('https://airdrops.io/hot/').scrap();
// new Scrapper_airdrop_io('https://airdrops.io/upcoming/').scrap();

