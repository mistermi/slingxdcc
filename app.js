var irc = require("irc"),
    dirty = require("dirty"),
    logger = require("./lib/xdcclogger");

var serverdb = dirty.Dirty("config/server.db");
var nick = "xdccer";

var stdin = process.openStdin();







serverdb.on("load", function() {
    serverdb.forEach(function(key, val) {
        var ircClient = new irc.Client(val.host, nick, {
            userName: nick,
            realName: nick,
            port: val.port,
            debug: false,
            stripColors: true
        });
        ircClient.on("error", ircError);
        ircClient.once("registered", function(){
            logger.addServer(key, ircClient);
            logger.joinChannels(key, val.channels);
            logger.observChannels(key, val.observchannels);
        });
    });
})

stdin.addListener("data", function(d) {
    if(d.toString().substring(0, 1) == "S") {
        logger.searchPacketsPaged("1080p",10, d.toString().substring(1, 2),"lastseen","desc", true,function(pages, result){
            console.log(pages);
            console.log(result);
        });
    }
    if(d.toString().substring(0, 1) == "N") {
        console.log(logger.numberOfPacks());
    }
});

function ircError(message){
    console.log(message);
};