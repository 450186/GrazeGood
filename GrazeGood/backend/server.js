const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

const calculateEcoScore = require("./EcoScoring");
const POTWs = require("./data/POTWs.json");

app.use(cors());
app.use(express.json());

const bcrypt = require("bcryptjs");
const {createUser, userData} = require("./Models/User");

const Product = require("./Models/Product");

const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
    });


    async function fetchWithRetry(url, options = {}, retries = 2, delayMs = 1000) {
      const response = await fetch(url, options);

      if (response.status === 504 && retries > 0) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
        return fetchWithRetry(url, options, retries - 1, delayMs);
      }

      return response;
    }

async function getProduct(barcode) {
  let product = await Product.findOne({ barcode });

  if(!product) {
    const fields = [
      "product_name",
      "brands",
      "image_front_small_url",
      "nutriments",
      "nutrition_grades",
      "ingredients_text",
      "ingredients",
      "additives_tags",
      "nova_group",
      "ingredients_lc",
      "lang",
      "ingredients_text_en",
      "ingredients_text_fr",
      "ingredients_text_with_allergens",
      "ingredients_text_with_allergens_en",
      "ingredients_text_with_allergens_fr",
      "packaging_tags",
      "countries_tags",
      "manufacturing_places",
      "categories_tags"
    ].join(",");

    const url = 
      `https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(barcode)}` +
      `?fields=${fields}&lang=en&lc=en`;

    const res = await fetchWithRetry(url);

    if(!res.ok) return null;

    const data = await res.json();

    if(data?.status !== 1 || !data?.product) return null;

    const p = data.product;

    const ingredientsText = 
      p.ingredients_text_en ??
      p.ingredients_text ??
      p.ingredients_text_fr ??
      p.ingredients_text_with_allergens ??
      p.ingredients_text_with_allergens_en ??
      p.ingredients_text_with_allergens_fr ??
      null;

      product = await Product.create({
        barcode,
        product_name: p.product_name ?? null,
        brands: p.brands ?? null,
        imageUrl: p.image_front_small_url ?? null,
        nutriments: p.nutriments ?? null,
        nutrition_grades: p.nutrition_grades ?? null,
        ingredients: p.ingredients ?? [],
        ingredients_text: ingredientsText,
        ingredients_language: p.ingredients_lc ?? p.lang ?? null,
        additives_tags: p.additives_tags ?? [],
        nova_group: p.nova_group ?? p.nutriments?.["nova-group"] ?? null,
        packaging_tags: p.packaging_tags ?? [],
        countries_tags: p.countries_tags ?? [],
        manufacturing_places: p.manufacturing_places ?? null,
        categories_tags: p.categories_tags ?? [],
      })
    }
      const eco = calculateEcoScore(product.toObject());

      product.ecoScore = eco?.ecoScore ?? null
      product.ecoReason = eco?.ecoReason ?? null
      await product.save()

      return {
        barcode: product.barcode,
        product_name: product.product_name,
        brands: product.brands,
        image_front_small_url: product.imageUrl,
        nutriments: product.nutriments,
        ingredients: product.ingredients,
        ingredients_text: product.ingredients_text,
        additives_tags: product.additives_tags,
        nova_group: product.nova_group,
        packaging_tags: product.packaging_tags,
        countries_tags: product.countries_tags,
        manufacturing_places: product.manufacturing_places,
        categories_tags: product.categories_tags,
        eco
    }
}
function ensureScanDefaults(user) {
  if (user.scanCredits == null) user.scanCredits = 5;
  if (!user.lastScanReset) user.lastScanReset = new Date();
  if (user.adsWatchedToday == null) user.adsWatchedToday = 0;
  if (!user.lastAdReset) user.lastAdReset = new Date();
}

function handleDailyReset(user) {
  if(!user.lastScanReset) {
    user.lastScanReset = new Date();
  }
  const now = new Date();
  const lastReset = new Date(user.lastScanReset);

  const diffMins = now - lastReset;
  const diffHours = diffMins / (1000 * 60 * 60);

  if(diffHours >= 24) {
    if(user.scanCredits < 5) {
      user.scanCredits = 5;
    }
    user.lastScanReset = new Date();
  }
}
function isNewDay(date) {
  const now = new Date();
  const last = new Date(date);

  return (
    now.getFullYear() !== last.getFullYear() ||
    now.getMonth() !== last.getMonth() ||
    now.getDate() !== last.getDate()
  );
}

