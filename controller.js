var ping = require('ping'),
    exec = require('child_process').exec,
    util = require('util'),
    config = require('./config');

module.exports = {
    run: function() {
        var networks = config.hosts,
            current = '',
            interval, match;

        exec('/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport -I', function(error, stdout, stderr) {
            console.log('stdout: ' + stdout);
            // console.log('stderr: ' + stderr);

            if (error !== null) {
                console.log('exec error: ' + error);
            } else if (stdout) {

                
                // console.log(match)

                for (var x in networks) {
                	match = stdout.match(new RegExp(x, 'g'));
                    if(match){
                    	networks[x] = true;
                    	break;
                    }
                }



                console.log(networks)
            }
        });

        (function process(exec) {

            interval = setInterval(function() {
                ping.sys.probe('google.com', function(isAlive) {
                    var msg = isAlive ? 'host is alive' : 'host is dead, switch to another network';

                    if (!isAlive) {
                        console.log(msg);
                        clearInterval(interval);
                        for (var x in networks) {
                            if (networks[x] == false) {
                                exec(util.format('networksetup -setairportnetwork en0 %s %s', x, 'vasthill136'), function(err, stdout, stderr) {
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
