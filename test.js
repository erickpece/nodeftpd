var ftpd = require('./ftpd.js');
var fs = require('fs');
var path = require('path');

var server = new ftpd.FtpServer("127.0.0.1", {
//    getInitialCwd: function () { return "/"; }
    getRoot: function () { return process.cwd(); },
    pasvPortRangeStart: 1025,
    pasvPortRangeEnd: 1050
});

// this event passes in the client socket which emits further events
// but should recommend they don't do socket operations on it
// so should probably encapsulate and hide it
server.on("client:connected", function(conn) {
    var username = null;
    console.log("client connected: " + conn.remoteAddress);
    conn.on("command:user", function(user, success, failure) {
        if (user) {
            username = user;
            success();
        } else failure();
    });

    conn.on("command:pass", function(pass, success, failure) {
        if (pass) success(username);
        else failure();
    });
});
server.debugging = 4;
server.listen(7001);
