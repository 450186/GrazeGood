import { StyleSheet, Text, View, Image, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";

import Colours from "../styles/colours.js";
import Styles from "../styles/styles.js";

export default function ProductScreen({ route }) {
  const { barcode } = route.params;
  const [product, setProduct] = useState(null);
  const [ecoReason, setEcoReason] = useState(null);

  const API_BASE = "https://grazegood.onrender.com";
  function getLevel(value, type) {
    if (value == null) return null;
    let high;
    let medium;
    if (type === "sugar") {
      high = 10;
      medium = 5;
    } else if (type === "salt") {
      high = 1.5;
      medium = 0.3;
    } else if (type === "fat") {
      high = 17.5;
      medium = 3;
    }
    if (high == null || medium == null) return null;

    if (value > high) {
      return (
        <View style={Styles.levelContainer}>
          <Text style={Styles.levelText}>High</Text>
          <FontAwesome name="exclamation-triangle" size={16} color={Colours.high} />
        </View>
      );
    }
    if (value > medium) {
      return (
        <View style={Styles.levelContainer}>
          <Text style={Styles.levelText}>Medium</Text>
          <FontAwesome name="exclamation-triangle" size={16} color={Colours.medium} />
        </View>
      );
    }
    return (
      <View style={Styles.levelContainer}>
        <Text style={Styles.levelText}>Low</Text>
        <FontAwesome name="check-square-o" size={16} color={Colours.low} />
      </View>
    );
  }
    const badIngredients = {
        high: ["beef", "veal", "lamb", "mutton", "goat", "palm oil", "palm fat", "palm kernel oil", "palm kernel fat"],
        medium: ["pork", "bacon", "ham", "butter", "cheese", "cream", "high fructose corn syrup", "tuna", "shrimp", "prawn", "cocoa", "chocolate"],
        low: ["glucose syrup", "invert sugar", "maltodextrin", "vegetable oil"]
    };

    function getIngredientImpact(ingredient) {
        const text = ingredient.toLowerCase();

        if(badIngredients.high.some(word => text.includes(word))) {
            return "high";
        }
        if(badIngredients.medium.some(word => text.includes(word))) {
            return "medium";
        }
        if(badIngredients.low.some(word => text.includes(word))) {
            return "low";
        }
        return "none";
    }
  function NutritionRow({ label, value, unit = "g", levelType, sub = false }) {
    if (value == null) return null;
    return (
      <View style={sub ? Styles.subRow : Styles.nutritionRow}>
        <Text style={sub ? Styles.subLabel : Styles.nutritionLabel}>
          {label}
        </Text>
        <View style={Styles.rowRight}>
          <Text style={Styles.nutritionValue}>
            {typeof value === "number" ? value.toFixed(unit === "kcal" ? 0 : 1) : value}
            {unit ? ` ${unit}` : ""}
          </Text>
          {levelType && getLevel(value, levelType)}
        </View>
      </View>
    );
  }
  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await fetch(`${API_BASE}/product/${barcode}`);
        const data = await res.json();
        console.log("PRODUCT ECO:", data.eco);
        console.log("PRODUCT RAW:", data);
        if (res.ok) {
            setProduct(data);
            setEcoReason(data.eco?.ecoReason ?? null);
        } else {
          console.log("Product loading error:", data?.error);
          setProduct(null);

        }
      } catch (e) {
        console.log("Error loading product", e);
        setProduct(null);
      }
    }
    loadProduct();
  }, [barcode]);
  if (!product) {
    return (
      <View style={Styles.MainContainer}>
        <Text style={Styles.Title}>Product not found</Text>
      </View>
    );
  }
    const hasIngredients = 
    product.ingredients?.length > 0 || 
    product.ingredients_text?.trim()?.length > 0;

    const nutriments = product.nutriments ?? {};
    const productText = [
      product.product_name,
      product.brands,
      product.categories,
      ...(product.categories_tags ?? []),
    ].join(" ").toLowerCase();


    const isLiquid =
      nutriments["energy-kcal_100ml"] != null ||
      /\b(drink|beverage|juice|smoothie|tea|coffee|water|soda|cola|monster)\b/i.test(productText);
    const has100mlData = [
      "energy-kcal_100ml",
      "fat_100ml",
      "saturated-fat_100ml",
      "sugars_100ml",
      "salt_100ml",
      "carbohydrates_100ml",
      "proteins_100ml",
      "fiber_100ml",
    ].some((key) => nutriments[key] != null);

    const suffix = has100mlData ? "_100ml" : "_100g";
    const nutrimentUnit = suffix === "_100ml" ? "100ml" : "100g";

    const showNutrimentKeys = [
      `energy-kcal${suffix}`,
      `fat${suffix}`,
      `saturated-fat${suffix}`,
      `sugars${suffix}`,
      `salt${suffix}`,
      `carbohydrates${suffix}`,
      `proteins${suffix}`,
      `fiber${suffix}`,
    ]

    const hasNutriments = showNutrimentKeys.some(key => nutriments[key] != null);

    let confidenceMessage = null;

    if (product.eco?.confidence >= 70) {
      confidenceMessage = "High confidence";
    } else if (product.eco?.confidence >= 40) {
      confidenceMessage = "Some environmental data unavailable";
    } else if (product.eco?.confidence != null) {
      confidenceMessage = "EcoScore estimated from limited data";
    }

  return (
    <ScrollView
      style={Styles.savedPage}
      contentContainerStyle={Styles.MainContainer}
    >
      {product.image_front_small_url ? (
        <Image
          source={{ uri: product.image_front_small_url }}
          style={Styles.Image}
        />
      ) : (
        <Image
          source={require("../assets/product-placeholder.jpg")}
          style={Styles.Image}
        />
      )}
      <Text style={Styles.Title}>{(product.product_name ?? "Unknown product").replace(/&quot;|&#039;/g, "'")}</Text>
      <Text style={Styles.Brand}>{product.brands ?? "Unknown brand"}</Text>
      <View style={Styles.ecoContainer}>
        <Text style={[
            Styles.productPageEcoScore,
            product.eco?.ecoScore <= 30 && {color: Colours.high},
            product.eco?.ecoScore <= 69 && product.eco?.ecoScore > 30 && {color: Colours.medium},
            product.eco?.ecoScore >= 70 && {color: Colours.low}
            ]}>{product.eco?.ecoScore ?? "-"}</Text>
        <Text style={Styles.ecoScoreLabel}>EcoScore</Text> 
        {confidenceMessage && (
          <Text style={Styles.EcoConfidence}>
            {confidenceMessage}
          </Text>
        )}
        {ecoReason?.map((flag, index) => {
            return (
              <Text key={index} style={[
                  Styles.EcoReason,
                  flag.impact === "medium" && {color: Colours.medium},
                  flag.impact === "high" && {color: Colours.high},
                  flag.impact === "low" && {color: Colours.low},
                  ]}>
                  {flag.message}
              </Text>
            )
        })}
      </View>
      <View style={[Styles.divider, {marginTop: 20}]} />
      {hasNutriments && (
        <>
      <Text style={Styles.SectionTitle}>Nutrition Information</Text>
      <Text style={Styles.SectionSubtitle}>per {nutrimentUnit}</Text>
      <View style={[
        Styles.nutritionContainer,
        !hasIngredients ? {marginBottom: 40} : null
        ]}>
        <NutritionRow
          label="Calories"
          value={nutriments[`energy-kcal${suffix}`]}
          unit="kcal"
        />
        {nutriments[`energy-kcal${suffix}`] != null && <View style={Styles.rowDivider} />}
        <NutritionRow
          label="Fat"
          value={nutriments[`fat${suffix}`]}
          unit="g"
          levelType="fat"
        />
        <NutritionRow
          label="Saturated fat"
          value={nutriments[`saturated-fat${suffix}`]}
          unit="g"
          sub
        />
        {nutriments[`fat${suffix}`] != null && <View style={Styles.rowDivider} />}
        <NutritionRow
          label="Carbohydrates"
          value={nutriments[`carbohydrates${suffix}`]}
          unit="g"
        />
        <NutritionRow
          label="Sugar"
          value={nutriments[`sugars${suffix}`]}
          unit="g"
          levelType="sugar"
          sub
        />
        {nutriments[`sugars${suffix}`] != null && <View style={Styles.rowDivider} />}
        <NutritionRow
          label="Protein"
          value={nutriments[`proteins${suffix}`]}
          unit="g"
        />
        {nutriments[`proteins${suffix}`] != null && <View style={Styles.rowDivider} />}
        <NutritionRow
          label="Salt"
          value={nutriments[`salt${suffix}`]}
          unit="g"
          levelType="salt"
        />
        {nutriments[`fiber${suffix}`] != null && <View style={Styles.rowDivider} />}
        <NutritionRow
          label="Fiber"
          value={nutriments[`fiber${suffix}`]}
          unit="g"
        />
      </View>
      </>
      )}
      {hasNutriments && hasIngredients && <View style={Styles.divider} />}
      {hasIngredients && (
        <>
        <Text style={Styles.SectionTitle}>Ingredients</Text>
        <View style={Styles.ingredientsContainer}>
            {product.ingredients?.length > 0
            ? product.ingredients.map((ingredient, index) => {
                const impact = getIngredientImpact(ingredient.text ?? "");
                return (
                    <View
                    key={index}
                    style={[
                        Styles.ingredientRow,
                        impact === "low" && {color: Colours.low},
                        impact === "medium" && {color: Colours.medium},
                        impact === "high" && {color: Colours.high},
                    ]}
                    >
                    <FontAwesome
                        name={impact !== "none" ? "exclamation-triangle" : "dot-circle-o"}
                        size={16}
                        color={
                        impact === "high"
                            ? Colours.high
                            : impact === "medium"
                            ? Colours.medium
                            : impact === "low"
                            ? Colours.low
                            : Colours.text
                        }
                    />

                    <Text
                        style={[
                        Styles.ingredientText,
                        impact === "low" && Styles.ingredientTextLow,
                        impact === "medium" && Styles.ingredientTextMedium,
                        impact === "high" && Styles.ingredientTextHigh,
                        ]}
                    >
                        {ingredient.text.replace(/_/g, " ").replace(/\s+/g, " ").trim()}
                    </Text>
                    </View>
                );
            })
            : product.ingredients_text?.split(",").map((ing, index) => {
                const clean = ing.trim();
                const impact = getIngredientImpact(clean);

                return (
                <View
                key={index}
                style={[
                    Styles.ingredientRow,
                    impact === "low" && Styles.ingredientLow,
                    impact === "medium" && Styles.ingredientMedium,
                    impact === "high" && Styles.ingredientHigh,
                ]}
                >
                <FontAwesome
                    name={impact !== "none" ? "exclamation-triangle" : "dot-circle-o"}
                    size={16}
                    color={
                    impact === "high"
                        ? {color: Colours.high}
                        : impact === "medium"
                        ? {color: Colours.medium}
                        : impact === "low"
                        ? {color: Colours.low}
                        : {color: Colours.text}
                    }
                />

                <Text
                    style={[
                    Styles.ingredientText,
                    impact === "low" && Styles.ingredientTextLow,
                    impact === "medium" && Styles.ingredientTextMedium,
                    impact === "high" && Styles.ingredientTextHigh,
                    ]}
                >
                    {clean}
                </Text>
                </View>
                )
            })}
        </View>
        </>
      )}
    </ScrollView>
  );
}