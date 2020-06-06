const nconf = require('nconf');
const fetch = require('cross-fetch');
const fs = require('fs');

// Use nconf to set user-based / environment settings
nconf.argv().env().file({ file: "conf.json"});
const key = nconf.get("request:apiKey");
const tenant = nconf.get("request:tenant");
const accept = nconf.get("request:accept");

// Configure CSV Stringify (https://csv.js.org/)
const stringify = require('csv-stringify');
const stringifyOpts = {
    header: true
};

// Configure ExcelJS https://www.npmjs.com/package/exceljs); using existing if available
const excel = require('exceljs');
const reportWorkbook = new excel.Workbook();
const reportPath = nconf.get("excel:file");
if (fs.existsSync(reportPath)) {
    reportWorkbook.xlsx.readFile(reportPath);
} else {
    reportWorkbook.creator = nconf.get("excel:creator");
}

// Create standardized request skeleton (bearer token will be added later)
let requestSkeleton = {
    method: 'GET', 
    headers: {
        'Accept': accept, 
        'cache-control': 'no-cache', 
        'x-api-key': key
    }
}

// Build root URL for easier substitution in later requests
const root = `${nconf.get('env:server')}/${tenant}/target`
const authUrl = `${root}/auth`;

// As tokens are time-based, you'd likely have a token-retrieval operation at the start
getAuthToken(authUrl, requestSkeleton)
    .then(token => {

        // This can be done differently, but for purposes of this demo this 
        // function will call the next fetch(es). To simplify, adding the 
        // bearer token to the requestSkeleton
        requestSkeleton.headers.authorization = `Bearer ${token}`;

        // We'll call the activities ULR and get a sample object
        console.log("Retrieving activites");
        const activiesUrl = `${root}/activities/`
        fetch(activiesUrl, requestSkeleton)
            .then(res => {
                // Outputting request to validate that authentication header set
                console.log(requestSkeleton);

                // This is a basic mechanism of fetch API. Can be either .text() or .json(); 
                // using .json() as we know all responses will be JSON
                return res.json();
            })
            .then(data => {
                // Easiest to abstract this into it's own, repeatable method; this one for CSV...
                writeJsonToCsv(data["activities"], `activities.csv`);
                // ... and this one for Excel
                writeJsonToExcel(data["activities"], reportPath, 'activities');
            })
            .catch(err => console.log(err));

        // Just to show adding additional data... 
        console.log("Retrieving audiences");
        const audiencesUrl = `${root}/audiences/`
        fetch(audiencesUrl, requestSkeleton)
            .then(res => {
                return res.json();
            })
            .then(data => {
                writeJsonToCsv(data["audiences"], `audiences.csv`);
                writeJsonToExcel(data["audiences"], reportPath, 'audiences');
            })
            .catch(err => console.log(err));

    })
    .catch(err => console.log(err));


async function getAuthToken(authUrl, requestObj) {
    console.log("Retrieving auth token");
    let authRes = await fetch(authUrl, requestObj);
    tokenJson = await authRes.json();
    return tokenJson.token;
}

function writeJsonToCsv(json, file) { 
    console.log(`Writing JSON to CSV, using file ${file}`);
    stringify(json, stringifyOpts, (err, data) => {
        fs.writeFile(`output/csv/${file}`, data, (err) => {
            console.log(err);
        })
    });
}

function writeJsonToExcel(json, file, tab) {
    const sheet = reportWorkbook.addWorksheet(tab);
    let first = true;

    json.forEach(row => {
        if (first) {
            // This is the first row, make sure to output the titles
            let keyArray = [];
            for (k in row) {
                keyArray.push(k);
            }
            sheet.addRow(keyArray);
            first = false;
        }

        let valArray = [];
        for (k in row) {
            valArray.push(row[k]);
        }
        sheet.addRow(valArray)
    })

    reportWorkbook.xlsx.writeFile(file);
}