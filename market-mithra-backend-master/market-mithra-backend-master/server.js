const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");
const cheerio = require("cheerio");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Atlas Connected"))
.catch((err) => console.error("❌ MongoDB Error:", err));

// Spice data storage
const spiceData = {
  pepper: { name: "Asteroid", history: [] },
  cardamom: { name: "Lunar Vehicles", history: [] },
  clove: { name: "Space Suits", history: [] },
  nutmeg: { name: "Lunar Particles", history: [] },
  cinnamon: { name: "Space Technology", history: [] },
  vanilla: { name: "Astronaut autographs", history: [] }
};

// Manual price update function
function updateSpicePrice(spice, price) {
  if (!spiceData[spice]) {
    throw new Error(`Space Commodity:  '${spice}' not found`);
  }
  
  const lastEntry = spiceData[spice].history.slice(-1)[0];
  const prevClose = lastEntry ? lastEntry.close : price;
  
  // Generate realistic OHLC based on new price
  const volatility = 0.01;
  const open = prevClose;
  const close = price;
  const high = Math.max(open, close) * (1 + Math.random() * volatility);
  const low = Math.min(open, close) * (1 - Math.random() * volatility);

  const ohlc = {
    timestamp: new Date(),
    open: +open.toFixed(2),
    high: +high.toFixed(2),
    low: +low.toFixed(2),
    close: +close.toFixed(2)
  };

  spiceData[spice].history.push(ohlc);
  
  // Keep only last 30 days
  if (spiceData[spice].history.length > 30) {
    spiceData[spice].history.shift();
  }
  
  console.log(`✅ Updated ${spice} price to ₹${price}`);
  return ohlc;
}

// Initialize with historical data
function initializeData() {
  console.log("🚀 Initializing space bid items data...");
  
  // Current market prices (manually set)
  const currentPrices = { 
    pepper: 8500, 
    cardamom: 24000, 
    clove: 90000, 
    nutmeg: 60000, 
    cinnamon: 50000,
    vanilla: 350000
  };
  
  // Generate 7 days of historical data
  Object.keys(currentPrices).forEach(spice => {
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const basePrice = currentPrices[spice];
      const variation = (Math.random() - 0.5) * 0.1;
      const close = +(basePrice * (1 + variation)).toFixed(2);
      const open = +(close * (0.98 + Math.random() * 0.04)).toFixed(2);
      const high = +(Math.max(open, close) * (1 + Math.random() * 0.02)).toFixed(2);
      const low = +(Math.min(open, close) * (1 - Math.random() * 0.02)).toFixed(2);
      
      spiceData[spice].history.push({ timestamp: date, open, high, low, close });
    }
  });
  
  console.log("✅ Historical data initialized");
}

// Initialize data on startup
initializeData();

// In-memory storage
let users = [];
let listings = [
  {
    id: 1,
    spice: "asteroid",
    price: 240000,
    quantity: 1 ,
    farmer: "Tomas Jacob",
    location: "India",
    phone: "+91 9876543210",
    createdAt: new Date()
  },
  {
    id: 2,
    spice: "Lunar Vehicle",
    price: 850000,
    quantity: 50,
    farmer: "Rajendar Sikandar",
    location: "America",
    phone: "+91 9876543211",
    createdAt: new Date()
  }
];

// API endpoints
app.get("/api/spices/:name/ohlc", (req, res) => {
  const spice = req.params.name.toLowerCase();
  if (!spiceData[spice]) return res.status(404).json({ error: "Item not found" });
  res.json(spiceData[spice].history);
});

app.get("/api/spices", (req, res) => {
  const summary = Object.keys(spiceData).map(spice => {
    const history = spiceData[spice].history;
    const latest = history.slice(-1)[0];
    const previous = history.slice(-2, -1)[0];
    const change = previous ? ((latest.close - previous.close) / previous.close * 100) : 0;
    
    return {
      name: spice,
      displayName: spiceData[spice].name,
      current: latest,
      change: +change.toFixed(2),
      dataPoints: history.length
    };
  });
  res.json(summary);
});

// Farmer listings endpoints
app.get("/api/listings", (req, res) => {
  res.json(listings);
});

app.post("/api/listings", (req, res) => {
  const { spice, price, quantity, userId } = req.body;
  
  // Get user details
  const user = users.find(u => u.id === userId);
  if (!user) {
    return res.status(401).json({ error: "User not found" });
  }
  
  const newListing = {
    id: listings.length + 1,
    spice,
    price: parseFloat(price),
    quantity: parseFloat(quantity),
    farmer: user.name,
    location: user.district,
    phone: user.phone,
    userId: user.id,
    createdAt: new Date()
  };
  
  listings.push(newListing);
  res.status(201).json(newListing);
});

// Admin endpoints for manual price updates
app.post("/api/admin/update-price", (req, res) => {
  try {
    const { spice, price } = req.body;
    
    if (!spice || !price) {
      return res.status(400).json({ error: "Space Commodity and price are required" });
    }
    
    if (!spiceData[spice]) {
      return res.status(404).json({ error: "Item not found" });
    }
    
    const ohlc = updateSpicePrice(spice, parseFloat(price));
    res.json({ message: `${spice} price updated`, data: ohlc });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/admin/bulk-update", (req, res) => {
  try {
    const { prices } = req.body;
    
    if (!prices || typeof prices !== 'object') {
      return res.status(400).json({ error: "Prices object is required" });
    }
    
    const results = {};
    Object.keys(prices).forEach(spice => {
      if (spiceData[spice]) {
        results[spice] = updateSpicePrice(spice, parseFloat(prices[spice]));
      }
    });
    
    res.json({ message: "Bulk price update completed", data: results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Authentication endpoints
app.post("/api/auth/signup", (req, res) => {
  try {
    const { name, phone, district, password } = req.body;
    
    if (!name || !phone || !district || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
    
    const existingUser = users.find(u => u.phone === phone);
    if (existingUser) {
      return res.status(400).json({ error: "Phone number already registered" });
    }
    
    const user = {
      id: users.length + 1,
      name,
      phone,
      district,
      password, // In production, hash this
      createdAt: new Date()
    };
    
    users.push(user);
    
    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json({ user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/auth/login", (req, res) => {
  try {
    const { phone, password } = req.body;
    
    const user = users.find(u => u.phone === phone && u.password === password);
    if (!user) {
      return res.status(401).json({ error: "Invalid phone or password" });
    }
    
    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/auth/profile", (req, res) => {
  try {
    const { userId, name, phone, district } = req.body;
    
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({ error: "User not found" });
    }
    
    users[userIndex] = { ...users[userIndex], name, phone, district };
    const { password: _, ...userWithoutPassword } = users[userIndex];
    
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/", (req, res) => {
  res.json({
    message: "Galactic Gate",
    status: "Active - Manual Price Updates",
    endpoints: {
      spices: "/api/spices",
      ohlc: "/api/spices/:name/ohlc",
      listings: "/api/listings",
      admin: {
        updatePrice: "POST /api/admin/update-price",
        bulkUpdate: "POST /api/admin/bulk-update"
      }
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
 