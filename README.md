# Movie-system

How to use:

The program in the repository is a API with 5 endpoints, corresponding to 5 operations; them being: 
Registrar usuario (Log on User), Autenticar usuario (Authenticate User), Obtener películas (Get Movies), Agregar película a favoritos (Add movie to favorites)
Obtener películas favoritas (Get favorite movies).

Registrar Usuario:
  This is a HTTP Post operation, is called on the endpoint http://localhost:8080/addUser.
  The body of the request contains the user email (email), first name (firstName), last name (lastName) and password (password).
  The email and password field are required, all fields are string.
  
  Request body example:  {
                          "email": "Martin@mail.com",
                          "firstName": "Martin",
                          "lastName": "Perez",
                          "password": "martin123"
                         }
