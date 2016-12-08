
/************movies main controller******************/
/******Handle all the inputs and outputs*************/
/****************************************************/


// $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
//     if (toState.resolve) {
//         $scope.showSpinner();
//     }
// });

// $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
//     if (toState.resolve) {
//         $scope.hideSpinner();
//     }
// });


app.controller('moviesController', ['$scope','moviesService','$window' , function($scope, moviesService, $window){

  $scope.actorModel = "";

  $scope.customG = true;

  $scope.customA = true;

  $scope.customS = true;

  $scope.customM = false;

  var moviesOptions = [];

  moviesService.getGenreList().then(function () {
       $scope.genreOptions = moviesService.genre;
       $scope.selectedGenre = moviesService.genre[0];
  });


  $scope.suggestedMovies = moviesOptions;

  $scope.makeShowG = function(){
    $scope.customG = false;
    $scope.customA = true;
  };

  $scope.makeShowA = function(){
    $scope.customA = false;
    $scope.customG = true;
  };

  $scope.btnRand = function(){

    $scope.customM = false;
    $scope.customS = true;
    moviesService.emptyMoviesPull();
    //moviesOptions = [];


    if($scope.actorModel == ""){ //Getting movies by Genre
      moviesService.getMoviesByGenre($scope.selectedGenre).then(function () {
        if($scope.selectedGenre.name == "Select Genre"){
          alert("Please Select Genre");
          return;
        }
        for(var i = 0; i < 2; i++){
          moviesOptions[i] = moviesService.getRandMovie();
        }
      });
    }else{ //Getting movies by Actor
      moviesService.actorIdByActorName($scope.actorModel).then(function (){
        moviesService.getMoviesByActor(moviesService.actor.id).then(function () {

          for(var i = 0; i < 2; i++){
          moviesOptions[i] = moviesService.getRandMovie();
          }
          $scope.actorModel = "";
        });
      })
    }

  };


  $scope.btnRemove = function(movie){
    // if(moviesService.movie < 2){
    //   moviesOptions[moviesOptions.indexOf(movie)] = moviesService.getRandMovie();
    // }else{
    //   $window.alert('Thats It !!!');
    // }
    var temp = moviesService.getRandMovie();
    if (temp){
      moviesOptions[moviesOptions.indexOf(movie)] = temp;
    }else{
      moviesOptions.splice(moviesOptions.indexOf(movie),1);

      $scope.customM = true;
      $scope.customS = false;
      //moviesService.emptyMoviesPull();
      $scope.selctedMovie = moviesOptions[0];
      // moviesOptions = [];

      //$window.alert('Thats it !!!');
    }
  };
  $scope.btnChoose = function(movie){
    $scope.customM = true;
    $scope.customS = false;
    moviesService.emptyMoviesPull();
    $scope.selctedMovie =  movie;
  }

}]);
