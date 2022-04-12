# Movie-system

How to use:

The program in the repository is a API with 5 endpoints, corresponding to 5 operations; them being: 
Registrar usuario (Log on User), Autenticar usuario (Authenticate User), Obtener películas (Get Movies), Agregar película a favoritos (Add movie to favorites)
Obtener películas favoritas (Get favorite movies).


Registrar Usuario:>
  This is a HTTP Post operation, is called on the endpoint http://localhost:8080/addUser.
  The body of the request contains the user email (email), first name (firstName), last name (lastName) and password (password).
  The email and password field are required, all fields are string.
  
  Request body example:  {
                          "email": "Martin@mail.com",
                          "firstName": "Martin",
                          "lastName": "Perez",
                          "password": "martin123"
                         }
                 
                 
 Autenticar Usuario:
  This is a HTTP Post operation, is called on the endpoint http://localhost:8080/authUser.
  The body of the request contains the user email (email)  and password (password) of a user that has been already registered.
  The email and password field are required, all fields are string.
  If the email does't match any registered user email or the password is not correct for that user email the operation will fail.
  If the operation is successful it will return a token that will be then used to call others operations on the API.
  
  Request body example:  {
                          "email": "Martin@mail.com",
                          "password": "martin123"
                         }


Obtener películas:
  This is a HTTP Get operation, is called on the endpoint http://localhost:8080/getMovies/:email/:token.
  The email and token parameters are required.
  If the email does't match any registered user email or the token is not correct for that user email the operation will fail.
  If the operation is successful it will return a list of movies from the system ordered by a value called "suggestionScore".
  
  
Agregar película a favoritos:
  This is a HTTP Post operation, is called on the endpoint http://localhost:8080/addFavoriteMovie/:email/:token.
  The body of the request contains the information of a movie.
  The email and token parameters are required.
  If the email does't match any registered user email or the token is not correct for that user email the operation will fail.
  If the operation is successful it will add the movie to the list of favorite movies of the user with the corresponding email.
  
  Request body example:  {
                          "adult": false,
                          "backdrop_path": "/loRmRzQXZeqG78TqZuyvSlEQfZb.jpg",
                          "genre_ids": [
                              18,
                              36,
                              10752
                          ],
                          "id": 424,
                          "original_language": "en",
                          "original_title": "Schindler's List",
                          "overview": "The true story of how businessman Oskar Schindler saved over a thousand Jewish lives from the Nazis while they worked as slaves                                        in his factory during World War II.",
                          "popularity": 58.781,
                          "poster_path": "/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg",
                          "release_date": "1993-11-30",
                          "title": "Schindler's List",
                          "video": false,
                          "vote_average": 8.6,
                          "vote_count": 12616,
                          "suggestionScore": 76
                        }


Obtener películas favoritas:
  This is a HTTP Get operation, is called on the endpoint http://localhost:8080/getFavoriteMovies/:email/:token.
  The email and token parameters are required.
  If the email does't match any registered user email or the token is not correct for that user email the operation will fail.
  If the operation is successful it will return a list of the movies added to the favorite list of the user, ordered by a value called "suggestionForTodayScore".
