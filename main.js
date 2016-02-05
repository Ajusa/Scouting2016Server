var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var cors = require('cors')
var json2csv = require('nice-json2csv');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cors());
var portNum = 628; //Because Eashwar said so
var haozhiSaidNice = new Array();
app.post('/', function(req, res) {
   // res.send('POST request to the homepage');
    //console.log();
    haozhiSaidNice.push(req.body);
    fs.writeFile("test.csv", json2csv.convert(haozhiSaidNice), function(err) {
        if (err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });
});
app.get('/', function(req, res) {
    res.send("<pre>" + JSON.stringify(haozhiSaidNice, null, 4) + "</pre>");
});

app.listen(portNum, function() {
    console.log('Example app listening on port ' + portNum + '!');
});
//function jsontocsv(input){
//	return input.auton.move + ',' + input.auton.foul + ',' + input.auton.interfere + ',' + input.auton.defense.reach + ',' + input.auton.defense.
//}
