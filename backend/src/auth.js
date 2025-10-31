require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();

const tokenverify = require("./verifyUser");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.use(express.json());

router.get("/check", tokenverify, (req, res) => {
  res.status(200).json({ user: req.user });
});

router.post("/Signup", async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: role === "ADMIN" ? "ADMIN" : "USER"
      }
    });

    const token = jwt.sign({ id: newUser.id, role: newUser.role }, process.env.TOKEN, { expiresIn: "1h" });
    return res.status(200).json({
      message: "Signup successful",
      user: { username, email, role: newUser.role },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const userData = await prisma.user.findUnique({ where: { email } });
    if (!userData) return res.status(404).json({ message: "User not found" });

    const isValid = await bcrypt.compare(password, userData.password);
    if (!isValid) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: userData.id, role: userData.role }, process.env.TOKEN, { expiresIn: "1h" });

    res.status(200).json({
      message: "Login successful",
      user: {
        id: userData.id,
        name: userData.username,
        email: userData.email,
        role: userData.role
      }, token
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server issue" });
  }
});

// UPDATED SEARCH ENDPOINT WITH HISTORY SAVING
router.post('/search', tokenverify, async (req, res) => {
  try {
    const { term } = req.body;

    if (!term) {
      return res.status(400).json({ error: 'Search term is required' });
    }

    console.log(`Searching Unsplash for: ${term}`);

    // Direct fetch to Unsplash API
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${term}&per_page=8&client_id=${process.env.UNSPLASH_ACCESS_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`);
    }

    const data = await response.json();

    // Format the response
    const images = data.results.map(photo => ({
      id: photo.id,
      url: photo.urls.regular,
      full: photo.urls.full,
      thumb: photo.urls.thumb,
      alt: photo.alt_description || 'Unsplash image',
      description: photo.description || 'No description',
      photographer: photo.user.name,
      photographerProfile: photo.user.links.html,
    }));

    console.log(`Found ${images.length} images for "${term}"`);
    console.log("req.userId", req.userId);

    if (images && req.userId) {
      try {
        await prisma.searchHistory.create({
          data: {
            searchTerm: term,
            userId: req.userId  
          }
        });
        console.log('Search saved to history for user:', req.userId);
      } catch (error) {
        console.log('Error saving search history:', error.message);
      }
    }

    res.json({
      term: term,
      total: data.total,
      images: images
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ GET USER'S PERSONAL SEARCH HISTORY
router.get('/user-history', tokenverify, async (req, res) => {
  try {
    const history = await prisma.searchHistory.findMany({
      where: { userId: req.userId },
      orderBy: { timestamp: 'desc' },
      take: 5
    });
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// TOP SEARCHES
router.get('/top-searches', (req, res) => {
  res.json([
    { term: 'Nature', count: 2 },
    { term: 'Cars', count: 2 },
    { term: 'Food', count: 2 },
    { term: 'Travel', count: 2 },
    { term: 'Animals', count: 2 }
  ]);
});

// GLOBAL SEARCH HISTORY (for demo)
router.get('/history', (req, res) => {
  res.json([
    { term: 'Mountains', timestamp: new Date().toISOString() },
    { term: 'Beaches', timestamp: new Date().toISOString() }
  ]);
});

module.exports = router;
