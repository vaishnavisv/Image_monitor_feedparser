const express = require('express')
const app = express();
var cors = require('cors')
//Import feed parser to parse the xml feeds to json
var FeedParser = require('feedparser');
// Load the full build.
var _ = require('lodash');
// Load the core build.
//var _ = require('lodash/core');
// Load the FP build for immutable auto-curried iteratee-first data-last methods.
var fp = require('lodash/fp');

// Load method categories.
var array = require('lodash/array');
var object = require('lodash/fp/object');

// Cherry-pick methods for smaller browserify/rollup/webpack bundles.
var at = require('lodash/at');
var curryN = require('lodash/fp/curryN');
//Import and add btoa
var btoa = require('btoa');
//Import and add cron
//var cron = require('cron');
//Import request to make http requests
const request = require ("request");
//Import db protocol from environment and store in variable
var dbprotocol = process.env.dbprotocol;//for production environment
//var dbprotocol = 'http://';
//Import db port of feedparser service from environment and store in variable
var port=process.env.feedParserPort || 3000;


//connecting to couch db
//Import database host like 'mmcouch.test.openrun.net'
var dbhost=process.env.dbhost;
//Import database port like 5984 for couchdb in local (localhost:5984)
var dbport=process.env.dbPort;
//Import database username and password from the environment
var dbusername = process.env.dbuser; //for production environment
//var dbusername = 'admin';//for development environment
var dbpassword = process.env.dbpassword; //for production environment
//var dbpassword = 'admin';//for development environment
//The complete url of database host with protocol
var url = dbprotocol+dbhost; //for production environment
	//var url = 'http://localhost:5984';//for development environment
//Import database feeds from environment variable
var db = process.env.feeddbname; //for production environment
	//var db ='feeds';//for development environment
//Import client url to set cors

var clienturl='localhost:4200';
		//var clienturl=process.env.clienturl;//for production environment

	var clienturlwithprotocol= dbprotocol + clienturl;
	//console.log(clienturlwithprotocol);

/*  The MIT License (MIT)
	Copyright (c) 2014-2017 Dave Winer

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.
	*/

//cors settings
app.use(function(req, res, next) {
  //var allowedOrigins = ['http://127.0.0.1:8020', 'http://localhost:8020', 'http://127.0.0.1:9000', 'http://localhost:9000'];
 	//console.log(clienturlwithprotocol);
   var allowedOrigins=clienturlwithprotocol;
  var origin = req.headers.origin;
  if(allowedOrigins.indexOf(origin) > -1){
       res.setHeader('Access-Control-Allow-Origin', origin);
  }
  //res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:8020');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Methods', 'POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Credentials', true);
  return next();
});



//Fetch the feeds when user adds a new link
app.get('/',cors(),function(req, res) {
	getFeed (req.query.id, function (err, feedItems) {
		if(err){
			//res.send(err);
		console.log("Some grave error", err);
		}
		if (!err) {
			console.log ("There are " + feedItems.length + " items in the feed.\n");
			res.send(feedItems);
		}
	});
});


//Function to get the parsed json feeds from an xml
function getFeed (urlfeed, callback) {
	//console.log(urlfeed);
	var req = request (urlfeed);
	var feedparser = new FeedParser ();
	var feedItems = new Array ();
	req.on ("response", function (response) {
		var stream = this;
		if (response.statusCode == 200) {
			stream.pipe (feedparser);
			}
		//console.log(response);
		});
	req.on ("error", function (err) {
		console.log ("getFeed: err.message == " + err.message);
		callback(err.message);
	});
	feedparser.on ("readable", function () {
		try {
			var item = this.read (), flnew;
			if (item !== null) { //2/9/17 by DW
				feedItems.push (item);
				}
			}
		catch (err) {
			console.log ("getFeed: err.message == " + err.message);
			}
		});
	feedparser.on ("end", function () {
		callback (undefined, feedItems);
		});
	feedparser.on ("error", function (err) {
		console.log ("getFeed: err.message ==" + err.message);
		callback (err.message);
	});
	}


app.listen(port, () => console.log('Example app listening on port '))
