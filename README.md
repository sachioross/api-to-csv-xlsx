# Context

This is a simple demo to show issuing requests to an API and saving the results in either CSV or XSLX formats using NodeJS. 

# Modules

The following table lists the modules used in this example and their purpose. 

| Module | Purpose |
|---|---|
| [ExpressJS](https://expressjs.com/) | API Framework, used for Mocking Server only |
| [nconf](https://www.npmjs.com/package/nconf) | Facilitates application configuration management and retrieval |  
| [csv](https://www.npmjs.com/package/csv) | A mature and comprehensive CSV library for NodeJS |
| [exceljs](https://www.npmjs.com/package/exceljs) | Excel workbook library implementated in NodeJS | [cross-fetch](https://www.npmjs.com/package/cross-fetch) | A platform agnostic implementation of the (fetchAPI)[https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API] | 
| [pm2](https://pm2.keymetrics.io/) | A NodeJS process manager |

# Preqrequisites

Users of this demo must have NodeJS and Yarn. If you do not wish to use yarn, you can review the `package.json` scripts and derive the associated node steps.  

# Setup

For first-time setup, users should do the following: 

1. Clone this repo locally
2. navigate to the root of this project
3. Run `yarn install`

# Running 

From the root of the directory...

1. `node start server.js` // starts the mock server
2. Open a new tab for the same directory
3. `yarn analyze` // runs an example analysis, outputting two CSV and one Excel file (you can run this multiple times as long as the server is running)
4. Kill the node process for the server when done

# Output

Once the script is run, three files will be created: 

1. `output/csv/activies.csv`
2. `output/csv/audiences.csv`
3. `output/excel/report.xlsx`

The `report.xlsx` file will have two tabs: `audiences` and `activites`. 

# Notes

- This demo shows basis API call / data storage and CSV / Excel output examples. This does not provide in-depth patterns for handling nested data objects at this time. 

# Configuration

The following is the contents of the `conf.json` file. This can be modified to fit the expected calls for another server. This pattern helps ensure that the code can be flexible for multiple users / environments / tenants. 

```JSON
{
    "request": {
        "accept": "application/vnd.adobe.target.v3+json",
        "apiKey": "abcd-1234-abcd-1234",
        "tenant": "my-tenant"
    }, 
    "env": {
        "server":"http://localhost:9000"
    }, 
    "csv": {
        "file": "report.csv"
    }, 
    "excel": {
        "creator":"Reporting Tool",
        "file":"output/excel/report.xlsx"
    }
}
```