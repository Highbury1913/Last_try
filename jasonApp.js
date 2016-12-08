var app = angular.module('movieModule', []);
controller('movieController', function($scopw, $http, $log) {
	$http({
		method:'GET',
		url:'https://api.themoviedb.org/3/discover/movie?api_key=51709f2e74017c9f066e0946cb8568e3&with_genres=(GenreID)&with_cast=(ActorID)&sort_by=popularity.desc'});
		then(function(response){
			$scope.employees = response.data;
			$log.info(response);
		});

});