function handleAdReset(user) {
  if (!user.lastAdReset) {
    user.lastAdReset = new Date();
  }

  if (isNewDay(user.lastAdReset)) {
    user.adsWatchedToday = 0;
    user.lastAdReset = new Date();
  }
}
async function handlePremiumRenewal(user) {
  if(!user.autoRenew) return;
  if(!user.premiumEnd) return;

  const now = new Date();

  if(user.premiumEnd <= now) {
    const newStart = new Date(user.premiumEnd);
    const newEnd = new Date(user.premiumEnd);
    newEnd.setMonth(newEnd.getMonth() + 1);

    user.premiumStart = newStart;
    user.premiumEnd = newEnd;

    await user.save();
  }
}
function getEcoGrade(score) {
  if (score >= 80) return "A";
  if (score >= 70) return "B";
  if (score >= 50) return "C";
  if (score >= 30) return "D";
  return "E";
}

function setWeekNum (date = new Date()) {
  const Jan = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date - Jan) / (24 * 60 * 60 * 1000));
  return Math.ceil((days + Jan.getDay() + 1) / 7);
}
app.use((req, _res, next) => {
  console.log("REQ:", req.method, req.url);
  next();
});

app.get("/", (_req, res) => {
  res.json({ ok: true, message: "API is running" });
});

app.get("/health", (_req, res) => {
  res.json({ ok: true, message: "API is running" });
});

app.get("/product/:barcode", async (req, res) => {
  try {
    const { barcode } = req.params;

    const product = await getProduct(barcode);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    return res.json(product);
  } catch (e) {
    console.error("PRODUCT ROUTE ERROR:", e);
    return res.status(500).json({ error: "Server error" });
  }
});

