const { ethers } = require("ethers");
const ObjectsToCsv = require('objects-to-csv')
const { convertArrayToCSV } = require('convert-array-to-csv');
const converter = require('convert-array-to-csv');
const Web3 = require('web3');
const nodemailer = require('nodemailer');

const poolAbi = [
      "event Deposit(address indexed from, uint amount)",
      "event Withdraw(address indexed to, uint amount)",
      "event EmergencyWithdraw(address indexed user, uint256 indexed pid, uint256 amount)"
    ];


const ETH_DUCK_POOL_ADDRESS = "0xBa64A4c4Da90742cA8d3a5F831d0850Fe5685378";
const DDIM_DUCK_POOL_ADDRESS = "0x53466a575fE1beba1F49F557d9817a6996f25694";
const DDIM_ETH_POOL_ADDRESS = "0x4e4b0FD4c838CB642dabc64EAc90bA33F715D103";

const LAST_BLOCK = 21555500;
// const LAST_BLOCK = 11509403;

let provider = new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/cf016515a2f04bb6b8cc8b5feac1caf1');
const web3 = new Web3('https://mainnet.infura.io/v3/cf016515a2f04bb6b8cc8b5feac1caf1');
let arr = []

async function checkETH_DUCK(arr) {

    const contract = new ethers.Contract(ETH_DUCK_POOL_ADDRESS, poolAbi, provider);

    // List all token transfers *from* myAddress
    // console.log(contract.filters)
    filter = contract.filters.EmergencyWithdraw(null)

    provider.resetEventsBlock(0)

    // let done = false
    provider.on(filter, async(log, event) => {
        // if(log.blockNumber >= LAST_BLOCK) {
        //     if(!done) {
        //         done = true
        //         const csv = new ObjectsToCsv(arr)
        //         await csv.toDisk('./list.csv')
        //         console.log(done)
        //         return;
        //     }
        // }
        console.log(log.transactionHash)
        sendMail(log.transactionHash)
    })
}

async function checkDDIM_DUCK(arr) {

    const contract = new ethers.Contract(DDIM_DUCK_POOL_ADDRESS, poolAbi, provider);

    // List all token transfers *from* myAddress
    // console.log(contract.filters)
    filter = contract.filters.EmergencyWithdraw(null)

    provider.resetEventsBlock(0)

    // let done = false
    provider.on(filter, async(log, event) => {
        // if(log.blockNumber >= LAST_BLOCK) {
        //     if(!done) {
        //         done = true
        //         const csv = new ObjectsToCsv(arr)
        //         await csv.toDisk('./list.csv')
        //         console.log(done)
        //         return;
        //     }
        // }
        console.log(log.transactionHash)
        sendMail(log.transactionHash)
    })
}

async function checkDDIM_ETH(arr) {

    const contract = new ethers.Contract(DDIM_ETH_POOL_ADDRESS, poolAbi, provider);

    // List all token transfers *from* myAddress
    // console.log(contract.filters)
    filter = contract.filters.EmergencyWithdraw(null)

    provider.resetEventsBlock(0)

    // let done = false
    provider.on(filter, async(log, event) => {
        // if(log.blockNumber >= LAST_BLOCK) {
        //     if(!done) {
        //         done = true
        //         const csv = new ObjectsToCsv(arr)
        //         await csv.toDisk('./list.csv')
        //         console.log(done)
        //         return;
        //     }
        // }
        console.log(log.transactionHash)
        sendMail(log.transactionHash)
    })
}



var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'havok1231@gmail.com',
    pass: '1MoRGaN11'
  }
});



function sendMail(txHash) {
    
    if(txHash == '0x94be559b5ae061594ee5f55abb37b783907c0bf518c12d0acb3e944489cafa66' ||
        txHash == '0xde641d89a29fe9b1fef0f1a30ce8d33b679bcdcd4dad541f612c6159e0bcbc55' ||
        txHash == '0x3b1f8cf5d69707496490a8afe95fa8f99ea173a48b50550117c44f545a1f7602') {
        console.log("found sent hash");
        return;
    }
    // 0x94be559b5ae061594ee5f55abb37b783907c0bf518c12d0acb3e944489cafa66
    // 0xde641d89a29fe9b1fef0f1a30ce8d33b679bcdcd4dad541f612c6159e0bcbc55
    // 0x3b1f8cf5d69707496490a8afe95fa8f99ea173a48b50550117c44f545a1f7602

    var mailOptions = {
      from: 'havok1231@gmail.com',
      to: 'contact@duckdao.io, chr.josephs@gmail.com, neverkiller2@gmail.com, k.kronenberg@me.com',
      subject: 'Someone did use bug',
      text: txHash
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
}



// sendMail()

checkDDIM_DUCK(arr)
checkDDIM_ETH(arr)
checkETH_DUCK(arr)