var express = require('express');
var https = require("https");
var router = express.Router();
var web3 = require("../lib/bcvlib");
var BigNumber = require("bignumber.js");

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Ethereum Block Explorer' });
});
function getChainInfo()
{
    var ret = {};
    ret.blockNum = web3.eth.blockNumber;
    ret.prevBlockNum = ret.blockNum - 1
    if(ret.blockNum!==undefined){

        // TODO: put the 2 web3.eth.getBlock into the async function below
        //       easiest to first do with fastInfosCtrl
        var blockNewest = web3.eth.getBlock(ret.blockNum - 1);

        if(blockNewest!==undefined){

            // difficulty
            ret.difficulty = blockNewest.difficulty;
            ret.difficultyToExponential = blockNewest.difficulty.toExponential(3);

            ret.totalDifficulty = blockNewest.totalDifficulty;
            ret.totalDifficultyToExponential = blockNewest.totalDifficulty.toExponential(3);

            ret.totalDifficultyDividedByDifficulty = ret.totalDifficulty.dividedBy(ret.difficulty);
            ret.totalDifficultyDividedByDifficulty_formatted = ret.totalDifficultyDividedByDifficulty.toFormat(1);

            ret.AltsheetsCoefficient = ret.totalDifficultyDividedByDifficulty.dividedBy(ret.blockNum);
            ret.AltsheetsCoefficient_formatted = ret.AltsheetsCoefficient.toFormat(4);

            // large numbers still printed nicely:
            ret.difficulty_formatted = ret.difficulty.toFormat(0);
            ret.totalDifficulty_formatted = ret.totalDifficulty.toFormat(0);

            // Gas Limit
            ret.gasLimit = new BigNumber(blockNewest.gasLimit).toFormat(0) + " m/s";

            // Time
            var newDate = new Date();
            newDate.setTime(blockNewest.timestamp*1000);
            ret.time = newDate.toUTCString();

            ret.secondsSinceBlock1 = blockNewest.timestamp - 1438226773;
            ret.daysSinceBlock1 = (ret.secondsSinceBlock1 / 86400).toFixed(2);

            // Average Block Times:
            // TODO: make fully async, put below into 'fastInfosCtrl'

            var blockBefore = web3.eth.getBlock(ret.blockNum);
            if(blockBefore!==undefined){
                ret.blocktime = blockNewest.timestamp - blockBefore.timestamp;
            }
            ret.range1=100;
            range = ret.range1;
            var blockPast = web3.eth.getBlock(Math.max(ret.blockNum - range,0));
            if(blockBefore!==undefined){
                ret.blocktimeAverage1 = ((blockNewest.timestamp - blockPast.timestamp)/range).toFixed(2);
            }
            ret.range2=1000;
            range = ret.range2;
            var blockPast = web3.eth.getBlock(Math.max(ret.blockNum - range,0));
            if(blockBefore!==undefined){
                ret.blocktimeAverage2 = ((blockNewest.timestamp - blockPast.timestamp)/range).toFixed(2);
            }
            ret.range3=10000;
            range = ret.range3;
            var blockPast = web3.eth.getBlock(Math.max(ret.blockNum - range,0));
            if(blockBefore!==undefined){
                ret.blocktimeAverage3 = ((blockNewest.timestamp - blockPast.timestamp)/range).toFixed(2);
            }
            ret.range4=100000;
            range = ret.range4;
            var blockPast = web3.eth.getBlock(Math.max(ret.blockNum - range,0));
            if(blockBefore!==undefined){
                ret.blocktimeAverage4 = ((blockNewest.timestamp - blockPast.timestamp)/range).toFixed(2);
            }

            range = ret.blockNum;
            var blockPast = web3.eth.getBlock(1);
            if(blockBefore!==undefined){
                ret.blocktimeAverageAll = ((blockNewest.timestamp - blockPast.timestamp)/range).toFixed(2);
            }


        }
    }

    // Block Explorer Info

    ret.isConnected = web3.isConnected();
    //ret.peerCount = web3.net.peerCount;
    ret.versionApi = web3.version.api;
    ret.versionClient = web3.version.client;
    // ret.versionNetwork = web3.version.network;
    ret.versionCurrency = web3.version.ethereum; // TODO: change that to currencyname?

    // ready for the future:
    try { ret.versionWhisper = web3.version.whisper; }
    catch(err) {ret.versionWhisper = err.message; }
    return ret;
}
router.get('/chainInfos',function(req, res, next){

    var ret = getChainInfo();
    res.render("chainInfos",ret);
});

router.get('/updateBlockList',function(req,res,next){
    var currentBlockNumber = web3.eth.blockNumber;//web3.eth.syncing.currentBlock;
    var ret = {};
    ret.blockNumber = currentBlockNumber - 1;
    ret.blocks = [];
    for (var i=0; i < 10 && currentBlockNumber - i >= 0; i++) {
        ret.blocks.push(web3.eth.getBlock(currentBlockNumber - i));
    }
    res.send(JSON.stringify(ret));
});

