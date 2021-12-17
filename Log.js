class Log {
   

    //debug
    static d (value) {
        var currentTime = new Date(Date.now()).toLocaleString();
        console.log(currentTime + " D/ " + value);
    }

    static w (value) {
        var currentTime = new Date(Date.now()).toLocaleString();
        console.warn(currentTime + " W/ " + value);
    }

    static e (value) {
        var currentTime = new Date(Date.now()).toLocaleString();
        console.error(currentTime + " E/ " + value);
    }
}

module.exports = Log;