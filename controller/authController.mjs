import bcrypt from "bcrypt";
import fs from "fs";
import path from 'path';

const usersPath = path.resolve('data', 'users.json');


const readUsers = () => {
    try {
        const data = fs.readFileSync(usersPath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

const writeUsers = (users) => {
    fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
};

/* export const handleRegister = async (req, res) => {
    const { username, password } = req.body;
    
    // Input validation
    if (!username || !password) {
        return res.status(400).send("Username and password are required");
    }

    const users = readUsers();
    
    // Check if user already exists
    if (users.some(u => u.username === username)) {
        return res.status(409).send("Username already exists");
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        users.push({ username, password: hashedPassword });
        writeUsers(users);
        
        res.status(201).send("Registration successful!");
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).send("Registration failed");
    }
}; */

export const handleLogin = async (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).send("Username and password are required");
    }

    const users = readUsers();
    const user = users.find(u => u.username === username);

    if (!user) {
        // Don't reveal whether username exists for security
        return res.status(401).send("Invalid credentials");
    }

    try {
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).send("Invalid credentials");
        }

        req.session.user = user;
        res.redirect("/admin");
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).send("Login failed");
    }
};

export const handleLogout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error("Logout error:", err);
            return res.status(500).send("Logout failed");
        }
        res.redirect("/");
    });
};

