var exec = require('child_process').exec,
    util = require('util'),
    config = require('./config'),
    colors = require('colors'),
    lib = require('./lib'),
    os = require('os');

module.exports = {
    run: function() {
        var networks = config.hosts,
            current = '',
            interval, match, command1, command2,
            platform = os.platform();

        switch (platform) {
            case 'win32':
                command2 = "netsh wlan connect %s"
            case 'darwin':
            default:
                command2 = 'networksetup -setairportnetwork en0 %s %s'
                command1 = "/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport -I | awk '/ SSID/ {print substr($0, index($0, $2))}'"
                break;

        }

        exec(command1, function(error, stdout, stderr) {
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
                console.log('Started, current network is '.green, current.red);
            }
        });

        (function process(exec) {
            setTimeout(function() {
                lib.ping('google.com', function(isAlive) {
                    if (!isAlive) {
                        for (var x in networks) {
                            if (networks[x] == false) {
                                networks[x] = true;
                                console.log('network is down, switched to '.red, x.green)
                                exec(util.format(command2, x, config.pass), function(err, stdout, stderr) {
                                    console.log('switched done'.green, stdout.yellow);
                                    process(exec);
                                });
                            } else {
                                networks[x] = false;
                            }
                        }
                    } else {
                        process(exec);
                    }
                });
            }, 6000);
        })(exec);
    }

}
