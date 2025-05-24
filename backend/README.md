## Basics of Nodejs

after initializing nodejs, install some basic packages

1. express = express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.
   "npm i express"

2. nodemon = nodemon is a tool that helps develop nodejs applications by automatically restarting the node process during file changes.
   "npm i nodemon"

3. dotenv = dotenv is a zero-dependency module that loads environment variables from a .env file into process.env.
   "npm i dotenv"

4. cors = cors is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.
   "npm i cors"

## IMPORTANT

=> in package.json add "type": "module" to use ES6 modules (import and export keywords)
=> in package.json add "scripts": { "start": "nodemon index.js" }
=> add app.use(express.json()); at the top of the file (index.js) to enable json parsing in post requests

## To run the server

    "npm run start

--> import dotenv in entry file (index.js)
add "dotenv.config()" at the top of the file (index.js)
this will load environment variables from a .env file into process.env
(GOOD PRACTICE)

--> Defining CORS is a good practice
import cors in entry file (index.js)
add "app.use(cors());" at the top of the file (index.js)
exmple: '''app.use(
cors({
origin: "http://localhost:3000",
methods: ["GET", "POST"],
allowedHeaders: ["Content-Type"],
})
);'''

## MONGOOSE

1. npm i mongoose
