require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("MONGO_URI is not set in environment variables");
  process.exit(1);
}

async function fixCreatedAt() {
  await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("Connected to MongoDB");

  const users = await User.find({ "vault.createdAt": { $exists: false } });
  let updatedUsers = 0;
  for (const user of users) {
    let updated = false;
    for (let entry of user.vault) {
      if (!entry.createdAt) {
        entry.createdAt = new Date();
        updated = true;
      }
    }
    if (updated) {
      await user.save();
      updatedUsers++;
      console.log(`Updated user ${user.email}`);
    }
  }
  console.log(`Done. Updated ${updatedUsers} users.`);
  mongoose.disconnect();
}

fixCreatedAt().catch((err) => {
  console.error("Error updating credentials:", err);
  mongoose.disconnect();
});
