# Nodejs-Express-MongoDB-Mongoose-Passport-SwaggerUI
Nodejs with MongoDB, Mongoose, Passport, and Swagger-UI starter

# Getting started
To get the application running locally:

- Clone this repo
- Install and use node version 14.16.1
- Change directory to the repo
- `npm install` to install all required dependencies
- Install MongoDB Community Edition ([instructions](https://docs.mongodb.com/manual/installation/#tutorials)) and run it by executing `mongod`
- `npm start` to start the local server

## Application Structure

- `app.js` - The entry point to our application. This file defines our express server and connects it to MongoDB using mongoose. It also requires the routes and models we'll be using in the application.
- `config/` - This folder contains configuration for a central location for Swagger UI and Secrets.
- `auth/` - This folder contains configuration for Passport.js.
- `routes/` - This folder contains the route definitions for our API.
- `models/` - This folder contains the schema definitions for our Mongoose models.

## Authentication

Requests are authenticated using the Passport.js authentication middleware. 
