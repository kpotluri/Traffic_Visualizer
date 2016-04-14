var sqlite3 = require("sqlite3").verbose();
var fs = require("fs");
var file = "traffic.db";
var exists = fs.existsSync(file);
var db = new sqlite3.Database(file);

if(!exists) {
  console.log("Creating DB file.");
  fs.openSync(file, "w");
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};


db.serialize(function() {

  if(!exists) {

    //SQLite3 only has INT, TEXT, NULL, REAL and BLOB data types. Hence some of the data types assigned are less than ideal
    db.run("CREATE TABLE if not exists Traffic (timestamp INT, destination_ip TEXT, destination_vn TEXT, direction_ingress INT, destination_port INT, protocol INT, source_ip TEXT, source_vn TEXT, source_port INT, sum_bytes_kb INT, sum_packets INT)");

    var timeStamp = Date.now();
    var protocol = 6;
    var directionIngress = 1;
    var sumBytes = 0;
    var sumPackets = 0;
    var locations = {};

    for (var i = 1; i < 11; i++) {
      var location = {};
      location["ip"] = "10.1.1." + String(i);
      location["vn"] = "project"+String(i)+":virtual-network"+String(i);
      location["port"] = getRandomInt(1000,9999);
      locations[i] = location;
    }

    var stmt = db.prepare("INSERT INTO Traffic VALUES (?,?,?,?,?,?,?,?,?,?,?)");

    for (var i = 0; i < 10000; i++) {
      timeStamp += 60000;
      protocol = getRandomInt(1,10);
      directionIngress = Math.round(Math.random());
      sumBytes = getRandomInt(1000, 99999);
      sumPackets = getRandomInt(1000, 99999);
      var j =  getRandomInt(1, 10);
      var source_ip = locations[j].ip;
      var source_vn = locations[j].vn;
      var source_port = locations[j].port;
      var k =  getRandomInt(1, 10);
      var destination_ip = locations[k].ip;
      var destination_vn = locations[k].vn;
      var destination_port = locations[k].port;

      stmt.run( timeStamp, destination_ip, destination_vn, directionIngress, destination_port, protocol, source_ip, source_vn, source_port, sumBytes, sumPackets);
    }
    stmt.finalize();

  }
});
