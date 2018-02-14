const express = require('express')
const app = express();
var cors = require('cors')
var myProductName = "feedParserDemo"; myVersion = "0.4.3";

<<<<<<< HEAD
const FeedParser = require ("feedparser");
=======
var FeedParser = require('feedparser');
>>>>>>> 0295e9a834fc112544cdebc28caf2a5abc633bc4
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

//const dotenv = require('dotenv')
//const fs = require('fs')
//const envConfig = dotenv.parse(fs.readFileSync('./variables.env'))
 


//for (var k in envConfig) {
 // process.env[k] = envConfig[k]
  //console.log(process.env[k]); 
//}

//var CONFIG = require('../config.json');
/*
var dbprotocol = CONFIG.dbprotocol;
var dbhost = CONFIG.dbhost;
var dbuser = CONFIG.dbuser;
var dbpassword= CONFIG.dbpassword;
var dbuserDB=CONFIG.dbuserDB;
var dbcouchAuthDB=CONFIG.dbcouchAuthDB;
*/
<<<<<<< HEAD
var dbprotocol = process.env.protocol;
//console.log(dbprotocol);
var domain=process.env.host;
//console.log(domain);
var couchdbdomain=dbprotocol + domain;
//console.log(couchdbdomain);
var port=process.env.feedparserport;
//console.log(port);



=======
var dbprotocol = process.env.dbprotocol;
console.log(dbprotocol);
var clienturl=process.env.clienturl;
console.log(clienturl);
var clienturlwithprotocol=dbprotocol + clienturl;
console.log(clienturlwithprotocol);
//var port=process.env.feedParserServiceUrl;
//console.log(port);
var port=process.env.feedParserPort;
console.log(port);
	
>>>>>>> 0295e9a834fc112544cdebc28caf2a5abc633bc4


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
	



//connecting to couch db
const request = require ("request");
var dbprotocol=process.env.dbprotocol;
var dbhost=process.env.dbhost;
var dbport=process.env.dbPort;
var url = dbprotocol+dbhost;

var db = process.env.feeddbname;

console.log("urls",url,db)
var urlTestFeed;

var linkarray=[];
var feedsarray=[];
var unionFeeds=[];


function pullFeedsOnTime(link,feedname,res) {
	
/*request(url + db+'/_design/links/_view/link?group_level=1', function(err, res, body) {
			parsedBody = JSON.parse(body);
			

		linkarray = parsedBody.rows;
		console.log(linkarray)
		if(linkarray !== undefined){
	linkarray.map(key=>{*/
			//console.log(feedname);
			urlTestFeed = link;
		
		getFeed (urlTestFeed, function (err, feedItems) {
			if (!err) {
				function pad (num) { 
					var s = num.toString (), ctplaces = 3;
					while (s.length < ctplaces) {
					s = "0" + s;
					}
					return (s);
				}
			console.log ("There are " + feedItems.length + " items in the feed.\n");
				//res.send(feedItems);
				for (var i = 0; i < feedItems.length; i++) {
					//console.log ("Item #" + pad (i) + ": " + feedItems [i].title + ".\n");

				}
				//console.log(feedItems);
				//Get the feeds from the database 
				console.log("inside url",url+db+'/_all_docs?include_docs=true')
			request(url+'/' + db + '/_all_docs?include_docs=true', function(err, res, body) {
				console.log("bodu",body);
				parsedFeeds = JSON.parse(body);

				//console.log(body);
				feedsarray = parsedFeeds.rows;

				//Pass the feeds from the database to compare if the
				//feeds from newsrack are already present
				if(feedsarray.length != 0){

				//feedsarray = parsedFeeds.rows;
				//Pass the feeds from the database to compare if the
				//feeds from newsrack are already present

				unionFeeds = differenceOfFeeds(feedsarray,feedItems);
				//add the feeds which are not in the database to the database
				  unionFeeds.map(feed=>{
				  	feed.feednme = feedname;
					request.post({
					    url: url + db,
					    body: feed,
					    json: true,
					  }, function(err, resp, body) {
					  
					    console.log(err,body);
					});
				});
				}	  
			});

				
				
			}
		});
	//});
   //}

   		
  //});
}

function differenceOfFeeds(feedsarray,feedItems) {
	//console.log("feeds",feedItems[0].title,feedsarray[0].doc.title); 
	//var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
	//var res = _.differenceWith(objects, [{'x':2,'y':1},{ 'x': 1, 'y': 2 }], _.isEqual);
	var databasefeeds = feedsarray.map(value=>{

		delete value.doc._id;
		delete value.doc._rev;	

		return value.doc;

	});

	

	var res = _.differenceBy(feedItems,databasefeeds,'title');
	for (var i = 0; i < res.length; i++) {
		console.log("every result",res[i].title);
	}
	console.log("result",res.length)
	
	return res;



	
}
app.use(function(req, res, next) {
  //var allowedOrigins = ['http://127.0.0.1:8020', 'http://localhost:8020', 'http://127.0.0.1:9000', 'http://localhost:9000'];
  var allowedOrigins=clienturlwithprotocol;
  var origin = req.headers.origin;
  if(allowedOrigins.indexOf(origin) > -1){
       res.setHeader('Access-Control-Allow-Origin', origin);
  }
  //res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:8020');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  return next();
}); 

//Pull feeds on time inteval
/*app.get('/',cors(),function(req, res) {

	 var link = req.query.url;
	 var feedname = req.query.feedname;
	console.log("query params but in root", link, feedname);
	res.end();
	pullFeedsOnTime(link,feedname,res)
	setInterval(pullFeedsOnTime,3600000,link,feedname,res); 

});*/



app.get('/first',cors(),function(req, res) {

	 //var user_id = req.query.id;
	console.log("query params from /first", req.param, req.query);






getFeed (req.query.id, function (err, feedItems) {
	if(err){
		console.log("Some grave error", error);
	}
	if (!err) {
		function pad (num) { 
			var s = num.toString (), ctplaces = 3;
			while (s.length < ctplaces) {
			s = "0" + s;
			}
			return (s);
		}
	console.log ("There are " + feedItems.length + " items in the feed.\n");
		res.send(feedItems);
		for (var i = 0; i < feedItems.length; i++) {
			console.log ("Item #" + pad (i) + ": " + feedItems [i].title + ".\n");

		}
		
		
	}
});



	
  
});



function getFeed (urlfeed, callback) {
	console.log(urlfeed);
	var req = request (urlfeed);
	var feedparser = new FeedParser ();
	var feedItems = new Array ();
	req.on ("response", function (response) {
		var stream = this;
		if (response.statusCode == 200) {
			stream.pipe (feedparser);
			}
		});
	req.on ("error", function (err) {
		console.log ("getFeed: err.message == " + err.message);
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
		console.log ("getFeed: err.message == " + err.message);
		callback (err);
		});
	}

console.log ("\n" + myProductName + " v" + myVersion + ".\n"); 
/*getFeed (urlTestFeed, function (err, feedItems) {
	if (!err) {
		function pad (num) { 
			var s = num.toString (), ctplaces = 3;
			while (s.length < ctplaces) {
				s = "0" + s;
				}
			return (s);
			}
		console.log ("There are " + feedItems.length + " items in the feed.\n");
			res.send(feedItems);
			for (var i = 0; i < feedItems.length; i++) {
				console.log ("Item #" + pad (i) + ": " + feedItems [i].title + ".\n");

			}
			
			
		}
	});*/



app.listen(3000, () => console.log('Example app listening on port '))
