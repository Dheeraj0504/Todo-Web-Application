# Todo Web Application

This is a Todo Web Application built using the MERN stack. The application allows users to manage their todos with the ability to add, update, delete, and track the status of tasks. It features JWT-based authentication to ensure secure access to user data.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Screenshots](#screenshots)
- [License](#license)

## Features
- **User Authentication**: Sign up and login functionality with JWT-based token authentication.
- **Todo Management**:
  - Add, edit, and delete todos.
  - Manage task statuses: Pending, In Progress, and Completed.
- **Responsive Design**: Fully responsive design for both desktop and mobile devices.
- **Notifications**: Provides success/error notifications for actions like adding, updating, and deleting todos using React-Toastify.

## Tech Stack
- **Frontend**: React.js, Axios
- **Backend**: Node.js, Express.js
- **Database**: SQLite3 (for storing user data and todos)
- **Authentication**: JWT (JSON Web Tokens)
- **Styling**: CSS (with Bootstrap for layout)
- **Notifications**: React-Toastify

## Installation

### Backend Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/todo-web-application.git
   ```

2. Navigate to the backend directory:
   ```bash
   cd backend
   ```

3. Install the dependencies:
   ```bash
   npm install
   ```

4. Create a `.env` file in the root of the backend folder with the necessary environment variables (e.g., database connection details).

5. Run the backend server:
   ```bash
   npm start
   ```

   The server will run on `http://localhost:3000`.

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install the frontend dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```

   The frontend will run on `http://localhost:3001`.

### Configuration
- Make sure both the backend and frontend servers are running at the same time.
- The frontend relies on JWT-based authentication. After logging in or signing up, a JWT token is stored in the browser's local storage and sent with each API request to authenticate the user.

## Usage
1. Visit the app at `http://localhost:3001` in your browser.
2. **Sign Up / Log In**: Create a new account or log in with an existing account.
3. **Todo Management**:
   - Add new todos by entering a title and selecting a status.
   - Edit or delete existing todos.
   - View todos categorized by their status (Pending, In Progress, Completed).
4. **Notifications**: React-Toastify will show notifications for actions like adding, updating, or deleting todos.

## API Endpoints

### Authentication
- **POST** `/signup`: Register a new user and get a JWT token.
- **POST** `/login`: Log in and receive a JWT token.

### Todos
- **GET** `/get-todos`: Retrieve all todos for the logged-in user.
- **POST** `/add-todo`: Add a new todo. Requires authentication (JWT token).
- **PUT** `/update-todo/:id`: Update an existing todo. Requires authentication.
- **DELETE** `/todos/:id`: Delete a todo. Requires authentication.

## Screenshots

1. **Todo List Screen**:
   ![Todo List](./screenshots/todo-list.png)

2. **Add/Update Todo Form**:
   ![Add/Update Todo](./screenshots/todo-form.png)

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
