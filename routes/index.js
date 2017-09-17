var express = require('express');
var SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');
var fs = require('fs');
var watson = require('../keys/watson');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  var speech_to_text = new SpeechToTextV1({
    username: watson.speech.username,
    password: watson.speech.password
  });
  console.log("========check 1=======");
  var song = fs.createReadStream('./resources/krippy.mp3');
  
  var params = {
    // From file
    audio: song,
    content_type: 'audio/mp3; rate=44100'
  };
  
  console.log(song);
  console.log("========check 2=======");
  
  console.log(speech_to_text);
  // or streaming
fs.createReadStream('./resources/krippy.mp3')
.pipe(speech_to_text.createRecognizeStream({ content_type: 'audio/mp3; rate=44100' }))
.pipe(fs.createWriteStream('./transcription.txt'));

  res.render('index', { title: 'Express' });
  
});

module.exports = router;
