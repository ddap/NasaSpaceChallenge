var express = require('express')
var multer = require('multer');
var http = require("http");
var bodyParser = require('body-parser')

//MULTER CONFIG: to get file photos to temp server storage
const multerConfig = {

storage: multer.diskStorage({
 //Setup where the user's file will go
 destination: function(req, file, next){
   next(null, 'public/ph');
   },

  //Then give the file a unique name
  filename: function(req, file, next){
        console.log(file);
        const ext = file.mimetype.split('/')[1];
        next(null, file.fieldname + '-' + Date.now() + '.'+ext);
  }
    }),

    //A means of ensuring only images are uploaded.
    fileFilter: function(req, file, next){
          if(!file){
            next();
          }
        const image = file.mimetype.startsWith('image/');
        if(image){
          console.log('photo uploaded');
          next(null, true);
        }else{
          console.log("file not supported");

          //TODO:  A better message response to user on failure.
          return next();
        }
    }
  }

var Signals = [];

var router = express.Router()
//router.use(cookieParser())
router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

router.post('/signal', function (req, res, next) {
    var Signal = {}
    console.log(req.body)
    console.log("siamo qui")

    Signal.time = req.body.time;
    Signal.latitude = req.body.latitude;
    Signal.longitude = req.body.longitude;
    Signal.description = req.body.description;
    Signal.stato = 0;
    Signal.danger = req.body.danger;
    Signals.push(Signal)
    res.json({'ok': Signals})
})
router.get('/signal', function (req, res, next) {
    res.json(Signals)
})
router.post('/upload',multer(multerConfig).single('photo'),function(req,res){
  var optionsget = {
                  headers: {
                      'Authorization': 'Key 1a5c1c25b0c840458c03dabfd9ed5fe4 ',
                      'Content-Type': 'application/json'
                  },
                  host: 'api.clarifai.com',
                  path: 'v2/models/aaa03c23b3724a16a56b629203edc62c/versions/aa7f35c01e0642fda5cf400f543e7c40/outputs',
                  method: 'POST'
              };
      var data = {
        "inputs": [
          {
            "data": {
              "image": {
                "url": 'http://nasaspaceapp2018.herokuapp.com/ph/' + req.file.filename
              }
            }
          }
        ]
      }
  const rich = http.request(optionsget, (risp) => {
    console.log(`statusCode: ${risp.statusCode}`)

    risp.on('data', (d) => {
      console.log(d)
    })
  });
  console.log(JSON.stringify(data))
  rich.write(JSON.stringify(data));
  rich.end();
 res.send('Complete!');
});
module.exports = router