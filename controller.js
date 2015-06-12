var ping = require('ping'),
    exec = require('child_process').exec,
    util = require('util'),
    config = require('./config'),
    colors = require('colors');

module.exports = {
    run: function() {
        var networks = config.hosts,
            current = '',
            interval, match;

        exec('/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport -I', function(error, stdout, stderr) {
            // console.log('stdout: ' + stdout);
            // console.log('stderr: ' + stderr);

            if (error !== null) {
                console.log('exec error: ' + error);
            } else if (stdout) {
                // console.log(match)
                for (var x in networks) {
                    match = stdout.match(new RegExp(x, 'g'));
                    if (match) {
                        current = x;
                        networks[x] = true;
                        break;
                    }
                }
                console.log('Started, current network is ', current);
                // console.log(networks)
            }
        });

        (function process(exec) {
            interval = setInterval(function() {
                ping.sys.probe('google.com', function(isAlive) {
                    // var msg = isAlive ? 'host is alive' : 'host is dead, switch to another network';
                    if (!isAlive) {
                        // console.log(msg.red);
                        clearInterval(interval);
                        for (var x in networks) {
                            if (networks[x] == false) {
                                console.log('network is down, switched to '.red, x.green)
                                exec(util.format('networksetup -setairportnetwork en0 %s %s', x, config.pass), function(err, stdout, stderr) {
                                    setTimeout(function() {
                                        process(exec);
                                    }, 10000);
                                });
                            }
                        }
                    }
                });
            }, 1000);
        })(exec);
    }
}
