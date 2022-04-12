const fs = require('fs');
const express = require('express');
const https = require('https');
const { mainModule } = require('process');
const app = express();

app.use(express.json()); 

if (!fs.existsSync('favoritos.txt')) {
    fs.writeFile("favoritos.txt", "{}", (err) => {
        if (err)
            console.log(err);
    });
}

if (!fs.existsSync('users.txt')) {
    fs.writeFile("users.txt", '{ \"usersNumber\" : 0}', (err) => {
        if (err)
            console.log(err);
    });
}

if (!fs.existsSync('tokens.txt')) {
    fs.writeFile("tokens.txt", "{ \"userTokens\" : [] }", (err) => {
        if (err)
            console.log(err);
    });
}


//Registrar Usuario
app.post("/addUser", (req, res) => {
    let userEmail = req.body.email;
    fs.readFile("users.txt", "utf-8", found = (err, data) => {
        found = data.search('\"' + userEmail + '\"');

        if (found == -1) {
            if (req.body.password != "") {
                let users = JSON.parse(data);

                users.usersNumber++;
                users['user' + users.usersNumber] = req.body;
                fs.writeFile("users.txt", JSON.stringify(users), (err) => {
                    if (err)
                    console.log(err);
                    else {
                    console.log("User registered successfully!\n");
                    }
                });
                res.status(200).send("User registered successfully!");
                return;
            }
            res.status(400).send("Can't Register a user without a password!");
        }

        res.status(400).send("The email is already in use!");
    });
})  


//Autenticar Usuario
app.post("/authUser", (req, res) => {  
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    let userEmail = req.body.email;
    fs.readFile("users.txt", "utf-8", (err, data) => {
        //Email verification
        found = data.search('\"' + userEmail + '\"');

        console.log(found);
        if (found != -1) {
            //Password verification
            let users = JSON.parse(data);

            for (i = 1; i <= users.usersNumber; i++) {
                console.log(users['user'+i].email)
                if (users['user'+i].email == userEmail)
                    passwordValid = (users['user'+i].password == req.body.password);
            }

            if (!passwordValid) {
                res.status(400).send("The password is invalid!");

                return;
            }

            //Token generation
            var token = "";
            for (var i = 0; i < Math.floor(Math.random() * 15) + 5; i++) {
                token += characters.charAt(Math.floor(Math.random() * characters.length));
            }

            fs.readFile("tokens.txt", "utf-8", (err, data) => {
                tokenFound = data.search('\"' + userEmail + '\"');
                tokens = JSON.parse(data);

                if (tokenFound != -1) {
                   for (i = 0; i < tokens.userTokens.length; i++) {
                        if (tokens.userTokens[i].userEmail == userEmail)
                            tokens.userTokens[i].tokenValue = token;
                    }
                }else {
                    const authenticationPair = {"userEmail" : userEmail, "tokenValue" : token}
                    tokens.userTokens.push(authenticationPair)
                }
                fs.writeFile("tokens.txt", JSON.stringify(tokens), (err) => {
                    if (err)
                      console.log(err);
                    else {
                      console.log("File written successfully\n");
                    }
                  });
    
                console.log(tokens);
            });

            res.status(200).send(token);
            return;
        }

        res.status(400).send("The email address is invalid!");
    });
})  


