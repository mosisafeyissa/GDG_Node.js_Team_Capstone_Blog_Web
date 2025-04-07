# GDG Node.js Course: Blogging Website Backend

Welcome to the **GDG Node.js Course**! This project is a mini-project designed for Node.js beginners to help you understand the fundamentals of building a backend for a blogging website. Below, you'll find an overview of the project structure, key concepts, and instructions to get started.

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
PORT=3000
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
├── .prettierrc           # Prettier configuration
├── eslint.config.js      # ESLint configuration
├── index.js              # Entry point of the application
├── jsconfig.json         # JavaScript configuration
├── package.json          # Project metadata and dependencies
├── package-lock.json     # npm lockfile for dependency management
├── README.md             # Project documentation
└── src                   # Source code directory
    ├── middleware        # Custom middleware functions
    │   └── index.js      # Main middleware file
    ├── controllers       # Controllers for handling route logic
    │   └── index.js      # Main controller file
    ├── models            # Database models
    │   └── index.js      # Main model file
    ├── routes            # Route definitions
    │   └── index.js      # Main route file
    ├── services          # Business logic and service layer
    │   └── index.js      # Main service file
    └── utils             # Utility functions and helpers
        └── logger.js     # Logger utility
```

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/gdg-nodejs-course.git
   cd gdg-nodejs-course
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

## Example API Endpoints

Here are some example endpoints you might implement in this project:

- **GET /posts**: Fetch all blog posts.
- **GET /posts/:id**: Fetch a single blog post by ID.
- **POST /posts**: Create a new blog post.
- **PUT /posts/:id**: Update an existing blog post.
- **DELETE /posts/:id**: Delete a blog post.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Happy coding! 🚀
