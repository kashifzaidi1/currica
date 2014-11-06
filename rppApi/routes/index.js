var db = require('../models');
var fs = require('fs');
 
exports.index = function(req, res){
	// save any file present here
    console.log(req);
}

exports.tada = function(req, res){
	// save any file present here
	if(typeof req.files['tada'] !== "undefined"){
		console.log(__dirname + '/../uploads/' + Math.random().toString(36).slice(2) + req.files.tada.originalFilename,req.files.tada.path);
		fs.rename(req.files.tada.path,
		 __dirname + '/../uploads/' + Math.random().toString(36).slice(2) + req.files.tada.originalFilename, function(err){
		 	if(!err){
		 		res.status(404).send(JSON.stringify("LALALALAL"));
		 	}
		 });
	}

}