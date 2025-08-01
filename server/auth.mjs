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

    router.post(async(req, res) => {
        
    })