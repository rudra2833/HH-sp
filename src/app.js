//here in we use to have lesser things in index.js 
//we use to store and import every thing in this file

//THIS FILE IS USED FOR EXPRESS USE
import express from "express"
import bodyParser from "body-parser";
// import cors from "cors";
// import cookieParser from "cookie-parser";

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(express.static("public"));


// Add a MIME type for JavaScript files
express.static.mime.define({ 'application/javascript': ['js'] });

// app.use(cors({
//     origin: process.env.CORS_ORIGIN,
//     credentials: true
// }))

app.use(express.json({ limit: "20kb" }))

app.use(express.urlencoded({ extended: true, limit: "20kb" }))


export { app }




// BELOW ARE USED IN index.js
// import express from "express";
// import path from "path";
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';
//importing body-parser
// const __dirname = dirname(fileURLToPath(import.meta.url));
// // Serve static files from the 'public' directory
// app.use(express.static(path.join(__dirname, "public")));