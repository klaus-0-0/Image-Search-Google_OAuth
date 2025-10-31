const express = require('express');
const cors = require('cors');
const authRoutes = require("./auth"); // your existing auth routes
const { passport, session } = require("./googleAuth"); // google OAuth
require('dotenv').config();
const config = require("./config")
const app = express();

// Middleware 
app.use(cors({
    origin: `${config.apiurl}`,
    credentials: true
}));
app.use(express.json());

// Session middleware (for Google OAuth)
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use("/api", authRoutes);

// Google OAuth Routes
app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: `${config.apiurl}/signup`,
        session: false // No session needed when using JWT
    }),
    (req, res) => {
        // Redirect with JWT token in URL
        const token = req.user.token;
        // res.redirect(`http://localhost:5173/home?token=${token}`);
        res.redirect(`${config.apiurl}/home?token=${token}`);
    }
);

// Check Google auth status
app.get('/auth/user', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({
            user: req.user,
            isAuthenticated: true
        });
    } else {
        res.json({
            user: null,
            isAuthenticated: false
        });
    }
});

// Google logout
app.get('/auth/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.json({ message: 'Logged out successfully' });
    });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🔐 OAuth Ready!`);
});