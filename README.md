# GDG Node.js Course: Blogging Website Backend

Welcome to the **GDG Node.js Course: Blogging Website Backend**! This project is a mini-project designed for Node.js beginners to help you understand the fundamentals of building a backend for a blogging website. Below, you'll find an overview of the project structure, key concepts, and instructions to get started.

---

## Table of Contents
1. [Setting Up](#setting-up)
2. [Key Concepts](#key-concepts)
   - [Prettier](#prettier)
   - [ESLint](#eslint)
   - [Express](#express)
   - [Routes](#routes)
   - [Middleware](#middleware)
   - [Controller](#controller)
   - [Services](#services)
   - [Utils](#utils)
3. [Project Structure](#project-structure)
4. [Installation](#installation)
5. [Running the Project](#running-the-project)
6. [Contributing](#contributing)

---

## Setting Up

### `.env` File
Create a `.env` file in the root of your project to store environment variables. For this project, you'll need to define a `PORT` number for the server to listen on.

Example `.env` file:
```env
PORT=3000                       # Port number for the server to listen on
JWT_SECRET=your-secret-here     # Secret key for JWT authentication
TOKEN_EXPIRE_IN=1h              # Expiration time for the JWT token (adjust as needed)
GOOGLE_CLIENT_ID=                # Your Google OAuth client ID
GOOGLE_CLIENT_SECRET=            # Your Google OAuth client secret
MONGO_URI=                       # Connection string for your MongoDB database
BASE_URL=                        # Base URL for your application (e.g., http://localhost:3000)
EMAIL_USER=                      # Email address for sending emails
EMAIL_PASS=                      # Password for the email account
```

---

## Key Concepts

### Prettier
Prettier is a code formatting tool that ensures your code is consistently styled. It automatically formats your code according to predefined rules, making it easier to read and maintain.

### ESLint
ESLint is a static code analysis tool that helps identify and fix problems in your JavaScript/TypeScript code. It enforces coding standards and best practices, ensuring your code is clean and error-free.

### Express
Express is a popular Node.js framework for building web applications and APIs. It simplifies the process of handling HTTP requests, routing, and middleware integration.

### Routes
Routes define the endpoints of your application. They map HTTP methods (GET, POST, PUT, DELETE) to specific functions that handle requests and send responses.

### Middleware
Middleware are functions that execute during the request-response cycle. They can modify request/response objects, perform authentication, log requests, or handle errors.

### Controller
Controllers are functions that handle the logic for specific routes. They process incoming requests, interact with services, and send responses back to the client.

### Services
Services contain the business logic of your application. They handle tasks like database operations, data validation, and external API calls.

### Utils
Utils (utilities) are helper functions or modules that provide reusable functionality across your application, such as formatting dates, generating IDs, or validating data.

---

## Project Structure

```
.
.
├── app.js                        # Entry point of the application
├── package.json                  # Project metadata and dependencies
├── package-lock.json             # npm lockfile for dependency management
├── README.md                     # Project documentation
├── .gitignore                    # Specifies files and directories to be ignored by Git
└── src                           # Source code directory
    ├── config                    # Configuration files
    │   └── db.js                 # Database connection setup
    ├── middleware                # Custom middleware functions
    │   ├── authMiddleware.js       # Middleware for authentication
    │   ├── errorMiddleware.js      # Middleware for error handling
    │   └── validationMiddleware.js # Middleware for request validation
    ├── controllers                 # Controllers for handling route logic
    │   ├── authController.js       # Logic for user authentication
    │   ├── blogController.js       # Logic for managing blog posts
    │   └── profileController.js    # Logic for user profiles
    ├── models                      # Database models
    │   ├── BlogPost.js             # Blog post model
    │   ├── PasswordResetToken.js   # Password reset token model
    │   └── User.js                 # User model
    ├── routes                    # Route definitions
    │   ├── authRoutes.js         # Routes for authentication
    │   ├── blogRoutes.js         # Routes for blog posts
    │   └── profileRoutes.js      # Routes for user profiles
    ├── services                  # Business logic and service layer
    │   ├── generateToken.js      # Token generation logic
    │   ├── sendEmail.js          # Email sending logic
    │   └── tokenService.js       # Token management services
    └── utils                     # Utility functions and helpers
        └── customError.js        # Custom error handling utility    
```

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/mosisafeyissa/GDG_Node.js_Team_Capstone_Blog_Web.git
   cd GDG_Node.js_Team_Capstone_Blog_Web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the `.env` file as described in the [Setting Up](#setting-up) section.

---

## Running the Project

To start the development server, run:
```bash
npm run dev
```

The server will start on the port specified in your `.env` file (default: `3000`). You can access the API at `http://localhost:3000`.

---

## Contributing

Contributions are welcome! If you'd like to contribute to this project, please follow these steps:
1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes and push to your branch.
4. Submit a pull request with a detailed description of your changes.

---

## API Endpoints

Here are the list of endpoints being implemented in this project:

- **POST ```/api/auth/register```**: (Request-body: none { email, username, password }) -- Register a user.
- **POST ```/api/auth/login```**: (Request-body: { email, password }) -- Log in.
- **GET ```/posts/```**: (Request-body: none) -- Fetch all blog posts.
- **GET ```/posts/:id```**:(Request-body: none) Fetch a single blog post by ID.
- **POST ```/posts```**: (Request-body: { title, content, category(optional) }) Create a new blog post.
- **PUT ```/posts/:id```**: (Request-body: { title, content, category }) Update an existing blog post.
- **DELETE ```/posts/:id```**: (Request-body: none) Delete a blog post.
- **POST ```/api/auth/logout```**: (Request-body: None (JWT in header)) -- Log out a user
- **POST ```/api/auth/reset-password/request```**: (Request-body: { email }) -- Request password reset
- **POST ```/api/auth/reset-password```**: (Request-body: { token, newPassword }) -- Reset password
- **POST ```/api/auth/google```: (Request-body: { accessToken }) -- Third-party login (Google)
- **GET ```/api/profile```: (Request-body: None (JWT in header)) -- Get user profile
- **PUT ```/api/profile```:(Request-body: { username , email}) -- Update user profile

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Happy coding! 🚀
