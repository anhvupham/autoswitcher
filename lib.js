//system library
var sys = require('util'),
    exec = require('child_process').exec,
    os = require('os');

exports.ping = function(addr, cb) {

    var p = os.platform();
    

    var callback = function(error, stdout, stderr) {
        // console.log('error: ' + error);
        // console.log('stdout: ' + stdout);
        // console.log('stderr: ' + stderr);
        if (error) {
            var err = new Error('ping.probe: there was an error while executing the ping program. check the path or permissions...');
            cb(null, err);
        } else if (stdout) {
            var result;
            var lines = stdout.split('\n');
            result = false;
            // console.log('lines',lines);
            for (var t = 0; t < lines.length; t++) {
                if (lines[t].search(/ttl=[0-9]+/i) > 0) {
                    result = true;
                    break;
                }
            }
            if (cb) {
                cb(result, null);
            }
        }
    };

    if (p === 'linux') {
        //linux
        exec('/bin/ping -n -w 2 -c 1 ' + addr, callback);
    } else if (p.match(/^win/)) {
        //windows
        exec('C:/windows/system32/ping.exe -n 1 -w 5000 ' + addr, callback);
    } else if (p === 'darwin') {
        //mac osx
        exec('/sbin/ping -n -t 2 -c 1 ' + addr, callback);
    }

}
