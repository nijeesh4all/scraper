import * as cheerio from 'cheerio';
import * as request from 'request'
import Airdrop from './Airdrop';

class Scrapper {
    private uri: string;
    constructor(uri : string) {
        this.uri = uri;
    }

    scrap() {
        request(this.uri , (error,resonse,html) => {
            if(!error && resonse.statusCode ==200) {
                var $ = cheerio.load(html);
                $('.air-wrapper').each((i,element) => {
                    let test :string;

                    const airdrop = $(element);
                    const img_url = airdrop.find('.air-thumbnail').first().find('img').attr('src');
                    const content = $(airdrop.find('.air-content-front').first());
                    
                    const airdrop_name = content.find('a > h3').html()
                    const airdrop_value  = content.find('.est-value').first().find('span').text()

                    const airdrop_requirment = {};
                    content.find('ul.req-drop-list > li').each((i,req) => {
                         test = $(req).attr('title');
                         if(test){
                            test = test.replace(' required','');    
                            airdrop_requirment[test] = true;
                         }
                    });

                    const airdrop_object = {
                        name:airdrop_name,
                        icon_url:img_url,
                        value:airdrop_value,
                        requirements:airdrop_requirment
                    }

                    console.log(airdrop_object);
                    console.log('------------------------------------------------------------------')
                });
            }
        });      
    }
}

const scrapper  = new Scrapper('https://airdrops.io/latest/');
scrapper.scrap();