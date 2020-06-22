const express = require('express');
const app = express();
const port = 9000;
const nconf = require("nconf");

// This just exists to mock the API responses, but otherwise is not part of the "real" example

// Prepare mock data
const mockData = {
    "activities": {
        "activities": [
            {
                "id": 168805,
                "thirdPartyId": "2fc846c4-d5c6-4d67-9ef8-939bb907cc71",
                "type": "ab",
                "state": "deactivated",
                "name": "A3 - L4242 - Serversid testing",
                "priority": 0,
                "modifiedAt": "2017-05-11T10:11:35Z",
                "workspace": "1234567"
            }
        ]
    }, 
    "audiences": {
        "total": 289,
        "audiences": [
            {
                "id": 1216090,
                "name": "A1 -  Active account l-1489628809975",
                "description": "--",
                "origin": "target",
                "modifiedAt": "2017-03-16T01:47:07Z",
                "workspace": "1234567"
            }
        ]
    }
}



// To ensure 1:1 match, use same configruation file
nconf.argv().env().file({file: "conf.json"});
const tenant = nconf.get("request:tenant");

console.log("Starting");
console.log(tenant);

// Setup simple express server for calling examples
app.post(`/${tenant}/target/auth`, (req, res) => {
    let tokenRes = {
        "accessToken": "banana-for-scale",
        "tokenType": "bearer",
        "scope": "profile_api",
        "expiresIn": 7775999
    }
    res.json(tokenRes);
}); 

app.get(`/${tenant}/target/activities`, (req, res) => {
    res.json(mockData.activities);
}); 

app.get(`/${tenant}/target/audiences`, (req, res) => {
    res.json(mockData.audiences);
}); 

app.listen(port, () => {
    console.log(`Data server running at port ${port}`);
})