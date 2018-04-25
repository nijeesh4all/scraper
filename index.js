"use strict";
exports.__esModule = true;
var Scrapper_airdrop_io_1 = require("./Scrapper_airdrop_io");
var Firebase = require("firebase");
var config = {
    apiKey: 'AIzaSyB5xKtuEpyNuQ6Z0moK22zPgR7a8Kc9Qy0',
    authDomain: 'airfolio2-bead4.firebaseapp.com',
    databaseURL: 'https://airfolio2-bead4.firebaseio.com',
    projectId: 'airfolio2-bead4',
    storageBucket: 'airfolio2-bead4.appspot.com',
    messagingSenderId: '4773109964'
};
Firebase.initializeApp(config);
var database = Firebase.database();
var total_count = 0;
var sessionCount = 0;
var element = {};
var object = {};
database.ref('toPublish').on('value', function (result) {
    object = result.val();
});
new Scrapper_airdrop_io_1["default"]('https://airdrops.io/hot/').scrap(updateToFirebase);
//Run every 12 hrs
setInterval(function () {
    sessionCount = 0;
    //new Scrapper_airdropster('https://www.airdropster.com/?sort=rating').scrap(updateToFirebase);
    new Scrapper_airdrop_io_1["default"]('https://airdrops.io/hot/').scrap(updateToFirebase);
    new Scrapper_airdrop_io_1["default"]('https://airdrops.io/latest/').scrap(updateToFirebase);
}, 1000 * 60 * 60 * 12);
function updateToFirebase(airdrop_object) {
    var update = {};
    var id = getAirdropId(airdrop_object);
    console.log(id);
    if (id == null) {
        id = randomString(6, '#aA');
        airdrop_object['id'] = id;
        airdrop_object['addedOn'] = new Date();
        if (object == null) {
            object = {};
        }
        object[id] = airdrop_object;
    }
    else {
        syncWithOldData(id, airdrop_object);
    }
    // airdrop_object['lastUpdated'] = new Date();
    // update[airdrop_object.id] = airdrop_object;
    // database.ref('/toPublish').update(update)
    // .then(result => {
    //     console.log(total_count++,"---"+(sessionCount++)+") ",airdrop_object.name+" Added");
    // });
}
function updateExpiredAirdrop(id) {
    var update = { expired: true };
    database.ref('/toPublish/' + id).update(update);
}
function randomString(length, chars) {
    var mask = '';
    if (chars.indexOf('a') > -1) {
        mask += 'abcdefghijklmnopqrstuvwxyz';
    }
    if (chars.indexOf('A') > -1) {
        mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    }
    if (chars.indexOf('#') > -1) {
        mask += '0123456789';
    }
    if (chars.indexOf('!') > -1) {
        mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';
    }
    var result = '';
    for (var i = length; i > 0; --i) {
        result += mask[Math.floor(Math.random() * mask.length)];
    }
    return result;
}
function getAirdropId(airdrop_object) {
    var airdropId = null;
    for (var key in object) {
        if (object.hasOwnProperty(key)) {
            var element_1 = object[key];
            if (element_1.name == airdrop_object.name)
                airdropId = element_1.id;
        }
    }
    return airdropId;
}
function syncWithOldData(id, airdrop_object) {
    if (object.hasOwnProperty(id)) {
        var airdrop = object[id];
        for (var key in airdrop_object) {
            if (airdrop_object.hasOwnProperty(key)) {
                var element_2 = airdrop_object[key];
                airdrop[key] = airdrop_object[key];
            }
        }
        airdrop_object = airdrop;
    }
    else {
        throw new Error('Invalid ID or ID not found in The object');
    }
}
