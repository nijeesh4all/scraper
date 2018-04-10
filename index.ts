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

var tokens = [];

database.ref('toPublish').on('value',result=>{
    var object = result.val();
    for (const key in object) {
        if (object.hasOwnProperty(key)) {
            const element = object[key];
            tokens.push(element)    
        }
    }
})

new Scrapper_airdrop_io('https://airdrops.io/latest/').scrap(updateToFirebase);
new Scrapper_airdropster('https://www.airdropster.com/?sort=rating').scrap(updateToFirebase);


function updateToFirebase(object){

    if(! isInList(object)) {
        const update ={};
        const id = randomString(5,'#aA')
        object['id'] = id;
        object['addedOn'] = new Date();
        update[id] = object;
        database.ref('/toPublish').update(update)
        .then(result => {
            console.log(count++,") ",object.name+" Added");
        });
    } else {
        console.log(object.name,' is Already in List');
    }
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

function isInList(object) {
    for (let index = 0; index < tokens.length; index++) {
        const element = tokens[index];
        if(element.name == object.name){
            object.id = element.id;
            if(JSON.stringify(object) ==JSON.stringify(element))
                return true
        }
    }
    return false;
}