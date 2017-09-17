var express = require('express');
var router = express.Router();

//socket io stuff
// let server = require('http').createServer(router);
// let io = require('socket.io').listen(server);

// io.on('connection', function (socket) {
//     socket.emit('news', { hello: 'world' });
//     socket.on('my other event', function (data) {
//         console.log(data);
//     });

// });


//ibm credentials
var watson = require('../keys/watson');
var LanguageTranslatorV2 = require('watson-developer-cloud/language-translator/v2');

//console.log(watson);

//credentials
var language_translator = new LanguageTranslatorV2({
    username: watson.translator.username,
    password: watson.translator.password,
    url: 'https://gateway.watsonplatform.net/language-translator/api/'
});

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('watson', { title: 'Spotify Login Page' });
});

language_translator.translate({
    text: 'Te quieres casar conmigo?', source: 'es', target: 'en'
},
    function (err, translation) {
        if (err)
            console.log('error:', err);
        else
            console.log(JSON.stringify(translation, null, 2));
    });

// language_translator.identify({
//     text: 'The language translator service takes text input and identifies the language used.'
// },
//     function (err, language) {
//         if (err)
//             console.log('error:', err);
//         else
//             console.log(JSON.stringify(language, null, 2));
//     });

module.exports = router;