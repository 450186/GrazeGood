
function calculateEcoScore(product) {

    let score = 0;
    let weightTotal = 0;

    function addWeightedSection(sectionScore, sectionWeight) {
        if (sectionScore == null) return;

        const clampedScore = Math.max(0, Math.min(100, sectionScore));
        score += (clampedScore / 100) * sectionWeight;
        weightTotal += sectionWeight;
    }
    const missing = [];
    const redFlags = [];
    let ethicalPenalty = 0;
    let sustainabilityBonus = 0;

    function formatPackagingTag(tag) {
        if (!tag) return "";

        const joinedWords = {
            mixedplasticfilm: "Mixed Plastic Film",
            "mixedplasticfilm packet": "Mixed Plastic Film Packet",
            plasticfilm: "Plastic Film",
            "plasticfilm packet": "Plastic Film Packet",
            plasticbottle: "Plastic Bottle",
            plasticbag: "Plastic Bag",
            cardboardbox: "Cardboard Box",
        };

        const cleaned = tag
            .replace(/^en:/, "")
            .replace(/-/g, " ")
            .trim()
            .toLowerCase();

        return joinedWords[cleaned] ??
            cleaned.replace(/\b\w/g, c => c.toUpperCase());
    }

    //boycott check
    const ethicalFlags = {
    nestle: {
        severity: "high",
        reasons: [
        "water extraction controversies",
        "supply chain labour concerns",
        ],
    },

    mondelez: {
        severity: "medium",
        reasons: [
        "palm oil and cocoa supply chain concerns",
        ],
    },

    mars: {
        severity: "medium",
        reasons: [
        "cocoa supply chain concerns",
        "high-impact processed food production",
        ],
    },

    sabra: {
        severity: "high",
        reasons: [
        "boycott list concern",
        ],
    },

    cargill: {
        severity: "high",
        reasons: [
        "deforestation-linked supply chain concerns",
        "industrial agriculture concerns",
        ],
    },

    bayer: {
        severity: "medium",
        reasons: [
        "pesticide and agricultural chemical concerns",
        ],
    },

    pepsico: {
        severity: "medium",
        reasons: [
        "plastic pollution concerns",
        "processed food supply chain concerns",
        ],
    },

    cocaCola: {
        matchNames: ["coca-cola", "coca cola"],
        severity: "medium",
        reasons: [
        "plastic pollution concerns",
        "water usage concerns",
        ],
    },
    };
    if (product.brands) {
    const brands = product.brands
        .toLowerCase()
        .split(",")
        .map(b => b.trim());

    brands.forEach(brand => {
        Object.entries(ethicalFlags).forEach(([key, flag]) => {
        const namesToMatch = flag.matchNames ?? [key];

        const matched = namesToMatch.some(name =>
            brand.includes(name.toLowerCase())
        );

        if (matched) {
            redFlags.push({
            impact: flag.severity,
            message: `${brand} has ethical concerns: ${flag.reasons.join(", ")}`
            });

            if (flag.severity === "high") {
            ethicalPenalty += 25
            } else if(flag.severity === "medium") {
                ethicalPenalty += 12
            } else {
                ethicalPenalty += 5
            }
        }
        });
    });
    } else {
    missing.push("brands");
    }

    //packaging
    let materialCount = 0;
    let packagingScore = 0;
    const packagingScores = {
        polystyrene: 1,
        multilayer: 1,
        composite: 2,
        plastic: 3,
        ldpe: 4,
        polypropylene: 6,
        pet: 7,
        hdpe: 9,
        glass: 12,
        aluminium: 13,
        steel: 13,
        tin: 13,
        wood: 12,
        plantbased: 11,
        cardboard: 16,
        carton: 16,
        paper: 15,
        kraft: 15,
        biodegradable: 14,
        compostable: 16,
        cork: 15,
        reusable: 20,
        refill: 19,
        tetrapak: 8,
        bioplastic: 10,
        glassbottle: 14,
        aluminiumcan: 12,
    };
    if (product.packaging_tags?.length > 0) {
        Object.entries(packagingScores).forEach(([material, value]) => {
            const matchedTag = product.packaging_tags?.find(tag => {
                const normalisedTag = String(tag)
                    .toLowerCase()
                    .replace(/^en:/, "")
                    .replace(/[-\s]/g, "");

                return normalisedTag.includes(material);
            });

            if (matchedTag) {
                const cleanTag = formatPackagingTag(matchedTag);
                packagingScore += value;
                materialCount++;

                if (value <= 4) {
                    redFlags.push({
                        message: `Unsustainable material used: ${cleanTag}`,
                        impact: "medium"
                    });
                }
            }
        });

        const averagePackagingScore = materialCount > 0
            ? packagingScore / materialCount
            : null;
        if (averagePackagingScore != null) {
            const packagingScoreOutOf100 = (averagePackagingScore / 20) * 100;
            addWeightedSection(packagingScoreOutOf100, 20);
        }
    } else {
        missing.push("packaging_tags");
    }

    //manufacturing countries

    let manufacturingScore = 0;
    let placesFound = 0;

    const locationScores = {
        "united kingdom": 100,
        "england": 100,
        "scotland": 100,
        "wales": 100,
        "ireland": 90,

        "france": 70,
        "germany": 70,
        "spain": 70,
        "italy": 70,

        "united states": 40,
        "canada": 40,

        "china": 30,
        "japan": 30,
        "india": 30,
        "israel": 20,

        "brazil": 35,
        "argentina": 40,
        "australia": 50,
        "new zealand": 55,
        "thailand": 35,
        "vietnam": 35,
        "indonesia": 25,
        "malaysia": 30,
        "mexico": 45,
    };

    if (product.manufacturing_places) {

        const places = product.manufacturing_places
            .toLowerCase()
            .split(",");

        places.forEach(place => {
            const cleanPlace = place.trim();

            if (locationScores[cleanPlace] != null) {
                manufacturingScore += locationScores[cleanPlace];
                placesFound++;
                if (cleanPlace == "israel") {
                    ethicalPenalty += 25
                    redFlags.push({
                        impact: `high`,
                        message: `product has ties to Israel so is currently boycotted`
                    })
                }
                if (locationScores[cleanPlace] <= 40) {
                    redFlags.push({
                        impact: 'medium',
                        message: `Imported from ${cleanPlace}, increasing transport emissions`
                    });
                }
            }
        });
        const averageManufacturingScore =
            placesFound > 0
                ? manufacturingScore / placesFound
                : null;

        if(averageManufacturingScore != null) {
            addWeightedSection(averageManufacturingScore, 25);
        }
    }
    else {
        missing.push("manufacturing_places");
    }


    //ingredients
    const ingredientScores = {
        beef: 10,
        veal: 12,
        lamb: 15,
        mutton: 15,
        goat: 20,
        pork: 30,
        bacon: 30,
        ham: 30,
        chicken: 50,
        turkey: 50,
        duck: 35,

        milk: 50,
        butter: 30,
        cheese: 25,
        cream: 40,
        yogurt: 50,
        whey: 60,
        casein: 60,

        "palm oil": 0,
        "palm fat": 0,
        "palm kernel oil": 0,
        "palm kernel fat": 0,


        soy: 50,
        soya: 50,
        "soybean oil": 45,
        "soy protein": 50,

        "sunflower oil": 60,
        "rapeseed oil": 60,
        "vegetable oil": 45,

        "glucose syrup": 40,
        fructose: 45,
        "high fructose corn syrup": 30,
        "invert sugar": 45,
        maltodextrin: 40,
        gelatin: 25,
        gelatine: 25,
        "hydrogenated oil": 15,
        "shortening": 20,
        "corn syrup": 30,
        "artificial sweetener": 45,
        aspartame: 40,
        sucralose: 40,
        acesulfame: 40,

        tuna: 40,
        salmon: 45,
        anchovy: 50,
        shrimp: 35,
        prawn: 35,
        cod: 45,
        crab: 35,
        lobster: 25,

        almond: 45,
        avocado: 55,
        cashew: 40,
        "coconut oil": 35,
        rice: 55,

        coffee: 45,
        cocoa: 40,
        chocolate: 40,

        emulsifier: 70,
        stabiliser: 70,
        preservative: 70,
        flavouring: 70,
        colouring: 70,
        "artificial flavour": 65,
        "artificial colour": 65,

        //Positives
        lentils: 90,
        beans: 85,
        peas: 85,
        oats: 90,
        chickpeas: 90,
        tofu: 85,
        quinoa: 80,
        barley: 85,
        flaxseed: 90,
        linseed: 90,
        "wholegrain oats": 95,
        mushrooms: 90,
        seaweed: 85,
    };

    let ingredientScore = 0;
    let ingredientsFound = 0;

    if (product.ingredients_text) {

        const ingredients = product.ingredients_text.toLowerCase();

        Object.entries(ingredientScores).forEach(([ingredient, value]) => {

            if (ingredients.includes(ingredient)) {

                ingredientScore += value;
                ingredientsFound++;
                if (
                ingredient === "palm oil" ||
                ingredient === "palm fat" ||
                ingredient === "palm kernel oil" ||
                ingredient === "palm kernel fat"
                ) {
                ethicalPenalty += 25;
                redFlags.push({
                    impact: "high",
                    message: "Palm oil detected — linked to deforestation and habitat loss"
                });
                } else if (value <= 20) {
                    redFlags.push({
                        impact: 'high',
                        message: `High-impact ingredient detected: ${ingredient}`
                    });
                }
                else {
                    if (value <= 40) {
                        redFlags.push({
                            impact: 'medium',
                            message: `Contains ${ingredient}, increasing environmental impact`
                            
                        });
                    }
                }
            }
        });

        const averageIngredientScore =
            ingredientsFound > 0
                ? ingredientScore / ingredientsFound
                : null;

        if (averageIngredientScore != null) {
            addWeightedSection(averageIngredientScore, 50);
        }

    } else {
        missing.push("ingredients_text");
    }

    const searchableText = [
        product.ingredients_text,
        ...(product.categories_tags || []),
        ...(product.labels_tags || []),
        ...(product.packaging_tags || [])
    ]
    .join(" ")
    .toLowerCase();

    const sustainabilityBonuses = {
        organic: {
            bonus: 8,
            message: "Organic ingredients detected"
        },

        vegan: {
            bonus: 12,
            message: "Plant-based product"
        },

        vegetarian: {
            bonus: 6,
            message: "Vegetarian product"
        },

        "fair trade": {
            bonus: 10,
            message: "Fair Trade certified"
        },

        recyclable: {
            bonus: 5,
            message: "Recyclable packaging"
        },

        compostable: {
            bonus: 8,
            message: "Compostable packaging"
        },

        local: {
            bonus: 6,
            message: "Locally sourced product"
        },

        seasonal: {
            bonus: 5,
            message: "Seasonal ingredients"
        },

        "rainforest alliance": {
            bonus: 6,
            message: "Rainforest Alliance certified"
        },

        "fsc": {
            bonus: 4,
            message: "Sustainably sourced paper/card packaging"
        },

        "msc": {
            bonus: 7,
            message: "Sustainably sourced seafood"
        },

        "asc": {
            bonus: 6,
            message: "Responsibly farmed seafood"
        },

        "carbon neutral": {
            bonus: 10,
            message: "Carbon neutral certified"
        },

        "b corporation": {
            bonus: 6,
            message: "Certified B Corporation"
        },

        "b corp": {
            bonus: 6,
            message: "Certified B Corporation"
        },

        refill: {
            bonus: 7,
            message: "Refillable packaging"
        },

        reusable: {
            bonus: 6,
            message: "Reusable packaging"
        },

        "plastic free": {
            bonus: 10,
            message: "Plastic-free packaging"
        },

        "palm oil free": {
            bonus: 12,
            message: "Palm oil free"
        }
    };
    if (Number(product.nova_group) === 1) {
        sustainabilityBonus += 10;

        redFlags.push({
            impact: "low",
            message: "Minimally processed food"
        });
    }

    const searchableItems = [
        ...(product.categories_tags || []),
        ...(product.labels_tags || []),
        ...(product.packaging_tags || []),
    ]
    .map(item =>
        String(item)
            .toLowerCase()
            .replace(/^en:/, "")
            .trim()
    );

    const addedMessages = new Set();

    Object.entries(sustainabilityBonuses).forEach(([term, data]) => {

        const normalisedTerm = term.toLowerCase();

        const matched =
            searchableText.includes(normalisedTerm) ||
            searchableItems.some(item => item === normalisedTerm);

        if (matched) {
            sustainabilityBonus += data.bonus;

            if (!addedMessages.has(data.message)) {
                redFlags.push({
                    impact: "low",
                    message: data.message
                });

                addedMessages.add(data.message);
            }
        }
    });
    sustainabilityBonus = Math.min(sustainabilityBonus, 20);

    let finalScore = weightTotal > 0
        ? Math.round((score / weightTotal) * 100)
        : null;
    
    if (weightTotal === 0) {
        return {
            ecoScore: Math.max(0, Math.min(100, 40 - ethicalPenalty + sustainabilityBonus)),
            confidence: 0,
            ethicalPenalty,
            sustainabilityBonus,
            missingVariables: missing,
            ecoReason: redFlags
        };
    }

    finalScore = Math.max(
        0,
        Math.min(100, finalScore - ethicalPenalty + sustainabilityBonus)
    );

    return {
        ecoScore: finalScore,
        confidence: Math.round(weightTotal),
        ethicalPenalty,
        sustainabilityBonus,
        missingVariables: missing,
        ecoReason: redFlags
    };
}

module.exports = calculateEcoScore;