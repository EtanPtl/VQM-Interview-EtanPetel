import express from "express";
import pool from "./db.mjs";
import bcyrpt from "bcrypt";

const router = express.Router();

// Using the router we can connect auth to the express server made in server.js
router
    .route("/Login")
    .get(async(req, res) => {
        // user only logs in if they exist 
        if (req.session.user && req.session.user.username){
            res.json({ loggedIn: true, username: req.session.user.username});
        } else {
            res.json({loggedIn: false});
        }
    })
    .post(async(req,res) => {
        try {
            // check if potential login exists in database
            const potentialLogin = await pool.query("SELECT id, username, passhash FROM users WHERE users.username=$1", [req.body.username]);
            if (potentialLogin.rowCount > 0) {
                const isCorrectPass = await bcyrpt.compare(
                    req.body.password,
                    potentialLogin.rows[0].passhash
                )
                // Checking if the password they sent is correctusing bcrypt.compare since only hashed passwords are stored for security

                // log in the user only if they have the correct username and password
                if (isCorrectPass) {
                    req.session.user = {
                        username: req.body.username,
                        id: potentialLogin.rows[0].id
                    };
                    res.json({loggedIn:true, username: req.body.username});
                } else {
                    // Tell user something is wrong but don't let them know exactly for security
                    res.json({loggedIn: false, status: "Wrong username or password"});
                }
            } else {
                res.json({loggedIn: false, status: "Wrong username or password"});
            };
            
        } catch (error) {
            console.log(error.message);
        }
    });

    router.post("/SignUp", async(req, res) => {
        try {
            // Check if user already exists (no overlapping users)
            const existingUser = await pool.query("SELECT FROM users WHERE username = $1", [req.body.username]);
            if (existingUser.rowCount == 0) {
                // User does not exist, create new user
                // Make hashpassword since we want to only store hashed passwords in the database
                const hashedPass = await bcyrpt.hash(req.body.password, 10);
                const newUserQuery = await pool.query("INSERT INTO users(username, passhash) VALUES ($1, $2) RETURNING username", [req.body.username, hashedPass]);
                // Update the session for persistence
                req.session.user = {
                    username: req.body.username,
                    id: newUserQuery.rows[0].id
                };
                res.json({loggedIn: true, username: req.body.username})
            } else {
                // SignUp failed user exists, don't create new user
                // Let user know the username is taken 
                res.json({loggedIn: false, status:"Username Taken"})
            };
        } catch (error) {
            console.log(error.message);
        };
    });

    export default router;