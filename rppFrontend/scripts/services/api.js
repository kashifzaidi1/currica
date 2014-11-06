
'use strict';
// interceptor service which can be used to control the requests
angular.module('rppFrontEnd')
  .factory('ApiService', ['$http', function($http) {
	  var ApiService = {};
	  // configured since it makes the PHP session more secure
	  $http.defaults.withCredentials = true;
	  // ApiService.baseUri = "http://rppapi.utm.io/";
	  ApiService.baseUri = "http://0.0.0.0:3000/";

	  /**
	   * Performs a get call for the API
	   * @param  {String} url
	   * @param  {Object} params
	   * @return {Promise}
	   */
	  ApiService.get = function(url, params) {
	  	var paramsString = "?";
	  	for(var param in params) {
	  		paramsString += param + "=" + params[param] + "&";
	  	}
	  	return $http.get(ApiService.baseUri + url + paramsString);
	  };

	  /**
	   * Performs a post call for the API
	   * @param  {[type]} url
	   * @param  {[type]} params
	   * @return {[type]}
	   */
	  ApiService.post = function(url, params) {
	  	// this is a missing feature in Angular, it does not
	  	// serialize the object into the string
	  	var paramString = "";
	  	for(var param in params) {
	  		var value = params[param];
	  		paramString += param + "=" + value + "&"
	  	}

	  	return $http({
	  		method: 'POST',
	  		url: ApiService.baseUri + url,
	  		data: paramString,
	  		headers: {'Content-Type': 'application/x-www-form-urlencoded'}
	  	});
	  };

	  return ApiService;
	}]);
