import Scrapper_airdrop_io from './Scrapper_airdrop_io';
import Scrapper_airdropster from './Scrapper_airdropster';
import * as Firebase from 'firebase';


const config = {
    apiKey: 'AIzaSyB5xKtuEpyNuQ6Z0moK22zPgR7a8Kc9Qy0',
    authDomain: 'airfolio2-bead4.firebaseapp.com',
    databaseURL: 'https://airfolio2-bead4.firebaseio.com',
    projectId: 'airfolio2-bead4',
    storageBucket: 'airfolio2-bead4.appspot.com',
    messagingSenderId: '4773109964'
  };

  Firebase.initializeApp(config);
  const database = Firebase.database();


let total_count =0;
let sessionCount = 0;
let element:any = {};
var object:object = {}

database.ref('toPublish').on('value',result=>{
    object = result.val();
})

new Scrapper_airdrop_io('https://airdrops.io/hot/').scrap(updateToFirebase);

//Run every 12 hrs
setInterval(() => {
    sessionCount = 0;
    //new Scrapper_airdropster('https://www.airdropster.com/?sort=rating').scrap(updateToFirebase);
    new Scrapper_airdrop_io('https://airdrops.io/hot/').scrap(updateToFirebase);
    new Scrapper_airdrop_io('https://airdrops.io/latest/').scrap(updateToFirebase);
}, 1000*60*60*12);


function updateToFirebase(airdrop_object){
        
        const update ={};
        let id:string = getAirdropId(airdrop_object); 
        
        if(id == null){
            id = randomString(5,'#aA')
            airdrop_object['id'] = id;
            airdrop_object['addedOn'] = new Date();
            
            if(object == null){
                object = {};
            }
            
            object[id] = airdrop_object;
        }   else {
            syncWithOldData(id,airdrop_object);
        }
        
        airdrop_object['lastUpdated'] = new Date();
        update[airdrop_object.id] = airdrop_object;
        database.ref('/toPublish').update(update)
        .then(result => {
            console.log(total_count++,"---"+(sessionCount++)+") ",airdrop_object.name+" Added");
        });
}

function updateExpiredAirdrop(id) {
    const update = {expired:true};
    database.ref('/toPublish/'+id).update(update);
}
  
function randomString(length, chars) {
    let mask = '';
    if (chars.indexOf('a') > -1) { mask += 'abcdefghijklmnopqrstuvwxyz'; }
    if (chars.indexOf('A') > -1) { mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; }
    if (chars.indexOf('#') > -1) { mask += '0123456789'; }
    if (chars.indexOf('!') > -1) { mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\'; }
    let result = '';
    for (let i = length; i > 0; --i) { result += mask[Math.floor(Math.random() * mask.length)]; }
    return result;
}

function getAirdropId(airdrop_object){
    let airdropId = null;
    for (const key in object) {
        if (object.hasOwnProperty(key)) {
            const element = object[key];
            if(element.name == airdrop_object.name)
                airdropId = element.id;    
        }
    }
    return airdropId;
}

function syncWithOldData(id,airdrop_object) {
    if(object.hasOwnProperty(id)){
        const airdrop = object[id];
        
        for (const key in airdrop_object) {
            if (airdrop_object.hasOwnProperty(key)) {
                const element = airdrop_object[key];
                airdrop[key] = airdrop_object[key];
            }
        }

        airdrop_object = airdrop;

    } else {
        throw new Error('Invalid ID or ID not found in The object');
    }
}