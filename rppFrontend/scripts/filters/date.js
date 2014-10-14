
'use strict';

angular.module('rppFrontEnd')
  .filter('date', function() {
    return function(dateString, format) {
        return moment(dateString).format(format);
    };
  }).filter('fromNow', function(){
  	return function(dateString){
  		return moment(dateString,'YYYYMMDD').fromNow();
  	};
  });
