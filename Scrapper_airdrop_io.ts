import * as cheerio from 'cheerio';
import * as request from 'request'

export default class Scrapper_airdrop_io {
    private uri: string;
    constructor(uri : string) {
        this.uri = uri;
    }

    scrap(callback :Function) {
        request(this.uri , (error,resonse,html) => {
            if(!error && resonse.statusCode ==200) {
                var $ = cheerio.load(html);
                $('.air-wrapper').each((i,element) => {
                    let test :string;
                    let airdrop_object = {};    
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

                    airdrop_object = {
                        name:airdrop_name,
                        icon_url:img_url,
                        value:airdrop_value,
                        requirements:airdrop_requirment
                    }
                    
                    callback(airdrop_object)
                });
            }
        });      
    }
}