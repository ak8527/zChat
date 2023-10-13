# zChat

zChat is a web application that allows users to chat with each other in real-time. Users can create private or group chats, send files, videos, music, photos, and links.Users can also make video calls and audio calls with other users using WebRTC technology.

## Demo

You can view the demo of the app [https://zchat-production.vercel.app].

## Wireframe

You can view the wireframe of the app [https://www.figma.com/file/oQ3klru9C9aeA1ho3XOXv3/zChat?type=design&node-id=171%3A1010&mode=design&t=kA4uHSblfBXRfnn7-1](Mobile) && [https://www.figma.com/file/oQ3klru9C9aeA1ho3XOXv3/zChat?type=design&node-id=7%3A9&mode=design&t=kA4uHSblfBXRfnn7-1](Desktop).

## Technologies

The app is built using the following technologies:

- Node.js: A JavaScript runtime environment that executes JavaScript code outside a web browser.
- React.js: A JavaScript library for building user interfaces.
- WebSocket: A protocol that enables two-way communication between a client and a server over a single TCP connection.
- WebRTC: A set of APIs that enable real-time communication of audio, video, and data in web browsers and native apps.
- MongoDB: A cross-platform document-oriented database program that uses JSON-like documents with optional schemas.

## Libraries

The app uses the following libraries:

### Client side

- @reduxjs/toolkit: A library that provides tools for managing application state with Redux.
- axios: A library that provides a promise-based HTTP client for the browser and node.js.
- react-modal: A library that provides accessible modal dialog components for React.
- react-redux: A library that provides React bindings for Redux.
- react-router-dom: A library that provides declarative routing for React web applications.
- react-scripts: A set of scripts and configuration used by Create React App.
- yup: A library that provides schema validation for JavaScript objects.

### Server side

- bcrypt: A library that provides password hashing and salting functions.
- cheerio: A library that implements a subset of core jQuery for server-side DOM manipulation.
- cookie-parser: A middleware that parses cookie headers and populates req.cookies with an object keyed by the cookie names.
- dotenv: A library that loads environment variables from a .env file into process.env.
- ejs: A templating engine that generates HTML from JavaScript code.
- express: A web framework for node.js that provides features for web and mobile applications.
- firebase-admin: A library that provides the Firebase Admin SDK to access Firebase services from privileged environments.
- joi: A library that provides schema validation for JavaScript objects.
- jsonwebtoken: A library that implements JSON Web Tokens (JWT) for secure authentication and authorization.
- mongoose: An object data modeling (ODM) library for MongoDB and node.js that provides schema validation, query building, and business logic hooks.
- nodemailer: A library that enables email sending from node.js applications.
- npmlog: A logger with custom levels and colored output for node.js applications.
- ws: A library that provides a WebSocket client and server implementation for node.js.

## Installation

To install and run the app locally, follow these steps:

1. Clone this repository to your local machine using `git clone https://github.com/yourusername/zChat.git`.
2. Navigate to the project folder using `cd zChat`.
3. Install the dependencies using `npm install`.
4. Create a .env file in the root folder of your server side project and add the following environment variables:

   - PORT: The port number for the server to listen on.
   - MONGODB_URL: The connection string for MongoDB.
   - ACCESS_TOKEN_PRIVATE_KEY: The secret key for signing access tokens.
   - REFRESH_TOKEN_PRIVATE_KEY: The secret key for signing refresh tokens.
   - CLIENT_URL: The URL of your client side application.
   - EMAIL_TOKEN_PRIVATE_KEY: The secret key for signing email tokens.
   - EMAIL_HOST: The host name of your email service provider.
   - EMAIL_PORT: The port number of your email service provider.
   - EMAIL_USER: The user name of your email account.
   - EMAIL_PASSWORD: The password of your email account (e.g. mypassword).
   - BUCKET_NAME: The name of your Firebase storage bucket.

5. Start the server using `npm start`.
6. Open another terminal window and navigate to the client folder using `cd client`.
7. Create a .env file in the root folder of your client side project and add the following environment variables:

   - REACT_APP_FIREBASE_DOWNLOAD_BASE_URL: The base URL of your Firebase storage download.
   - REACT_APP_SERVER_URL: The URL of your server side API.
   - REACT_APP_WEBSOCKET_URL: The URL of your WebSocket connection.
   - REACT_APP_STUN_URL: The URL of your STUN server for WebRTC.
   - REACT_APP_TURN_URL: The URL of your TURN server for WebRTC.
   - REACT_APP_TURN_USERNAME: The user name of your TURN server for WebRTC.
   - REACT_APP_TURN_CREDENTIAL: The credential of your TURN server for WebRTC.

8. Install the dependencies using `npm install`.
9. Start the client using `npm start`.
10. Open your browser and go to `http://localhost:3000` to view the app.
