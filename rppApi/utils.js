
exports.successObject = function(obj, res){
  	res.status(200).send(JSON.stringify(obj));
},

exports.signalError = function(err, res){
  	res.status(500).send(JSON.stringify({code: err.code, number: err.errno}));
},

exports.signalCustomError = function(err, res){
  	res.status(500).send(JSON.stringify({error : err}));
}