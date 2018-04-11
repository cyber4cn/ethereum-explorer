var Web3 = require("./web3");
var GETH_HOSTNAME	= "40.125.212.165";	// put your IP address!
var GETH_RPCPORT  	= 8545;

if(!web3 || !web3.isConnected())
{
    var web3 = new Web3();
    web3.setProvider(new web3.providers.HttpProvider("http://"+GETH_HOSTNAME+":"+GETH_RPCPORT));
}

//console.log(web3.eth.blockNumber);

//var blockNewest = web3.eth.getBlock(web3.eth.blockNumber-1);
//console.log(blockNewest);

module.exports=web3;


