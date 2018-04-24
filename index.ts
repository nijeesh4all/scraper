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


let count =0;
let object:any = {};
database.ref('toPublish').on('value',result=>{
    object = result.val();
})

new Scrapper_airdrop_io('https://airdrops.io/hot/').scrap(updateToFirebase);

//Run every 12 hrs
setInterval(() => {
    //new Scrapper_airdropster('https://www.airdropster.com/?sort=rating').scrap(updateToFirebase);
    new Scrapper_airdrop_io('https://airdrops.io/hot/').scrap(updateToFirebase);
    new Scrapper_airdrop_io('https://airdrops.io/latest/').scrap(updateToFirebase);
}, 1000*60*60*12);


function updateToFirebase(object){
        
        isInList(object);
        const update ={};
        const id = randomString(5,'#aA')
        if(!object.id)
            object['id'] = id;
        if(!object.addedOn)
            object['addedOn'] = new Date();
        
        object['lastUpdated'] = new Date();
        
        update[object.id] = object;
        database.ref('/toPublish').update(update)
        .then(result => {
            console.log(count++,") ",object.name+" Added");
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

function isInList(airdrop) {
    let flag = false;
    for (const key in object) {
        if (object.hasOwnProperty(key)) {
            const element = object[key];
            if(element.name == airdrop.name) {
                flag = true;
                object[element.id] = airdrop
                airdrop['id'] = element.id; 
            }
        }
    }
}