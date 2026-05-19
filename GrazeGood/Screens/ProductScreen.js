import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import Svg, { Circle } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  LinearTransition,
  FadeInDown,
  FadeOutUp
} from "react-native-reanimated";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";

import Colours from "../styles/colours.js";
import Styles from "../styles/styles.js";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
export default function ProductScreen({ route }) {
  const { barcode } = route.params;
  const [product, setProduct] = useState(null);

  const [savedBy, setSavedBy] = useState(null);
  const [ecoReason, setEcoReason] = useState(null);
  const [displayScore, setDisplayScore] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const ecoScore = product?.eco?.ecoScore ?? null;
  const ingredientDetails = product?.eco?.ingredientDetails ?? [];
  const ecoBreakdown = product?.eco?.ecoBreakdown ?? [];

  const scoreColor =
  ecoScore == null
    ? Colours.text
    : ecoScore <= 30
    ? Colours.high
    : ecoScore <= 69
    ? Colours.medium
    : Colours.low;

  const scoreGlow = 
  ecoScore == null
    ? Colours.text
    : ecoScore <= 30
    ? "#E40C0C"
    : ecoScore <= 69
    ? "#FF7700" 
    : "#07BE0A";

  const radius = 55;
  const strokeWidth = 6;
  const size = 130;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  const ringProgress = useSharedValue(0);

  const animationDuration = 1200;

  useEffect(() => {
    if (ecoScore == null) return;

    setDisplayScore(0);

    ringProgress.value = 0;
    ringProgress.value = withTiming(ecoScore / 100, {
      duration: animationDuration,
    });

    let currentStep = 0;
    const steps = 40;
    const end = ecoScore;
    const stepTime = animationDuration / steps;

    const timer = setInterval(() => {
      currentStep++;

      const progress = currentStep / steps;
      const nextScore = Math.round(end * progress);

      setDisplayScore(nextScore);

      if (currentStep >= steps) {
        setDisplayScore(end);
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [ecoScore]);

    const animatedCircleProps = useAnimatedProps(() => ({
      strokeDashoffset: circumference * (1 - ringProgress.value),
    }));

  const API_BASE = "https://grazegood.onrender.com";

  const saveProduct = async () => {
    if(!product || !barcode || !savedBy) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Missing required fields",
        visibilityTime: 2000,
      })
      return;
    }

    setSaving(true);

    try {
      const res = await fetch(`${API_BASE}/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          savedBy,
          barcode,
          productName: product.product_name ?? null,
          brands: product.brands ?? null,
          imageUrl: product.image_front_small_url ?? null,
          nutriments: product.nutriments ?? null,
          nutrition_grades: product.nutrition_grades ?? null,
          ingredients: product.ingredients ?? [],
          ingredients_text: product.ingredients_text ?? null,
          ingredients_language: product.ingredients_language ?? product.ingredients_lc ?? product.lang ?? null,
          additives_tags: product.additives_tags ?? [],
          nova_group: product.nova_group ?? product.nutriments?.["nova-group"] ?? null,
          packaging_tags: product.packaging_tags ?? [],
          countries_tags: product.countries_tags ?? [],
          manufacturing_places: product.manufacturing_places ?? null,
          categories_tags: product.categories_tags ?? [],
          eco: {
            ecoScore: product.eco?.ecoScore,
            confidence: product.eco?.confidence,
            ecoReason: product.eco?.ecoReason,
            ingredientDetails: product.eco?.ingredientDetails,
            ecoBreakdown: product.eco?.ecoBreakdown,
          },
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsSaved(true);
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Product saved",
          visibilityTime: 2000,
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: data?.error ?? "Unknown error",
          visibilityTime: 2000,
        });
      }
    } catch (e) {
      console.log("Error saving product", e);
    } finally {
      setSaving(false);
    }
  }
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
            const username = await AsyncStorage.getItem("username");
            setSavedBy(username);
            const savedRes = await fetch(`${API_BASE}/saved/${username}`);
            const savedData = await savedRes.json();

            if (savedRes.ok) {
              const alreadySaved = savedData.some(
                (item) => item.barcode === barcode
              )
              setIsSaved(alreadySaved);
            }
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

    const cleanedIngredients = product.ingredients?.filter((ingredient) => {
      const text = ingredient.text?.toLowerCase().trim() ?? "";
      return (
        !text.includes("ingredients") &&
        !text.includes("contact") &&
        !text.includes("lidl") &&
        !text.includes("aldi") &&
        !text.includes("tesco") &&
        !text.includes("sainsbury") &&
        !text.includes("asda") &&
        !text.includes("waitrose") &&
        !text.includes("morrison") &&
        !text.includes("co-op") &&
        !text.includes("www") &&
        !text.includes(".com") &&
        !text.includes("get in touch") &&
        !text.includes("po box") &&
        !text.includes("uk ltd") &&
        !text.includes("telephone") &&
        !text.includes("consumer") &&
        !text.includes("visit") &&
        !/\d{5,}/.test(text) &&
        text.length > 2 &&
        text.length < 40
      );
    }) ?? [];

    const sortedIngredients = [...cleanedIngredients].sort((a, b) => {
    const aText = a.text?.toLowerCase() ?? "";
    const bText = b.text?.toLowerCase() ?? "";

    const aData = ingredientDetails.find((item) =>
      aText.includes(item.ingredient.toLowerCase())
    );

    const bData = ingredientDetails.find((item) =>
      bText.includes(item.ingredient.toLowerCase())
    );

    const priority = {
      high: 3,
      medium: 2,
      low: 1,
      none: 0,
    };

    const aPriority = priority[aData?.impact ?? "none"];
    const bPriority = priority[bData?.impact ?? "none"];

    return bPriority - aPriority;
  });

    const visibleIngredients = showAll 
    ? sortedIngredients
    : sortedIngredients.slice(0, 5);

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
    let ScoreVerdict = null;

    if (product.eco?.confidence >= 70) {
      confidenceMessage = "High confidence";
    } else if (product.eco?.confidence >= 40) {
      confidenceMessage = "Some environmental data unavailable";
    } else if (product.eco?.confidence != null) {
      confidenceMessage = "EcoScore estimated from limited data";
    }

    if(product.eco?.ecoScore <= 30) {
      ScoreVerdict = "High Environmental Impact";
    } else if(product.eco?.ecoScore <= 69) {
      ScoreVerdict = "Moderate Environmental Impact";
    } else {
      ScoreVerdict = "Low Environmental Impact";
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
      <Text style={Styles.ProductPageTitle}>{(product.product_name ?? "Unknown product").replace(/&quot;|&#039;/g, "'")}</Text>
      <Text style={Styles.Brand}>{product.brands ?? "Unknown brand"}</Text>
      <TouchableOpacity
        onPress={saveProduct}
        style={[
          Styles.saveButton,
          isSaved && Styles.savedButton
        ]}
        disabled={isSaved || saving}
      >
        <Text style={Styles.saveButtonText}>
          {saving ? "Saving..." : isSaved ? "Saved" : "Save product"}
        </Text>

        <FontAwesome
          name={isSaved ? "check" : "bookmark"}
          size={15}
          color="white"
        />
      </TouchableOpacity>

      <View style={Styles.ecoContainer}>
      <View style={[Styles.EcoCircle, { shadowColor: scoreColor }]}>
        <Svg width={size} height={size} style={{ position: "absolute" }}>
          
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke="rgba(0,0,0,0.05)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <AnimatedCircle
            cx={center}
            cy={center}
            r={radius}
            stroke={scoreGlow}
            strokeWidth={strokeWidth + 5}
            strokeOpacity={0.5}
            fill="transparent"
            strokeDasharray={circumference}
            animatedProps={animatedCircleProps}
            strokeLinecap="round"
            rotation="-90"
            originX={center}
            originY={center}
          />

          <AnimatedCircle
            cx={center}
            cy={center}
            r={radius}
            stroke={scoreColor}
            strokeWidth={strokeWidth}
            strokeOpacity={1}
            fill="transparent"
            strokeDasharray={circumference}
            animatedProps={animatedCircleProps}
            strokeLinecap="round"
            rotation="-90"
            originX={center}
            originY={center}
          />
        </Svg>

        <View style={Styles.EcoScoreCircleContent}>
          <Text style={[Styles.productPageEcoScore, { color: scoreColor }]}>
            {displayScore}
          </Text>
          <Text style={Styles.ecoScoreLabel}>EcoScore</Text>
        </View>
      </View>
          {ScoreVerdict && (
          <Text style={[
            Styles.EcoScoreVerdict,
            product.eco?.ecoScore <= 30 && {color: Colours.high},
            product.eco?.ecoScore <= 69 && product.eco?.ecoScore > 30 && {color: Colours.medium},
            product.eco?.ecoScore >= 70 && {color: Colours.low}
            ]}>{ScoreVerdict}</Text>
        )}
        {ecoReason?.map((flag, index) => {
            return (
              <View key={index} style={Styles.warningChip}>
                <FontAwesome6 name="flask" size={20} style={[
                  Styles.EcoReasonIcon,
                  flag.impact === "medium" && {color: "#FF7700"},
                  flag.impact === "high" && {color: Colours.high},
                  flag.impact === "low" && {color: Colours.low},
                ]}/>
                <Text key={index} style={[
                    Styles.EcoReason,
                    flag.impact === "medium" && {color: Colours.medium},
                    flag.impact === "high" && {color: Colours.high},
                    flag.impact === "low" && {color: Colours.low},
                    ]}>
                    {flag.message}
                </Text>
              </View>
            )
        })}
        {confidenceMessage && (
          <View style={Styles.confidenceContainer}>
            <FontAwesome name="exclamation-triangle" size={13} style={Styles.confidenceIcon} />
            <Text style={Styles.EcoConfidence}>
              {confidenceMessage}
            </Text>
          </View>
        )}
      </View>
      <TouchableOpacity
        onPress={() => {
          setShowBreakdown(!showBreakdown)
        }}
        style={Styles.breakdownButton}
      >
        <Text style={Styles.breakdownButtonText}>
          Why this score?
        </Text>
        <FontAwesome name={showBreakdown ? "caret-up" : "caret-down"} size={15} color={Colours.text} />
      </TouchableOpacity>
      {showBreakdown && (
        <Animated.View
          entering={FadeInDown.duration(250)}
          exiting={FadeOutUp.duration(200)}
          layout={LinearTransition.springify()}
          style={Styles.breakdownContainer}
        >
          {ecoBreakdown.length > 0 ? (
            ecoBreakdown.map((item, index) => (
              <View key={index} style={Styles.warningChipSmall}>
                <FontAwesome6
                  name={item.impact === "low" ? "circle-check" : "triangle-exclamation"}
                  size={20}
                  color={
                    item.impact === "low"
                      ? Colours.low
                      : item.impact === "medium"
                      ? Colours.medium
                      : Colours.high
                  }
                  style={{ marginRight: 10 }}
                />

                <View style={{ flex: 1 }}>
                  <Text style={Styles.breakdownTitle}>{item.title}</Text>
                  <Text style={Styles.breakdownText}>{item.reason}</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={Styles.breakdownText}>
              No major sustainability concerns detected.
            </Text>
          )}
        </Animated.View>
      )}
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
            ? visibleIngredients.map((ingredient, index) => {
                const cleanIngredient = ingredient.text ?? "";

                const ingredientData = ingredientDetails.find((item) =>
                  cleanIngredient.toLowerCase().includes(item.ingredient.toLowerCase())
                );

                const impact = ingredientData?.impact ?? "none";
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
                  <View style={{flex: 1}}>
                    <Text
                        style={[
                        Styles.ingredientText,
                        impact === "low" && Styles.ingredientTextLow,
                        impact === "medium" && Styles.ingredientTextMedium,
                        impact === "high" && Styles.ingredientTextHigh,
                        ]}
                    >
                      {ingredient.text
                        .replace(/_/g, " ")
                        .replace(/\s+/g, " ")
                        .trim()
                        .toLowerCase()
                        .replace(/\b\w/g, c => c.toUpperCase())
                      }
                    </Text>
                    {ingredientData?.reason && (
                        <Text style={Styles.ingredientReason}>
                          {ingredientData.reason}
                        </Text>
                    )}
                  </View>
                    </View>
                );
            })
            : product.ingredients_text?.split(",").map((ing, index) => {
                const clean = ing.trim();
                const ingredientData = ingredientDetails.find((item) =>
                  clean.toLowerCase().includes(item.ingredient.toLowerCase())
                );

                const impact = ingredientData?.impact ?? "none";

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
                        ? Colours.high
                        : impact === "medium"
                        ? Colours.medium
                        : impact === "low"
                        ? Colours.low
                        : Colours.text
                    }
                />
              <View style={{flex: 1}}>
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
                {ingredientData?.reason && (
                    <Text style={Styles.ingredientReason}>
                      {ingredientData.reason}
                    </Text>
                )}
              </View>
                </View>
                )
            })}
            {cleanedIngredients.length > 5 && (
              <TouchableOpacity
                onPress={() => {
                setShowAll(!showAll)
              }}
              style={Styles.showAllBtn}>
                <Text style={Styles.showAllText}>
                  {showAll ? "Show less" : "Show {} more".replace("{}", cleanedIngredients.length - 5)}
                </Text>
              </TouchableOpacity>
            )}
        </View>
        </>
      )}
    </ScrollView>
  );
}