//Obtener Peliculas
app.get("/getMovies/:email/:token", (req, res) => {     
    https.get('https://api.themoviedb.org/3/movie/top_rated?api_key=69ccff162bcfc72e764ae9fc093e575f', (resp) => {
        let data = '';

        resp.on('data', (chunk) => {
            data += chunk;
        });

        resp.on('end', () => {
            let moviesResponse = [];
            movies = JSON.parse(data);
            let userEmail = req.params.email;
            let userToken = req.params.token;
            fs.readFile("tokens.txt", "utf-8", (err, data) => {
                //User Validation
                found = data.search('\"' + userEmail + '\"');
    
                if (found != -1) {  
                    //Token authentication
                    tokens = JSON.parse(data);
                    for (i = 0; i < tokens.userTokens.length; i++) {
                        if ((tokens.userTokens[i].userEmail == userEmail) && (tokens.userTokens[i].tokenValue != userToken)) {
                            res.status(400).send("The token is invalid!");
    
                            return;
                        }
                    }

                    for (var i = 0; i < movies.results.length; i++) {
                        movies.results[i]['suggestionScore'] = Math.floor(Math.random() * 99);
                        
                        moviesResponse.push(movies.results[i]);
                    }
                    moviesResponse.sort((a,b) => b.suggestionScore - a.suggestionScore)
                    res.status(200).send(moviesResponse);
                    return;
                }
                
                res.status(400).send("The email address is invalid!");
                return;
            });
        });
    });
}).on("error", (err) => {
    console.log("Error: " + err.message);
});


//Agregar Pelicula a Favoritos
app.post("/addFavoriteMovie/:email/:token", (req, res) => {
    let userEmail = req.params.email;
    let userToken = req.params.token;
    fs.readFile("tokens.txt", "utf-8", (err, data) => {
        //Email verification
        found = data.search('\"' + userEmail + '\"');

        console.log(found);
        if (found != -1) {
            //Token authentication
            tokens = JSON.parse(data);
            for (i = 0; i < tokens.userTokens.length; i++) {
                if ((tokens.userTokens[i].userEmail == userEmail) && (tokens.userTokens[i].tokenValue != userToken)) {
                    res.status(400).send("The token is invalid!");

                    return;
                }
            }

            fs.readFile("favoritos.txt", "utf-8", (err, data) => {
                favFound = data.search(userEmail);
                favoritos = JSON.parse(data);
                req.body.addedAt = new Date().toString();

                if (favFound != -1) {
                    (favoritos[userEmail]).push(req.body);
                }else {
                    const arrayToAdd = [].push(req.body)
                    console.log(req.body);
                    favoritos[userEmail] = [];
                    favoritos[userEmail].push(req.body)
                }
                fs.writeFile("favoritos.txt", JSON.stringify(favoritos), (err) => {
                    if (err)
                    console.log(err);
                    else {
                    console.log("File written successfully\n");
                    }
                });

                console.log(favoritos);
            });
            res.status(200).send("The movie was added to the favorite list of " + userEmail);
            return;
        }

        res.status(400).send("The email address is invalid!");
});
})  


//Obtener Peliculas Favoritas
app.get("/getFavoriteMovies/:email/:token", (req, res) => {     
    fs.readFile("favoritos.txt", "utf-8", (err, data) => {
        let userEmail = req.params.email;
        let userToken = req.params.token;
        let moviesResponse = [];
        movies = JSON.parse(data);

        fs.readFile("tokens.txt", "utf-8", (err, data) => {
            //Email verification
            found = data.search('\"' + userEmail + '\"');
    
            if (found != -1) {
                //Token authentication
                tokens = JSON.parse(data);
                for (i = 0; i < tokens.userTokens.length; i++) {
                    if ((tokens.userTokens[i].userEmail == userEmail) && (tokens.userTokens[i].tokenValue != userToken)) {
                        res.status(400).send("The token is invalid!");

                        return;
                    }
                }
                for (var i = 0; i < (movies[userEmail]).length; i++) {
                    movies[userEmail][i]['suggestionForTodayScore'] = Math.floor(Math.random() * 99);
                    
                    moviesResponse.push(movies[userEmail][i]);
                }
        
                moviesResponse.sort((a,b) => b.suggestionForTodayScore - a.suggestionForTodayScore)

                res.status(200).send(moviesResponse);
                return;
            }
    
            res.status(400).send("The email address is invalid!");
        });
    });
})  

app.listen(8080, () => {console.log("Listening on port 8080")});

