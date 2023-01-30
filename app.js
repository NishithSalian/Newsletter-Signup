const express = require("express");
const bodyParser = require("body-parser");
const client = require("@mailchimp/mailchimp_marketing");
const https = require("https");
const app = express();

// mailchimp config
client.setConfig({
  apiKey: "9b23019f0332cddcf0f60d555110958e-us21",
  server: "us21",
});

// allowing app to use body-parser
app.use(bodyParser.urlencoded({ extended: true }));

// allowing app to use express.static to load static files
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  // getting information from the signup page using body-parser
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.email;

  // sending request and creating the data to send to the external server
  const run = async () => {
    const response = await client.lists.batchListMembers("418ff31f18", {
      members: [
        {
          email_address: email,
          status: "subscribed",
          merge_fields: {
            FNAME: firstName,
            LNAME: lastName,
          },
        },
      ],
    });
    console.log(response.errors[0]);
    if (response.errors[0] === undefined) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
  };
  run();
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

app.listen(3000, function (req, res) {
  console.log("Server is running on port 3000");
});
