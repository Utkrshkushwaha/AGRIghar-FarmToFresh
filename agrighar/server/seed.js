// Run this once to populate demo data:
// node seed.js

const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");
const dotenv   = require("dotenv");
dotenv.config();

const User    = require("./models/User");
const Product = require("./models/Product");

const FARMERS = [
  { name: "Ramesh Kumar",  email: "farmer@demo.com",    password: "demo123", role: "farmer", phone: "+91 98765 43210", address: "Nashik, Maharashtra",    isOrganic: true,  bio: "Organic vegetable farmer with 15 years of experience." },
  { name: "Suresh Patil",  email: "suresh@demo.com",    password: "demo123", role: "farmer", phone: "+91 91234 56789", address: "Ratnagiri, Maharashtra", isOrganic: true,  bio: "Specializes in Alphonso mangoes and tropical fruits." },
  { name: "Mohan Singh",   email: "mohan@demo.com",     password: "demo123", role: "farmer", phone: "+91 99876 54321", address: "Amritsar, Punjab",       isOrganic: false, bio: "Wheat and rice farmer supplying premium grains." },
  { name: "Priya Devi",    email: "priya@demo.com",     password: "demo123", role: "farmer", phone: "+91 88765 43210", address: "Jaipur, Rajasthan",      isOrganic: true,  bio: "Grows leafy greens and seasonal vegetables." },
  { name: "Gopal Yadav",   email: "gopal@demo.com",     password: "demo123", role: "farmer", phone: "+91 77654 32109", address: "Varanasi, UP",           isOrganic: false, bio: "Dairy farmer providing fresh milk and paneer." },
  { name: "Anita Sharma",  email: "anita@demo.com",     password: "demo123", role: "farmer", phone: "+91 66543 21098", address: "Guntur, Andhra Pradesh", isOrganic: true,  bio: "Spice farmer growing chilli, turmeric and coriander." },
];

const CONSUMERS = [
  { name: "Priya Sharma",  email: "consumer@demo.com",  password: "demo123", role: "consumer", phone: "+91 91234 56789", address: "Pune, Maharashtra" },
  { name: "Amit Kumar",    email: "amit@demo.com",      password: "demo123", role: "consumer", phone: "+91 98765 11111", address: "Mumbai, Maharashtra" },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log("🗑️  Cleared existing data");

    // Create users
    const createdFarmers   = await User.create(FARMERS);
    const createdConsumers = await User.create(CONSUMERS);
    console.log(`👨‍🌾 Created ${createdFarmers.length} farmers`);
    console.log(`🛒 Created ${createdConsumers.length} consumers`);

    const [ramesh, suresh, mohan, priya, gopal, anita] = createdFarmers;

    // Create products
    const PRODUCTS = [
      { name: "Fresh Tomatoes",   category: "vegetables", price: 30,  unit: "kg",    quantity: 50,  isOrganic: true,  isAvailable: true,  farmerId: ramesh._id, farmerName: ramesh.name, description: "Fresh, juicy tomatoes grown without pesticides. Harvested daily from our organic farm in Nashik." },
      { name: "Alphonso Mangoes", category: "fruits",     price: 120, unit: "dozen", quantity: 30,  isOrganic: true,  isAvailable: true,  farmerId: suresh._id, farmerName: suresh.name, description: "Premium Alphonso mangoes from Ratnagiri. Known for their rich aroma, golden colour and sweet taste." },
      { name: "Basmati Rice",     category: "grains",     price: 80,  unit: "kg",    quantity: 200, isOrganic: false, isAvailable: true,  farmerId: mohan._id,  farmerName: mohan.name,  description: "Long grain Basmati rice from Punjab. Aged for 2 years for perfect aroma and taste." },
      { name: "Fresh Spinach",    category: "vegetables", price: 20,  unit: "kg",    quantity: 40,  isOrganic: true,  isAvailable: true,  farmerId: priya._id,  farmerName: priya.name,  description: "Tender organic spinach leaves, freshly harvested. Rich in iron and vitamins." },
      { name: "Buffalo Milk",     category: "dairy",      price: 55,  unit: "liter", quantity: 100, isOrganic: false, isAvailable: true,  farmerId: gopal._id,  farmerName: gopal.name,  description: "Fresh buffalo milk collected every morning. High fat content, perfect for making paneer and ghee." },
      { name: "Red Chilli",       category: "spices",     price: 200, unit: "kg",    quantity: 0,   isOrganic: true,  isAvailable: false, farmerId: anita._id,  farmerName: anita.name,  description: "Sun-dried red chillies from Guntur. Medium to high heat level." },
      { name: "Onions",           category: "vegetables", price: 25,  unit: "kg",    quantity: 150, isOrganic: false, isAvailable: true,  farmerId: ramesh._id, farmerName: ramesh.name, description: "Fresh red onions from Nashik farms. Crisp, pungent and perfect for everyday cooking." },
      { name: "Bananas",          category: "fruits",     price: 40,  unit: "dozen", quantity: 80,  isOrganic: true,  isAvailable: true,  farmerId: suresh._id, farmerName: suresh.name, description: "Sweet and ripe Robusta bananas. Rich in potassium and natural energy." },
      { name: "Wheat Flour",      category: "grains",     price: 45,  unit: "kg",    quantity: 300, isOrganic: false, isAvailable: true,  farmerId: mohan._id,  farmerName: mohan.name,  description: "Stone-ground whole wheat flour. Made from premium wheat. Ideal for rotis and chapatis." },
      { name: "Turmeric Powder",  category: "spices",     price: 180, unit: "kg",    quantity: 60,  isOrganic: true,  isAvailable: true,  farmerId: anita._id,  farmerName: anita.name,  description: "Pure organic turmeric powder from Erode. High curcumin content." },
      { name: "Paneer",           category: "dairy",      price: 280, unit: "kg",    quantity: 25,  isOrganic: false, isAvailable: true,  farmerId: gopal._id,  farmerName: gopal.name,  description: "Fresh homemade paneer from pure buffalo milk. Soft, creamy texture. Made fresh daily." },
      { name: "Potatoes",         category: "vegetables", price: 22,  unit: "kg",    quantity: 200, isOrganic: false, isAvailable: true,  farmerId: priya._id,  farmerName: priya.name,  description: "Fresh potatoes from Jaipur farms. Ideal for curries, fries and snacks." },
    ];

    const createdProducts = await Product.create(PRODUCTS);
    console.log(`🥦 Created ${createdProducts.length} products`);

    // Update farmer product counts
    await User.findByIdAndUpdate(ramesh._id, { productCount: 2 });
    await User.findByIdAndUpdate(suresh._id, { productCount: 2 });
    await User.findByIdAndUpdate(mohan._id,  { productCount: 2 });
    await User.findByIdAndUpdate(priya._id,  { productCount: 2 });
    await User.findByIdAndUpdate(gopal._id,  { productCount: 2 });
    await User.findByIdAndUpdate(anita._id,  { productCount: 2 });

    console.log("\n✅ Seed complete!\n");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("Demo Login Credentials:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("👨‍🌾 Farmer:   farmer@demo.com   / demo123");
    console.log("🛒 Consumer: consumer@demo.com / demo123");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
  }
}

seed();