app.post("/save", async (req, res) => {
  try {
    const {
      savedBy,
      barcode,
      productName,
      brands,
      imageUrl,
      eco,
      nutriments,
      nutrition_grades,
      ingredients,
      ingredients_text,
      ingredients_language,
      additives_tags,
      nova_group,
      categories_tags,
      packaging_tags,
      countries_tags,
      manufacturing_places
    } = req.body;
    const user = await userData.findOne({username: savedBy});

    if(!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const alreadySaved = user.savedBarcodes.includes(barcode);
    if(alreadySaved) {
      return res.status(400).json({ message: "Product already saved" });
    }

    const product = await Product.findOneAndUpdate(
      {barcode},
      {
        barcode,
        product_name: productName ?? null,
        brands: brands ?? null,
        imageUrl: imageUrl ?? null,
        ecoScore: eco?.ecoScore ?? null,
        ecoScoreGrade: eco?.grade ?? null,
        ecoReason: eco?.ecoReason ?? null,
        nutriments: nutriments ?? null,
        nutrition_grades: nutrition_grades ?? null,
        ingredients: ingredients ?? [],
        ingredients_text: ingredients_text ?? null,
        ingredients_language: ingredients_language ?? null,
        additives_tags: additives_tags ?? [],
        nova_group: nova_group ?? nutriments?.["nova-group"] ?? null,
        categories_tags: categories_tags ?? [],
        packaging_tags: packaging_tags ?? [],
        countries_tags: countries_tags ?? [],
        manufacturing_places: manufacturing_places ?? null
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    )

    const updateUser = await userData.findOneAndUpdate(
      {username: savedBy},
      {
        $addToSet: {savedBarcodes: barcode}
      },
      { new: true }
    );

    if(!updateUser) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({ 
      message: "Product saved",
      product,
      savedBarcodes: updateUser.savedBarcodes,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Server error" });
  }
});

app.get("/saved/:username", async (req, res) => {
  try {
    const {username} = req.params;
    const user = await userData.findOne({username});

    if(!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const savedBarcodes = [...user.savedBarcodes].reverse();

    const savedProducts = await Product.find({
      barcode: {$in: user.savedBarcodes}
    })

    const orderedProducts = savedBarcodes
      .map((barcode) =>
        savedProducts.find((product) => product.barcode === barcode)
      )
      .filter(Boolean);

    res.json(orderedProducts);

  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Server error" });
  }
})
app.delete("/saved/:username/:barcode", async (req, res) => {
  try {
    const {username, barcode} = req.params;
    const UpdatedUser = await userData.findOneAndUpdate(
      { username },
      {$pull: { savedBarcodes: barcode } },
      { new: true }
    )
      if(!UpdatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.json({ 
        message: "Product removed",
        savedBarcodes: UpdatedUser.savedBarcodes,
      });
    } catch (e) {
      console.error("Delete saved error: ", e);
      return res.status(500).json({ error: "Server error" });
    }
})
app.get("/user/:username/scans", async (req, res) => {
  try{
    const {username} = req.params;

    const user = await userData.findOne({username});
    if(!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    ensureScanDefaults(user);
    handleDailyReset(user);
    handleAdReset(user);
    await handlePremiumRenewal(user);

    const premium = user.isActivePremium();

    
    if(!user.lastScanReset) {
      user.lastScanReset = new Date();
    }
    await user.save();

    return res.json({
      scanCredits: user.scanCredits,
      isPremium: premium,
      adsWatchedToday: user.adsWatchedToday
    })

  } catch (e) {
    console.error('Error getting scans: ', e);
    return res.status(500).json({ error: "Server error" });
  }
})
app.post("/user/:username/rewardScans", async (req, res) => {
  try {
    const { username } = req.params;

    const user = await userData.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    ensureScanDefaults(user);
    handleDailyReset(user);
    await handlePremiumRenewal(user);
    const premium = user.isActivePremium();


    handleAdReset(user);

    if(user.adsWatchedToday >= 5) {
      return res.status(400).json({
        error: "You reached your ads watch limit today",
        adsWatchedToday: user.adsWatchedToday
      })
    }

    user.scanCredits += 5;
    user.adsWatchedToday += 1;
    await user.save();

    return res.json({
      message: "Scans rewarded",
      scanCredits: user.scanCredits,
      adsWatchedToday: user.adsWatchedToday,
      isPremium: premium,
    });
  } catch (e) {
    console.error("Error rewarding scans: ", e);
    return res.status(500).json({ error: "Server error" });
  }
});
app.post("/user/:username/useScan", async (req, res) => {
  try {
    const {username} = req.params;

    const user = await userData.findOne({username});

    if(!user) {
      return res.status(404).json({ error: "User not found" });
    }

    ensureScanDefaults(user);
    handleDailyReset(user);
    await handlePremiumRenewal(user);
    const premium = user.isActivePremium();


    if(premium) {
      return res.json({
        message: "Premium user - no scans used",
        scanCredits: user.scanCredits,
        isPremium: premium
      })
    }
    if(user.scanCredits <= 0) {
      return res.status(400).json({
        error: "No scans left",
        scanCredits: 0,
        isPremium: premium
      })
    }
    user.scanCredits -= 1;
    await user.save();
console.log("hello")
    return res.json({
      message: "Scan used",
      scanCredits: user.scanCredits,
      isPremium: premium,
      adsWatchedToday: user.adsWatchedToday
    })
  } catch (e) {
    console.error('Error using scan: ', e);
    return res.status(500).json({ error: "Server error" });
  }
})
app.get("/user/:username/premium", async (req, res) => {
  try {
    const {username} = req.params;

    const user = await userData.findOne(
      {username},
      {
        username: 1,
        firstName: 1,
        lastName: 1,
        premiumStart: 1,
        premiumEnd: 1,
        autoRenew: 1
      }
    );
    if(!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    await handlePremiumRenewal(user);

    const isPremium = user.isActivePremium();

    

    return res.json({
      isPremium,
      premiumStart: user.premiumStart,
      premiumEnd: user.premiumEnd,
      autoRenew: user.autoRenew ?? true
    })
  } catch (e) {
    console.error('Error getting premium status: ', e);
    return res.status(500).json({ error: "Server error" });
  }
})
app.post("/user/:username/buyPremium", async (req, res) => {
  try {
    const {username} = req.params;

    const user = await userData.findOne({username});

    if(!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const now = new Date();

    let premiumStartDate;
    let premiumEndDate;

    const wasRenewal = user.isActivePremium();

    if(wasRenewal) {
      premiumStartDate = user.premiumStart ?? now;
      premiumEndDate = new Date(user.premiumEnd);
      premiumEndDate.setMonth(premiumEndDate.getMonth() + 1);
    } else {
      premiumStartDate = now;
      premiumEndDate = new Date(now);
      premiumEndDate.setMonth(premiumEndDate.getMonth() + 1);
    }

    user.premiumStart = premiumStartDate;
    user.premiumEnd = premiumEndDate;
    user.autoRenew = true;

    await user.save();

    return res.json({
      message: wasRenewal ? "Premium renewed" : "Premium bought",
      isPremium: user.isActivePremium(),
      premiumStart: user.premiumStart,
      premiumEnd: user.premiumEnd,
      autoRenew: user.autoRenew
    })
  } catch (e) {
    console.error('Error buying premium: ', e);
    return res.status(500).json({ error: "Server error" });
  }
})
app.post('/user/:username/togglePremiumRenewal', async (req, res) => {
  try {
    const {username} = req.params;
    const {autoRenew} = req.body;

    const user = await userData.findOne({username});

    if(!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user.autoRenew = autoRenew
    await user.save();
    return res.json({
      message: "Auto renewal updated",
      autoRenew: user.autoRenew
    })
  } catch (e) {
    console.error('Error toggling premium renewal: ', e);
    return res.status(500).json({ error: "Server error" });
  }
})
app.get("/products-of-the-week", async (_req, res) => {
  try {
    const products = await Promise.all(
      POTWs.map((barcode) => getProduct(barcode))
    );

    const goodProducts = products
      .filter((product) =>
        product &&
        product.barcode &&
        product.product_name &&
        product.eco?.ecoScore != null &&
        product.eco.ecoScore >= 60 &&
        !product.eco.ecoReason?.some((reason) => reason.impact === "high")
      );

    const week = setWeekNum();

    const weeklyPicks = [...goodProducts]
      .sort((a, b) => {
        const A = (Number(a.barcode.slice(-6)) + week) % 100;
        const B = (Number(b.barcode.slice(-6)) + week) % 100;
        return A - B;
      })
      .slice(0, 5);

    return res.json(weeklyPicks);
  } catch (e) {
    console.error("Error getting products of the week: ", e);
    return res.status(500).json({ error: "Server error" });
  }
});
app.get("/debug/find-potw-candidates", async (_req, res) => {
  try {
    const searchUrl =
      "https://world.openfoodfacts.org/cgi/search.pl" +
      "?search_terms=plant based" +
      "&search_simple=1" +
      "&action=process" +
      "&json=1" +
      "&page_size=30" +
      "&fields=code,product_name,brands,image_front_small_url,nutriments,ingredients_text,ingredients,packaging_tags,countries_tags,manufacturing_places,categories_tags,additives_tags,nova_group";

    const offRes = await fetch(searchUrl, {
      headers: {
        Accept: "application/json",
        "User-Agent": "GrazeGood/1.0"
      }
    });

    const data = await offRes.json();

    const candidates = data.products
      .map((p) => {
        const eco = calculateEcoScore({
          ...p,
          ingredients_text: p.ingredients_text ?? null
        });

        return {
          barcode: p.code,
          product_name: p.product_name,
          brands: p.brands,
          image_front_small_url: p.image_front_small_url,
          eco
        };
      })
      .filter((p) =>
        p.barcode &&
        p.product_name &&
        p.eco?.ecoScore != null &&
        p.eco.ecoScore >= 70 &&
        !p.eco.ecoReason?.some((r) => r.impact === "high")
      )
      .sort((a, b) => b.eco.ecoScore - a.eco.ecoScore);

    res.json(candidates);
  } catch (e) {
    console.error("Candidate search error:", e);
    res.status(500).json({ error: "Server error" });
  }
});
app.post("/login", async (req, res) => {
  try {
    const {username, password} = req.body;
    
    if(!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }
    const user = await userData.findOne({username});

    if(!user) {
      return res.status(404).json({ error: "User not found" });
    }
    await handlePremiumRenewal(user);
    const validPassword = await bcrypt.compare(password, user.password);

    if(!validPassword) {
      return res.status(401).json({ error: "Invalid password" });
    }


    return res.json({
      message: "Login successful",
      user: {
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    })
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Server error" });
  }
})

app.post("/register", async (req, res) => {
  try {
    const { username, password, firstName, lastName, email } = req.body;

  const user = await createUser(username, password, firstName, lastName, email);
    res.json({
      message: "User created",
      user: {
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });
    } catch (e) {
      console.log("Registration Error:", e);
      return res.status(500).json({ error: "Server error" });
    }
})

const PORT = process.env.PORT || 5050;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});