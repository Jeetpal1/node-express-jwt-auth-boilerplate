# Node.js Express JWT Authentication Boilerplate

This repository serves as a comprehensive boilerplate for building secure web applications using Node.js, Express, JWT (JSON Web Token) for authentication, and MongoDB for data storage. Designed with beginner developers in mind, this tutorial-style boilerplate aims to demystify the concepts of web authentication and provide a solid foundation for extending and building upon.

## Introduction

In modern web development, securing routes and protecting user data is paramount. This boilerplate introduces you to implementing JWT-based authentication in an Express application, interfaced with a MongoDB database. It's structured to be beginner-friendly yet detailed enough to offer insights valuable to experienced developers. The main goal is to equip you with the tools and knowledge to set up authentication from scratch and understand the underlying principles.

## Features

- **Express Framework**: Leverages Express for its minimalism and flexibility in building web applications.
- **JWT Authentication**: Utilizes JWT for secure and stateless authentication.
- **MongoDB Integration**: Incorporates MongoDB, a NoSQL database, to store user data.
- **Mongoose ODM**: Utilizes Mongoose for schema definition, data validation, and query building.
- **Password Hashing**: Implements bcrypt for secure password hashing.
- **Environment Variables**: Uses dotenv for managing environment variables, enhancing security and configurability.
- **Error Handling**: Basic error handling to guide development and debugging.

## Getting Started

Follow these steps to clone the boilerplate, set up your environment, and run the application.

### Prerequisites

- Node.js installed on your machine.
- MongoDB instance, local or remote (e.g., MongoDB Atlas).

### Setup Instructions

1.  **Clone the Repository**

    Clone this repository to your local machine to get started.

    ```bash
    git clone https://github.com/jeetpal1/node-express-jwt-auth-boilerplate.git
    cd node-express-jwt-auth-boilerplate
    ```

2.  **Install Dependencies**

    Install the required npm packages.

    ```bash
    npm install
    ```

3.  **Configure Environment**

    Create a `.env` file in the root directory. Add your MongoDB URI and a secret for JWT.

    ```env
    MONGODB_URI=your_mongodb_uri
    JWT_SECRET=your_jwt_secret
    REFRESH_TOKEN_SECRET=your_refresh_token
    ```

    Please Note: To create secrets for the JWT_SECRET and REFRESH_TOKEN_SECRET env. variables, you can use `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

4.  **Start the Server**

    Run the application.

    ```bash
    npm start
    ```

    Your server will start, typically on port 3000.

## Application Structure

- **`app.js`**: The entry point of the application. Sets up the Express server, middleware, and routes.
- **`/routes/userRoutes.js`**: Defines the authentication routes for sign-up and sign-in.
- **`/models/userModel.js`**: Mongoose schema and model for User.
- **`.env`**: Environment variables for MongoDB connection and JWT secret.

## Tutorial Overview

This boilerplate includes two main functionalities: user registration (`sign-up`) and user authentication (`sign-in`). Upon successful authentication, a JWT is generated, allowing access to protected routes.

### Understanding JWT

JWT is an open standard (RFC 7519) that defines a compact way of securely transmitting information between parties as a JSON object. This information can be verified and trusted because it is digitally signed.

### Sign-Up and Sign-In Workflows

- **Sign-Up**: The user provides an email and password. The password is hashed and stored in MongoDB along with the email.
- **Sign-In**: The user submits their credentials. If the credentials match, a JWT token is generated and returned, granting access to protected routes.

## For Noobs

This boilerplate demonstrates:

- Proficiency in setting up a Node.js application with Express.
- Understanding of user authentication flows and JWT token management.
- Ability to integrate and use MongoDB with Mongoose for data storage and retrieval.
- Best practices in security, such as environment variable management and password hashing.
- Clear and maintainable code structure, suitable for building upon in larger projects.

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](#).

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Screenshots of the working routes
Sign-up Endpoint:

Method: POST
URL: http://localhost:port/sign-up
Body (JSON): `{
  "email": "example@example.com",
  "password": "yourpassword"
}`
![image](https://github.com/Jeetpal1/node-express-jwt-auth-boilerplate/assets/70360391/d561e37a-7879-4e82-b3dd-65719d5d4b75)

Sign-in Endpoint:

Method: POST
URL: http://localhost:port/sign-in
Body (JSON):`
{
  "email": "example@example.com",
  "password": "yourpassword"
}`
![image](https://github.com/Jeetpal1/node-express-jwt-auth-boilerplate/assets/70360391/38402a86-a6ad-4b5d-b620-a09ffec865da)

Reset Password Endpoint:

Method: POST
URL: http://localhost:port/reset-password
Body (JSON):`
{
  "email": "example@example.com"
}`
![image](https://github.com/Jeetpal1/node-express-jwt-auth-boilerplate/assets/70360391/ee9b6ec1-0d10-41da-80bd-daefb53024fb)



## Acknowledgments

- Express.js Team for their incredible framework.
- MongoDB for their powerful database solution.
- The Node.js community for continuous support and contributions.

---

Built with ❤️ by [Jeetpal Singh](https://www.jeetpalsingh.com/)
