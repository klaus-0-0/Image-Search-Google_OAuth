const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const { PrismaClient } = require('@prisma/client');
const jwt = require("jsonwebtoken")
const prisma = new PrismaClient();

// Configure Passport with Database
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://image-search-google-o-auth.vercel.app/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        console.log('Google profile received:', profile.id);
        
        // Check if user exists by Google ID or email
        let user = await prisma.user.findFirst({
            where: {
                OR: [
                    { googleId: profile.id },
                    { email: profile.emails[0].value }
                ]
            }
        });

        let token;

        if (!user) {
            // Create new user in database
            user = await prisma.user.create({
                data: {
                    username: profile.displayName,
                    email: profile.emails[0].value,
                    googleId: profile.id,
                    avatar: profile.photos[0]?.value || null,
                }
            });

            console.log('New Google user created:', user.username);

        } else if (!user.googleId) {
            // Update existing user with Google ID
            user = await prisma.user.update({
                where: { id: user.id },
                data: { googleId: profile.id }
            });

            console.log('Existing user updated with Google ID:', user.username);
        } else {
            console.log('Returning Google user:', user.username);
        }

        // Generate JWT token for all cases
        token = jwt.sign({
            id: user.id, 
            username: user.username, 
            email: user.email,
        }, process.env.TOKEN, { expiresIn: "1h" });

        // Attach token to user object
        user.token = token;
        return done(null, user);

    } catch (error) {
        console.error('Google OAuth error:', error);
        return done(error, null);
    }
}));

// Serialize user (store user ID in session)
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user (get user from database using ID)
passport.deserializeUser(async (id, done) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: id }
        });
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

// Add this function to save search history
const saveSearchHistory = async (userId, searchTerm) => {
    try {
        await prisma.searchHistory.create({
            data: {
                searchTerm: searchTerm,
                userId: userId
            }
        });
        console.log('Search saved to history for user:', userId);
    } catch (error) {
        console.error('Failed to save search history:', error);
    }
};

module.exports = { passport, session, saveSearchHistory };
