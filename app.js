//jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }
        }]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us12.api.mailchimp.com/3.0/lists/4e82e091a1";

    const options = {
        method: "POST",
        auth: "niharika:c8dfee87f31e528021faf952a21f922b-us12"
    }

    const request = https.request(url, options, function (response) {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function (data) {
            console.log(JSON.parse(data));
        });

    })

    request.write(jsonData);
    request.end();

});

app.post("/failure", function (req, res) {
    res.redirect("/");
})

// {
//     "email_address": "$user_email",
//     "status": "subscribed",
//     "merge_fields": {
//         "FNAME": "$user_fname",
//         "LNAME": "$user_lname"
//     }
// }

app.listen(process.env.PORT || 3000, function () {
    console.log("Server is running on port 3000!");
});

// API Key
// c8dfee87f31e528021faf952a21f922b-us12

// List ID
// 4e82e091a1