router.get('/updateTXList',function(req,res,next){
    var ret = {};
    var currentTXBlockNumber = web3.eth.blockNumber;//web3.eth.syncing.currentBlock;
    ret.txNumber = currentTXBlockNumber - 1;
    ret.recenttransactions = [];
    for (var i = 0; i < 10 && currentTXBlockNumber - i >= 0; i++) {
        ret.recenttransactions.push(web3.eth.getTransactionFromBlock(currentTXBlockNumber - i));
    }
 //   console.log(ret.recenttransactions);
    res.send(JSON.stringify(ret));
});
router.get('/updateStats',function(req,res,next){
    var ret = {};
    ret.blockNumber = web3.eth.blockNumber; // now that was easy
    //ret.blockNum = web3.eth.syncing.currentBlock;

    if(ret.blockNumber!==undefined){

        // TODO: put the 2 web3.eth.getBlock into the async function below
        //       easiest to first do with fastInfosCtrl
        var blockNewest = web3.eth.getBlock(ret.blockNumber);

        if(blockNewest!==undefined){

            // difficulty
            ret.difficulty = blockNewest.difficulty;
            ret.difficultyToExponential = blockNewest.difficulty.toExponential(3);

            ret.totalDifficulty = blockNewest.totalDifficulty;
            ret.totalDifficultyToExponential = blockNewest.totalDifficulty.toExponential(3);

            ret.totalDifficultyDividedByDifficulty = ret.totalDifficulty.dividedBy(ret.difficulty);
            ret.totalDifficultyDividedByDifficulty_formatted = ret.totalDifficultyDividedByDifficulty.toFormat(1);

            ret.AltsheetsCoefficient = ret.totalDifficultyDividedByDifficulty.dividedBy(ret.blockNumber);
            ret.AltsheetsCoefficient_formatted = ret.AltsheetsCoefficient.toFormat(4);

            // large numbers still printed nicely:
            ret.difficulty_formatted = ret.difficulty.toFormat(0);
            ret.totalDifficulty_formatted = ret.totalDifficulty.toFormat(0);

            // Gas Limit
            ret.gasLimit = new BigNumber(blockNewest.gasLimit).toFormat(0) + " m/s";

            // Time
            var newDate = new Date();
            newDate.setTime(blockNewest.timestamp*1000);
            ret.time = newDate.toUTCString();

            ret.secondsSinceBlock1 = blockNewest.timestamp - 1438226773;
            ret.daysSinceBlock1 = (ret.secondsSinceBlock1 / 86400).toFixed(2);

            // Average Block Times:
            // TODO: make fully async, put below into 'fastInfosCtrl'

            var blockBefore = web3.eth.getBlock(ret.blockNumber - 1);
            if(blockBefore!==undefined){
                ret.blocktime = blockNewest.timestamp - blockBefore.timestamp;
            }
            ret.range1=100;
            range = ret.range1;
            var blockPast = web3.eth.getBlock(Math.max(ret.blockNumber - range,0));
            if(blockBefore!==undefined){
                ret.blocktimeAverage1 = ((blockNewest.timestamp - blockPast.timestamp)/range).toFixed(2);
            }
            ret.range2=1000;
            range = ret.range2;
            var blockPast = web3.eth.getBlock(Math.max(ret.blockNumber - range,0));
            if(blockBefore!==undefined){
                ret.blocktimeAverage2 = ((blockNewest.timestamp - blockPast.timestamp)/range).toFixed(2);
            }
            ret.range3=10000;
            range = ret.range3;
            var blockPast = web3.eth.getBlock(Math.max(ret.blockNumber - range,0));
            if(blockBefore!==undefined){
                ret.blocktimeAverage3 = ((blockNewest.timestamp - blockPast.timestamp)/range).toFixed(2);
            }
            ret.range4=100000;
            range = ret.range4;
            var blockPast = web3.eth.getBlock(Math.max(ret.blockNumber - range,0));
            if(blockBefore!==undefined){
                ret.blocktimeAverage4 = ((blockNewest.timestamp - blockPast.timestamp)/range).toFixed(2);
            }

            range = ret.blockNumber;
            var blockPast = web3.eth.getBlock(1);
            if(blockBefore!==undefined){
                ret.blocktimeAverageAll = ((blockNewest.timestamp - blockPast.timestamp)/range).toFixed(2);
            }

            //fastAnswers($scope);
            //$scope=BlockExplorerConstants($scope);

        }
    }
    // Block Explorer Info
    ret.isConnected = web3.isConnected();
    //ret.peerCount = web3.net.peerCount;
    ret.versionApi = web3.version.api;
    ret.versionClient = web3.version.client;
    // ret.versionNetwork = web3.version.network;
    ret.versionCurrency = web3.version.ethereum; // TODO: change that to currencyname?

    // ready for the future:
    try { ret.versionWhisper = web3.version.whisper; }
    catch(err) {ret.versionWhisper = err.message; }

    res.send(JSON.stringify(ret));
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