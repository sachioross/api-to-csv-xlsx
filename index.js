const nconf = require('nconf');
const fetch = require('cross-fetch');


// Use nconf to set user-based / environment settings
nconf.argv().env().file({ file: "conf.json"});
const key = nconf.get("request:apiKey");
const tenant = nconf.get("request:tenant");
const accept = nconf.get("request:accept");

// Create standardized request object
let requestSkeleton = {
    method: 'GET', 
    headers: {
        'Accept': accept, 
        'cache-control': 'no-cache', 
        'x-api-key': key
    }
}

// Build URL
const root = `${nconf.get('env:server')}/${tenant}/target`
const authUrl = `${root}/auth`;

// As tokens are time-based, you'd likely have a token-retrieval operation at the start
fetch(authUrl, requestSkeleton)
    .then(res => {
        console.log(requestSkeleton);
        console.log(res);
        return res.json();
    })
    .then(data => {
        console.log(data);
        requestSkeleton.headers.authorization = `Bearer ${data.token}`;

        // Write the new file
        const activiesUrl = `${root}/activities/`
        fetch(activiesUrl, requestSkeleton)
            .then(res => {
                return res.json();
            })
            .then(data => {
                writeJsonToCsv(data);
            })
            .catch(err => console.log(err));

        // Add to existing file
        const audiencesUrl = `${root}/audiences/`
        fetch(audiencesUrl, requestSkeleton)
            .then(res => {
                return res.json();
            })
            .then(data => {
                addJsonToCsv(data);
            })
            .catch(err => console.log(err));

    })
    .catch(err => console.log(err));


function writeJsonToCsv(json) { 
    console.log("Writing JSON to CSV");
    console.log(json);
}

function addJsonToCsv(json) {
    console.log("Adding JSON to CSV"); 
    console.log(json);
}