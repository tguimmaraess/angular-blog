import bodyParser from "body-parser";

//Body parser
const json = bodyParser.json({limit: "50mb"});
const urlencoded = bodyParser.urlencoded({extended : true});

export {json, urlencoded};
