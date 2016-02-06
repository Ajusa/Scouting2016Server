function serverStore() {
    riot.observable(this) // Riot provides our event emitter.
    var express = require('express');
    var app = express();
    var fs = require('fs');
    var bodyParser = require('body-parser');
    var cors = require('cors')
    var moment = require('moment');
    var json2csv = require('nice-json2csv');
    var address, os = require('os'),
        ifaces = os.networkInterfaces();
    var portNum = 628; //Because Eashwar said so
    var haozhiSaidNice = new Array();
    var self = this;
    self.on('start_server', function() {
        app.use(bodyParser.json()); // support json encoded bodies
        app.use(bodyParser.urlencoded({
            extended: true
        }));
        app.use(cors());

        app.post('/', function(req, res) {
            haozhiSaidNice.push(req.body);
            fs.writeFile("test.csv", json2csv.convert(haozhiSaidNice), function(err) {
                if (err) {
                    return console.log(err);
                }
                self.trigger("new_data", moment().format("h:mm:ss a"), req.body.name)
                console.log("The file was saved!");
            });
        });
        app.get('/', function(req, res) {
            res.send("<pre>" + JSON.stringify(haozhiSaidNice, null, 4) + "</pre>");
            //console.log(getIP());
        });

        app.listen(portNum, function() {
            //console.log('Example app listening on port ' + portNum + '!');
        });
        //function jsontocsv(input){
        //  return input.auton.move + ',' + input.auton.foul + ',' + input.auton.interfere + ',' + input.auton.defense.reach + ',' + input.auton.defense.
        //}

    });
    self.on('get_ip', function() {

        for (var dev in ifaces) {

            // ... and find the one that matches the criteria
            var iface = ifaces[dev].filter(function(details) {
                return details.family === 'IPv4' && details.internal === false;
            });

            if (iface.length > 0) address = iface[0].address;
            self.trigger('set_ip', address)
        }
        console.log(address)
    });
    self.on('stop_server', function() {
        var serverStopper = app.listen(portNum);

        // listen for an event
        serverStopper.close();
        self.trigger('server_stopped');

    });
}
