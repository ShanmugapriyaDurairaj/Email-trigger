/*
######################################################################
 Description : Sending the email using Nodemailer and smtp 
 ####################################################################
*/
var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var handlebars = require('handlebars');
var fs = require('fs');
/*
########################################################################   
* Mail setup 
# to => "to" variable, add recipients. Example: test@gmail.com,test_to@gmail.com
# subject =>  "subject" variable, Add the mail subject
# html_file_name => What is your html file. Save your html file in the location "/public/pages/"
# Username => "username", Email sender name 
#####################################################################
*/
var to = 'test.d@test.com';
var subject='Clearing elite slots on newsletter from DEV team';
var html_file_name ='test.html';
var username="Shanmugapriya.Durairaj"
var is_office_365 = true; /* I will support Office 365 and Gmail */

/* ##############################################################
     MAIL DETAILS
    ###############################################################
*/
var OFFICE_EMAIL_ID = "shanmugapriya.d@test.com"
var OFFICE_EMAIL_PASSWORD = "PASSSSSS"

var GMAIL_ID ="ds111190@gmail.com";
var GMAIL_PASSWORD="@@@@@@";


if(is_office_365 == true){
    smtpTransport = nodemailer.createTransport({
        host: 'smtp.office365.com', // Office 365 server
        port: 587,     // secure SMTP
        secure: false, // false for TLS - as a boolean not string - but the default is false so just remove this completely
        auth: {
            user: OFFICE_EMAIL_ID,
            pass: OFFICE_EMAIL_PASSWORD
        },
        tls: {
            ciphers: 'SSLv3'
        }
    })    
}
else{
    smtpTransport = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        auth: {
            user: GMAIL_ID,
            pass: GMAIL_PASSWORD
        }
    }));
}
router.get('/', function(req, res, next) {    
var readHTMLFile = function(path, callback) {
    fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
        if (err) {
            throw err;
            callback(err);
        }
        else {
            callback(null, html);
        }
    });
};
readHTMLFile(__dirname + '/public/pages/'+html_file_name+'', function(err, html) { 
    var template = handlebars.compile(html);

    var from = OFFICE_EMAIL_ID != null ? OFFICE_EMAIL_ID : GMAIL_ID;
    var replacements = {
         username: username
    };  
    var htmlToSend = template(replacements);
    var mailOptions = {
        from: from ,
        to : to,
        subject : subject,
        html : htmlToSend
     };
    smtpTransport.sendMail(mailOptions, function (error, response) {
        if (error) {
            console.log(error);
            callback(error);
        }
        else{
            res.send('Mail sent successfully');
        }
    }); 
});
});
module.exports = router;
