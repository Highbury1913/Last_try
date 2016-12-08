// var dummyData  = [
//     {id: 0, title: "The Godfather", overview: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.", year: 1972, img:"https://images-na.ssl-images-amazon.com/images/M/MV5BNTUxOTdjMDMtMWY1MC00MjkxLTgxYTMtYTM1MjU5ZTJlNTZjXkEyXkFqcGdeQXVyNTA4NzY1MzY@._V1_SY1000_CR0,0,706,1000_AL_.jpg", rt: 4, genre: "drama"},
//     {id: 1, title: "Pulp Fiction", overview: "The lives of two mob hit men, a boxer, a gangster's wife, and a pair of diner bandits intertwine in four tales of violence and redemption.", year: 1994, img: "https://images-na.ssl-images-amazon.com/images/M/MV5BMTkxMTA5OTAzMl5BMl5BanBnXkFtZTgwNjA5MDc3NjE@._V1_SY1000_CR0,0,673,1000_AL_.jpg" , rt: 3, genre: 'action'},
//     {id: 2, title: "Snatch", overview: "Unscrupulous boxing promoters, violent bookmakers, a Russian gangster, incompetent amateur robbers, and supposedly Jewish jewelers fight to track down a priceless stolen diamond.", year: 2002, img: "https://images-na.ssl-images-amazon.com/images/M/MV5BMTA2NDYxOGYtYjU1Mi00Y2QzLTgxMTQtMWI1MGI0ZGQ5MmU4XkEyXkFqcGdeQXVyNDk3NzU2MTQ@._V1_SY1000_SX684_AL_.jpg", rt: 5, genre: "romance"},
//     {id: 3, title: "Fight Club", overview: "An insomniac office worker, looking for a way to change his life, crosses paths with a devil-may-care soap maker, forming an underground fight club that evolves into something much, much more.", year: 1999, img: "https://images-na.ssl-images-amazon.com/images/M/MV5BNGM2NjQxZTAtMmU5My00YTk5LWFmOWMtYjZlYzk4YzMwNjFlXkEyXkFqcGdeQXVyNDk3NzU2MTQ@._V1_SY1000_CR0,0,666,1000_AL_.jpg", rt: 3, genre: "comedy"},
//     {id: 4, title: "Rounders", overview: "A young man is a reformed gambler who must return to playing big stakes poker to help a friend pay off loan sharks.", year: 1998, img: "https://images-na.ssl-images-amazon.com/images/M/MV5BMTc4OTcxNDY2Nl5BMl5BanBnXkFtZTgwNDg0MzkxMDE@._V1_.jpg", rt: 4, genre: "drama" },
//     {id: 5, title: "Inside Out", overview: "After young Riley is uprooted from her Midwest life and moved to San Francisco, her emotions - Joy, Fear, Anger, Disgust and Sadness - conflict on how best to navigate a new city, house, and school.", year: 2015, img: "https://images-na.ssl-images-amazon.com/images/M/MV5BOTgxMDQwMDk0OF5BMl5BanBnXkFtZTgwNjU5OTg2NDE@._V1_SY1000_CR0,0,674,1000_AL_.jpg", rt: 5, genre: "action"}
//   ];

  // var dummyGenre = [
  //   {label: 'Select Genre', id: 0},
  //   {label: 'Drama', id: 1},
  //   {label: 'Action', id: 2},
  //   {label: 'Comedy', id: 3},
  //   {label: 'ChickFlick', id: 4}
  //   ];

    var dummyPG = [
      {label: "Select PG Rating", id: 0},
      {label: "PG", id: 1},
      {label: "PG-13", id: 2},
      {label: "R", id: 3},
      {label: "CD-17", id: 4}
    ];

/*******************movies main service*********************/
/*handle main client logic and comunicates with the server**/
/***********************************************************/


app.factory('moviesService', ['$http', function ($http) {

  //movies obj
  var movies = {
    moviesOptions: [],
    moviesPull: [],
    actor: {},
    genre: [],
    pg:[]

  }


  movies.pg = dummyPG;

  //Helper func to get a random movie obj from the movies pull
  movies.getRandMovie = function(){
    if(movies.moviesPull.length > 0){
      var movieIndex = Math.floor((Math.random() * (movies.moviesPull.length-1)));
      var temp = movies.moviesPull[movieIndex];
      movies.moviesPull.splice(movieIndex, 1);
      return temp;
    }else{
      return false;
    }
  };

  //Helper func to retrieve genre name by genre id
  movies.getGenreById = function(id){
    for(i in movies.genre){
      if(id == movies.genre[i].id){
        return movies.genre[i].name;
      }
    }
  }

  //Helper func for emptying the movies pull
  movies.emptyMoviesPull = function(){
    movies.moviesPull = [];
  }


  /*************server comunication***************/


  //Ask for the Genre list from the server
    movies.getGenreList = function () {
     return $http.get('/genre').success(function (data) {
      angular.copy(data.genres, movies.genre);
      movies.genre.splice(0, 0, {id: 0, name: "Select Genre"});
    });
  };

  //Ask for list of movies with the requsted genre
  movies.getMoviesByGenre = function (genre) {

     return $http.get('/moviesByGenre' + genre.id).success(function (data) {

      var tempMovieList = [];
      angular.copy(data.results, tempMovieList);
      for(var i =0; i < tempMovieList.length; i++){
        movies.moviesPull.push(
          {
            title: tempMovieList[i].title,
            genre: genre.name,
            img: "https://image.tmdb.org/t/p/w600_and_h900_bestv2" + tempMovieList[i].backdrop_path,
            overview: tempMovieList[i].overview
          })
      }
    });
  };

  //Ask for actor id by actor name
  movies.actorIdByActorName = function(actorName){

    return $http.get('/actor' + actorName).success(function (data) {
      movies.actor = {name: actorName, id: data.results[0].id};

    });
  };

  //Ask for list of movies by actor id
  movies.getMoviesByActor = function(actorId){

    return $http.get('/moviesByActor' + actorId).success(function (data) {

      var tempMovieList = [];
      angular.copy(data.results, tempMovieList);
      for(var i =0; i < tempMovieList.length ; i++){
      var currentGenre = movies.getGenreById(tempMovieList[i].genre_ids[0]);

        movies.moviesPull.push(
          {
            title: tempMovieList[i].title,
            genre: currentGenre,
            img: "https://image.tmdb.org/t/p/w600_and_h900_bestv2" + tempMovieList[i].backdrop_path,
            overview: tempMovieList[i].overview
          })

      }

    });
  };


  return movies;

}]);


 // movies.getMoviesByGenreFromServer = function (genre) {
  //    $http.get('moviesServer/').success(function (data) {
  //     console.log(data)

  //     angular.copy(data, movies.moviesPull);
  //   });
  // };

  // movies.getMoviesByPGFromServer = function (pg) {
  //    $http.get('moviesServer').success(function (data) {
  //     console.log(data)

  //     angular.copy(data, movies.moviesPull);
  //   });
  // };
