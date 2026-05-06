const mongoose = require("mongoose");
const ProductStock = require("../models/ProductStock");
require("dotenv").config();

const slugs = [
  "tvashta-moringa-500gm",
  "tvashta-shilajit-500gm",
  "tvashta-cinnamon-500gm",
  "tvashta-ginger-500gm",
  "tvashta-dark-forest-500gm",
  "tvashta-yellow-forest-500gm",
  "tvashta-eucalyptus-500gm",
  "tvashta-ajwain-500gm",
  "tvashta-berry-500gm",
  "tvashta-jamun-500gm",
  "tvashta-tulsi-500gm",
  "tvashta-acacia-500gm",
  "tvashta-sunflower-500gm",
  "tvashta-litchi-500gm",
  "tvashta-neem-500gm",
  "shri-gayatri-shakti-25gm",
  "shri-gayatri-shakti-50gm",
  "shri-gayatri-shakti-100gm",
  "shri-gayatri-shakti-200gm",
  "shri-gayatri-shakti-500gm",
  "shri-gayatri-shakti-1kg",
  "b2b-30kg-can",
];

(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  for (const slug of slugs) {
    await ProductStock.updateOne(
      { slug },
      { slug, inStock: true },
      { upsert: true }
    );
  }

  console.log("✅ Product stock seeded");
  process.exit();
})();
