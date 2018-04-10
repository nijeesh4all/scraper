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
                $('.inside-article').each((i,element) => {
                    let test :string;
                    let airdrop_object = {};
                    const regEx = /&apos[\S]{1,}&apos/g; 
                    
                    let reg_url:any = $(element).parent().html().match(regEx);
                    if(reg_url){
                        reg_url = reg_url[0].replace(/&apos;/g,'');
                        reg_url = reg_url.replace(/&apos/g,'');
                    }else{
                        return null;
                    }
                    const isExclusive = $(element).parent().attr('class').indexOf('exclusive')!= -1;
                    
                    const airdrop = $(element).find('.air-wrapper').first();
                    const img_url = airdrop.find('.air-thumbnail').first().find('img').attr('src');
                    const content = $(airdrop.find('.air-content-front').first());
                    
                    const airdrop_name = content.find('a > h3').html()
                    const airdrop_description_url = content.find('a > h3').attr('href');
                    const airdrop_value  = content.find('.est-value').first().find('span').text()
                    const airdrop_requirment = {};
                    
                    content.find('ul.req-drop-list > li').each((i,req) => {
                         test = $(req).attr('title');
                         if(test){
                            test = test.replace(' required','').toLowerCase();    
                            airdrop_requirment[test] = true;
                         }
                    });

                    airdrop_object = {
                        name:airdrop_name,
                        icon_url:img_url,
                        value:airdrop_value,
                        requirements:airdrop_requirment,
                        reg_url:reg_url,
                        isExclusive:isExclusive
                    }

                    request(reg_url,(dec_error,dec_response,dec_html) => {
                        if(!dec_error && dec_response.statusCode == 200){
                            const  dec_page = $(dec_html).find('.inside-article').first();
                            
                            //info
                            const info = $(dec_page).find('.airdrop-info > ul').children('li').first();
                            const start_date = info.next().text().replace('Airdrop starts ','')
                            const platform = info.next().next().next().text()
                            //description
                            let description_text = $(dec_page).find('.drop-features > p').text();
                            description_text += "\n"+$(dec_page).find('.drop-features').next().text();

                            //Steps

                            const steps_html = $(dec_page).find('.airdrop-guide').first().html();

                            //console.log(info);
                            // console.log(start_date);
                            // console.log(description_text);
                            // console.log(reg_url);

                            const ico_info = $(dec_html).find('.airdrop-list>ul').find('li');
                            console.log(ico_info.length)
                            ico_info.each((ind,htm) => {
                               let li_element = $(htm);
                               let data:string = li_element.text();
                               let flag = -1;

                               if (data.indexOf('Ticker')!= -1) flag =1;
                               else if(data.indexOf('Website')!= -1) flag = 0;
                               else if (data.indexOf('Twitter')!= -1) flag =2;
                               else if (data.indexOf('Facebook')!= -1) flag =3;
                               else if (data.indexOf('Telegram Group')!= -1) flag =4;
                               else if (data.indexOf('Discord Chat')!= -1) flag =5;
                               else if (data.indexOf('Reddit')!= -1) flag =6;
                               else if (data.indexOf('Medium')!= -1) flag =7;

                               switch (flag) {
                                case -1:
                                break;   
                                case 1:
                                    {
                                        airdrop_object['symbol'] = data.split(":")[1].trim(); break;
                                    }
                                case 0:
                                    {
                                        airdrop_object['website'] = data.split(':').shift().toString().replace(',','').trim(); break;
                                    }
                                default:
                                    {
                                        if(data.indexOf('Ticker')!=-1) break;
                                        airdrop_object[data.toLowerCase().replace(':','').replace('  ',' ').replace(" ","_").trim()+"_url"] = li_element.find('a').attr('href');
                                    }
                                
                               }
                               console.log(airdrop_object)
                               
                            });

                        }
                    });
                    console.log("---------");
                });
            }
        });      
    }
}
