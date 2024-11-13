const express = require("express");
const bcrypt = require("bcryptjs")
const {v4: uuidv4} = require("uuid")
const jwt = require("jsonwebtoken") 
const cors = require("cors") 

const {open} = require("sqlite")
const sqlite3 = require("sqlite3") 
const path = require("path") 

const app = express()  
app.use(express.json())
app.use(cors())

const dbPath = path.join(__dirname, 'todo.db')
let database = null

const initilizeDBAndServer = async () => {
    try {
        database = await open({
            filename: dbPath,
            driver: sqlite3.Database
        })

        app.listen(3000, () => {
            console.log("Server Running at http://localhost:3000/")
        })

    } catch (error) {
        console.log(`DB Error: ${error.message}`)
        process.exit(1)
    }
}
initilizeDBAndServer() 

// User Registration
app.post("/register", async (request, response) => {
    const {name, email, password} = request.body 
    try {
        const checkUserQuery = `
            SELECT *
            FROM users
            WHERE email = ?
        `;
        const existingUser = await database.get(checkUserQuery, [email])

        if (existingUser){
            return response.status(400).json({message: "User Already Exists"})
        }
        
        const hashedPassword =  await bcrypt.hash(password, 10)
        const userId = uuidv4() 
        const insertUserQuery = `
            INSERT INTO users (id, name, email, password)
            VALUES (?, ?, ?, ?)            
        `;
        await database.run(insertUserQuery, [userId, name, email, hashedPassword]) 
        response.status(201).json({message: "User Created Successfully"})
    } catch (error) {
        response.status(500).json({Error: error.message})
    }
})

// User Login 
app.post("/login", async (request, response) => {
    const {email, password} = request.body 

    try {
        const getUser = `
            SELECT * 
            FROM users
            WHERE email = ?
        `;
        const user = await database.get(getUser, [email])
        if (!user){
           return response.status(400).json({message: "Invalid email or password"})
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password)
        if (!isPasswordMatch){
            return response.status(400).json({message: "Invalid credentials"})
        }
        const payload = {userId: user.id}
        const token = jwt.sign(payload, 'MY_SECRET_TOKEN')
        response.status(200).json({ token, message: "Login successful" })
    } catch (error) {
        response.status(500).json({message: error.message})
    }
}) 

// Authentication with JWT Token 
const authenticateToken = (request, response, next) => {
    let jwtToken 
    const authHeader = request.headers['authorization'] 
    if (authHeader){
        jwtToken = authHeader.split(' ')[1]
    } 

    if (!jwtToken){
        return response.status(401).json({message: "Access Denied"})
    } 
    try {
        const decodedToken = jwt.verify(jwtToken, 'MY_SECRET_TOKEN')
        request.userId = decodedToken.userId 
        next()
    } catch (error) {
        return response.status(403).json({ message: "Invalid Token" })
    }
} 

// Create a New Todo 
app.post('/add-todo', authenticateToken, async (request, response) => {
    const {title, status} = request.body 
    const {userId} = request 
    const todoId = uuidv4()
    const createdAt = new Date().toISOString() 

    try {
        const createTodoQuery = `
            INSERT INTO todos (id, user_id, title, status, created_at)
            VALUES (?, ?, ?, ?, ?)
        `
        const createdTodo = await database.run(createTodoQuery, [todoId, userId, title, status, createdAt])
        response.status(201).json({createdTodo, message: "Todo created successfully" })
    } catch (error) {
        response.status(500).json({ error: error.message })
    }
}) 

// Get All Todos for Authenticated User 
app.get('/get-todos', authenticateToken, async (request, response) => {
    const {userId} = request 

    try {
        const getTodosQuery = `
            SELECT * 
            FROM todos 
            WHERE user_id = ? 
        `;
        const todos = await database.all(getTodosQuery, [userId])
        response.status(200).json(todos)
    } catch (error) {
        response.status(500).json({ error: error.message })
    }
}) 

// Update a Todo 
app.put('/update-todo/:id', authenticateToken, async (request, response) => {
    const {id} = request.params 
    const {title, status} = request.body 
    const {userId} = request 

    try {
        const updateTodoQuery = `
            UPDATE todos 
            SET 
                title = ?,
                status = ?
            WHERE id = ? AND user_id = ? 
        `;
        const updatedTodo = await database.run(updateTodoQuery, [title, status, id, userId])
        response.status(200).json({updatedTodo, message: "Todo updated successfully" })
    } catch (error) {
        response.status(500).json({ error: error.message })
    }
}) 

// Delete a Todo 
app.delete("/todos/:id", authenticateToken, async (request, response) => {
    const { id } = request.params;
    const { userId } = request;

    try {
        const deleteTodoQuery = `
            DELETE FROM todos 
            WHERE id = ? AND user_id = ?
        `;
        await database.run(deleteTodoQuery, [id, userId]);
        response.status(200).json({ message: "Todo deleted successfully" });
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
});
