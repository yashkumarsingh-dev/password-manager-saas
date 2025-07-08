const mongoose = require("mongoose");

const vaultEntrySchema = new mongoose.Schema({
  site: { type: String, required: true },
  username: { type: String, required: true },
  encryptedPassword: { type: String, required: true },
  category: { type: String, required: true },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // bcrypt hashed
  twoFactorSecret: { type: String }, // TOTP secret
  vault: [vaultEntrySchema],
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  // Subscription fields
  isPro: { type: Boolean, default: false },
  razorpayCustomerId: { type: String },
  subscriptionStatus: {
    type: String,
    enum: ["inactive", "active", "cancelled"],
    default: "inactive",
  },
});

module.exports = mongoose.model("User", userSchema);
