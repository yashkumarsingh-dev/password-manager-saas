const User = require("../models/User");
const { encrypt, decrypt } = require("../utils/encryption");
const { Parser } = require("json2csv");
const PDFDocument = require("pdfkit");

exports.addCredential = async (req, res) => {
  try {
    const { site, username, password, category, notes } = req.body;
    const userId = req.user._id;

    const encryptedPassword = encrypt(password);

    const user = await User.findById(userId);
    // console.log("isPro:", user.isPro, "vault length:", user.vault.length);
    // Enforce Free plan limit
    if (!user.isPro && user.vault.length >= 10) {
      return res.status(403).json({
        error:
          "Free plan limit reached. Upgrade to Pro for unlimited passwords.",
      });
    }
    user.vault.push({
      site,
      username,
      encryptedPassword,
      category,
      notes,
      createdAt: new Date(),
    });
    await user.save();

    res.status(201).json({ message: "Credential added successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to add credential", details: err.message });
  }
};

exports.listCredentials = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    const vault = user.vault.map((entry) => ({
      _id: entry._id,
      site: entry.site,
      username: entry.username,
      password: decrypt(entry.encryptedPassword),
      category: entry.category,
      notes: entry.notes,
      createdAt: entry.createdAt,
    }));

    res.json({ vault });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch vault", details: err.message });
  }
};

exports.editCredential = async (req, res) => {
  try {
    const { id } = req.params;
    const { site, username, password, category, notes } = req.body;
    const userId = req.user._id;

    const encryptedPassword = encrypt(password);

    const user = await User.findById(userId);
    const credentialIndex = user.vault.findIndex(
      (entry) => entry._id.toString() === id
    );

    if (credentialIndex === -1) {
      return res.status(404).json({ error: "Credential not found" });
    }

    user.vault[credentialIndex] = {
      ...user.vault[credentialIndex],
      site,
      username,
      encryptedPassword,
      category,
      notes,
    };

    await user.save();
    res.json({ message: "Credential updated successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to update credential", details: err.message });
  }
};

exports.deleteCredential = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const user = await User.findById(userId);
    const credentialIndex = user.vault.findIndex(
      (entry) => entry._id.toString() === id
    );

    if (credentialIndex === -1) {
      return res.status(404).json({ error: "Credential not found" });
    }

    user.vault.splice(credentialIndex, 1);
    await user.save();

    res.json({ message: "Credential deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to delete credential", details: err.message });
  }
};

exports.exportCSV = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    const vault = user.vault.map((entry) => ({
      site: entry.site,
      username: entry.username,
      password: decrypt(entry.encryptedPassword),
      category: entry.category,
      notes: entry.notes,
    }));
    const parser = new Parser();
    const csv = parser.parse(vault);
    res.header("Content-Type", "text/csv");
    res.attachment("vault.csv");
    return res.send(csv);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to export CSV", details: err.message });
  }
};

exports.exportPDF = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    const vault = user.vault.map((entry) => ({
      site: entry.site,
      username: entry.username,
      password: decrypt(entry.encryptedPassword),
      category: entry.category,
      notes: entry.notes,
    }));
    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="vault.pdf"');
    doc.pipe(res);
    doc.fontSize(18).text("Your Vault", { align: "center" });
    doc.moveDown();
    vault.forEach((cred, i) => {
      doc
        .fontSize(12)
        .text(
          `${i + 1}. Site: ${cred.site}\n   Username: ${
            cred.username
          }\n   Password: ${cred.password}\n   Category: ${
            cred.category
          }\n   Notes: ${cred.notes || ""}\n`
        );
      doc.moveDown(0.5);
    });
    doc.end();
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to export PDF", details: err.message });
  }
};
