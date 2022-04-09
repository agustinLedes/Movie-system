const fs = require('fs');
const express = require('express');
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

            fs.appendFile('tokens.txt', req.body.email + ',' + token + '; \n'
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

app.listen(8080, () => {console.log("Listening on port 8080")});