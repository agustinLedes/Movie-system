const fs = require('fs');
const express = require('express');
const https = require('https');
const app = express();

app.use(express.json()); 

//Registrar Usuario
app.post("/addUser", (req, res) => {
    let userEmail = req.body.email;
    //fs.readFile("users.txt", "utf-8", found = (err, data) => {
    //    data.search(userEmail)
    //});
    found = -1;

    console.log(found);
    if (found == -1) {
        const user = {
            email: req.body.email, 
            firstName: req.body.firstName, 
            lastName: req.body.lastName, 
            password: req.body.password
        }

        fs.appendFile('users.txt', 'email:' + req.body.email + ',' + 'firstName:' +  req.body.firstName + ',' + 'lastName:' +  req.body.lastName + ',' + 'password:' +  req.body.password + ';\n'
                        ,function (err) {
            if (err) throw err;
            console.log('Saved!');
          });
        res.status(200).send(user);
        return;
    }

    res.status(400).send("The email is already in use or password is empty!");
})  


//Autenticar Usuario
app.post("/authUser", (req, res) => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    let userEmail = req.body.email;
    fs.readFile("users.txt", "utf-8", (err, data) => {
        //Email verification
        found = data.search(userEmail);

        console.log(found);
        if (found != -1) {
            //Password verification
            let passStart = data.indexOf(':', data.indexOf('password', found));
            let passEnd = data.indexOf(';', passStart);

            if (data.substring(passStart+1,passEnd) != req.body.password) {
                res.status(400).send("The password is invalid!");

                return;
            }

            //Token generation
            var token = "";
            for (var i = 0; i < Math.floor(Math.random() * 15) + 5; i++) {
                token += characters.charAt(Math.floor(Math.random() * characters.length));
            }

            fs.appendFile('tokens.txt', 'email:' + req.body.email + ',' + 'token:' + token + ';\n'
                            ,function (err) {
                if (err) throw err;
                console.log('Saved!');
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

        // A chunk of data has been received.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            let moviesResponse = [];
            const movies = JSON.parse(data);

            for (var i = 0; i < movies.results.length; i++) {
                movies.results[i]['suggestionScore'] = Math.floor(Math.random() * 99);
                
                moviesResponse.push(movies.results[i]);
            }

            moviesResponse.sort((a,b) => b.suggestionScore - a.suggestionScore)

            let userEmail = req.params.email;
            fs.readFile("tokens.txt", "utf-8", (err, data) => {
            //Email verification
            found = data.search(userEmail);
    
            if (found != -1) {
                //Token authentication
                let tokenStart = data.indexOf(':', data.indexOf('token', found));
                let tokenEnd = data.indexOf(';', tokenStart);
    
                if (data.substring(tokenStart+1, tokenEnd) != req.params.token) {
                    res.status(400).send("The token is invalid!");
    
                    return;
                }
    
                res.status(200).send(moviesResponse);
                return;
            }
    
            res.status(400).send("The email address is invalid!");
        });
        });

    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
})  

app.listen(8080, () => {console.log("Listening on port 8080")});