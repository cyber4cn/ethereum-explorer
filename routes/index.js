var express = require('express');
var https = require("https");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});
router.get('/chainInfos',function(req, res, next){

    res.render("chainInfos");
});
router.get("/getMiningEstimator", function(req, res, next){
    var url = "https://www.etherchain.org/api/miningEstimator";
    https.get(url, function (hres) {
        var json = '';
        hres.on('data', function (d) {
            json += d;
        });
        hres.on('end',function(){
            res.send(json);
        });
    }).on('error', function (e) {
        console.error(e);
    });
});


module.exports = router;