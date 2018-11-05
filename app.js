var express = require('express');
var app = express();
var fs = require('fs');

var server = app.listen(3000, function () {
	var port = server.address().port;

  	console.log('App listening at port:', port);
});

app.get('/', function(req, res) {
	res.redirect('index.html');
});

app.get('/add-route', function(req, res) {
	var route = req.query.qRoute;
	var action = req.query.qAction;
	var target = req.query.qTarget;

	var append = "\n\napp.get('"+route+"', function(req, res) {"+
		"res."+action+"('"+target+"');"+
	"});";

	fs.appendFile("app.js", append, function(err) {
	    if(err) {
	        return console.log(err);
	    }
	    res.json("Route created");
	    console.log("The file was saved!");
	}); 
});

app.get('/get-html', function(req, res) {
	var folder = __dirname + '/public/';
	var temp = [];
	fs.readdir(folder, (err, files) => {
		files.forEach(file => {
			if(file.substr(-5) == '.html')
	 			temp.push(file);
  		});
  		res.json(temp);
	})
});

app.use(express.static(__dirname + '/public',{ redirect : false }));
