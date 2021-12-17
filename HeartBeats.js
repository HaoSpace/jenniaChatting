const axios = require('axios');
const Log = require('./Log');


const Strength = {
    Extreme: 5*1000,     //5  seconds
    SuperHigh: 30*1000,  //30 seconds
    High: 300*1000,      //5  minutes
    Medium: 900*1000,    //15 minutes
    Low: 3600*1000,      //1  hour
    SuperLow: 21600*1000 //6  hour
}

const checkList = {
    "https://linebot.chainsecurity.asia/dev/beats": Strength.Medium,
}

const processing = [];

var bot;


function initialize (teleBot) {
    bot = teleBot
}

function start() {
    Object.entries(checkList).forEach(([key, value]) => {
        var fetchingMsg = `Checking beat: ${key}, [Per Seconds: ${value / 1000}s]`;
        
        Log.d(fetchingMsg);
        bot.sendMessage('1684713021', fetchingMsg);

        processing[key] = true;
        fetching(key);  
    })
}

async function fetching (url) {
    var result = await getWebData(url);

    var timeOut = 0;
    if (result) {
        if (processing[url] === false) {
            bot.sendMessage('1684713021', `Beats[${url}] is awake`);
        }
        
        timeOut = checkList[url];
    } else {
        if (processing[url] === true) {
            bot.sendMessage('1684713021', `Beats[${url}] is dead`);
        }
       
        timeOut = Strength.SuperHigh;
    }

    processing[url] = result;
    setTimeout( () => { fetching(url); }, timeOut);
}

async function getWebData (url) { 
    var isSuccess;

    try {
        const response = await axios.get(url);
        const data = response.data;
        // Log.d(`data: ${data}`);
        isSuccess = data.includes('success');
    } catch (error) {
        Log.e(`error fetching[${url}]: ${error}`)
        isSuccess = false;
    } finally {
        Log.e(`Fetching[${url}] - status: ${isSuccess}`);
        return isSuccess;
    }
}

module.exports = {
    initialize,
    start
}