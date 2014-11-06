var helper = {
	notify : {}
};

helper.validateLength = function(valArr){
	for(var i in valArr){
		if(valArr[i].length <= 0)
			return false
	}
	return true;
};

helper.success = function(message){
	$.notify(message,"success");
};

helper.error = function(message){
	$.notify(message,"danger");
};

helper.hideCurrentActiveModal = function(){
	$('.modal').modal('hide');
};

helper.errorHandler = function(err, message){
	if(err.data && err.data.error)
		helper.error(err.data.error);
	else
		helper.error(message);
};
