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
                    let test;
                    const airdrop = $(element);
                    test = airdrop.html()
                    console.log(test);
                })
            }
        });      
    }
}

console.log('Latest');
new Scrapper_airdropster('https://airdrops.io/latest/').scrap();
// new Scrapper_airdrop_io('https://airdrops.io/hot/').scrap();
// new Scrapper_airdrop_io('https://airdrops.io/upcoming/').scrap();

