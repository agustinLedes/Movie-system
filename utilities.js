const fs = require('fs');
const express = require('express');
const https = require('https');
const { mainModule } = require('process');
const app = express();

app.use(express.json()); 

const utilities = {

    /******Validate the email address and token are correct******/
    verifyEmailTokenIsCorrect : function(email, token, data) {
        //User Validation
        found = data.search('\"' + email + '\"');

        if (found != -1) {  
            //Token authentication
            tokens = JSON.parse(data);
            for (i = 0; i < tokens.userTokens.length; i++) {
                if ((tokens.userTokens[i].userEmail == email) && (tokens.userTokens[i].tokenValue != token)) {
                    return 'tokenFail';
                }
            }
            return 'success';
        }
        return 'emailFail';
    },


    /******Validate the files for information storage are created,
           if not, creates them******/
    validateStorageFiles : function() {
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
    }
};

module.exports = utilities;