var http = require("http");
var fs = require("fs");
var express = require("express");
var sqlite3 = require("sqlite3").verbose();
var path = require("path");

var file = "traffic.db";
var db = new sqlite3.Database(file);

var port = 8081;
var success200Code = 200;
var app = express();


var get_response = function(sqlQuery, callback)
{
  var fullQuery = "SELECT * FROM Traffic " + sqlQuery;

  var results = [];
  db.each(fullQuery, function(err, row) {
      var result = {};
      result["timestamp"] =  row.timestamp;
      result["destination_ip"] =  row.destination_ip;
      result["destination_vn"] =  row.destination_vn;
      result["direction_ingress"] =  row.direction_ingress;
      result["destination_port"] =  row.destination_port;
      result["protocol"] =  row.protocol;
      result["source_ip"] =  row.source_ip;
      result["source_vn"] =  row.source_vn;
      result["source_port"] =  row.source_port;
      result["sum_bytes_kb"] =  row.sum_bytes_kb;
      result["sum_packets"] =  row.sum_packets;
      results.push(result);
  },
  function(err, row){
      var finalResults = {};
      finalResults["results"] = results;
      callback(finalResults);
  });
}


app.use(express.static(path.join(__dirname, 'public')));

app.get("/", function(req, res){
            res.status(200).sendFile(path.join(__dirname+'/public/backbone/templates/index.html'));
          });

app.get("/results/:sql", function(req, res){
            res.set('Content-Type', 'text/plain');
            get_response(req.params.sql, function(returnValue){
                    res.status(200).json(returnValue);
                    });
            });


var server = app.listen(port, function () {
            console.log('Server running at http://127.0.0.1:%s/', port);
          });
