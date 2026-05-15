import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useState, useCallback, useEffect } from "react";
import React from "react";
import { View, Text, Button, StyleSheet, FlatList, Image, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Styles from "../styles/styles.js"
import Colours from "../styles/colours.js"
export default function HomeScreen( { setUser, navigation } ) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productOfTheWeek, setProductOfTheWeek] = useState([]);
  const [loadingPOTW, setLoadingPOTW] = useState(true);

  async function loadProductOfTheWeek() {
    setLoadingPOTW(true);
    try {
      const res = await fetch(`${API_BASE}/products-of-the-week`);
      const data = await res.json();

      if (res.ok) setProductOfTheWeek(data);
      else setProductOfTheWeek([]);
    } catch (e) {
      console.log("Error loading product of the week", e);
    } finally {
      setLoadingPOTW(false);
    }
  }

  const API_BASE = "https://grazegood.onrender.com";

  useFocusEffect(
    useCallback(() => {
      loadProducts();
    }, [])
  );

useEffect(() => {
  loadProductOfTheWeek()
}, [])
  async function loadProducts() {
    try {
      const username = await AsyncStorage.getItem("username");
      const res = await fetch(`${API_BASE}/saved/${username}`);
      const data = await res.json();

      if(res.ok) {
        setProducts(data);
      } else {
        console.log("Saved products error:", data?.error);
        setProducts([]);
      }
    } catch(e) {
      console.log("Error loading saved Products", e)
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: Colours.background }}
      contentContainerStyle={Styles.Page}
    >
      <Text style={Styles.Title}>Home</Text>
      <View style={Styles.HomeTextContainer}>
        <Text style={Styles.SubTitle}>Saved Products ({products.length})</Text>
        <View style={Styles.SubTitleRight}>
        <TouchableOpacity
        style={Styles.SeeMoreBtn}
        onPress={() => navigation.navigate("Saved")}

        >
          <View style={Styles.SeeMoreContainer}>
            <Text style={Styles.SeeMoreText}>View All</Text>
            <FontAwesome name="arrow-circle-o-right" size={18} color={Colours.text} />
          </View>
        </TouchableOpacity>

        </View>
      </View>
    <View style={Styles.FlatListContainer}>
      {products.length === 0 ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <View style={Styles.NoProducts}>
          <Text style={Styles.falseText}>No saved Products</Text>
          <Text style={Styles.falseText}>Scan a product to save it</Text>
        </View>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.barcode}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: products.length <= 2 ? "center" : "flex-start",
          }}
          renderItem={({ item }) => (
            <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate("Product", { barcode: item.barcode })}
            >
              <View style={Styles.ProductContainer}>
                <View style={Styles.ProductInfo}>
                  {item.imageUrl ? (
                    <Image
                      style={Styles.ProductImage}
                      source={{ uri: item.imageUrl }}
                    />
                  ) : (
                    <Image
                      style={Styles.ProductImage}
                      source={require("../assets/product-placeholder.jpg")}
                    />
                  )} 
                  <Text
                  style={Styles.ProductName}
                  numberOfLines={3}
                  ellipsizeMode="tail"
                  >
                    {item.product_name.replace(/&quot;|&#039;/g, "'")}
                  </Text>
                  <View style={Styles.EcoScoreContainer}>
                    <FontAwesome name="leaf" size={14} color={Colours.text} />
                    <Text style={Styles.EcoScore}>Eco Score: {item.eco?.ecoScore ?? item.ecoScore ?? "-"}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
      <View style={Styles.HomeTextContainer}>
        <Text style={Styles.SubTitle}>Products of the Week</Text>
      </View>

    <View style={Styles.FlatListContainer}>
      {loadingPOTW ? (
        <View style={Styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colours.text} />
          <Text style={Styles.loadingText}>Loading picks of the week...</Text>
        </View>
      ) : productOfTheWeek.length === 0 ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <View style={Styles.NoProducts}>
          <Text style={Styles.falseText}>No picks of the week</Text>
        </View>
        </View>
      ) : (
        <FlatList
          data={productOfTheWeek}
          keyExtractor={(item) => item.barcode}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: productOfTheWeek.length <= 2 ? "center" : "flex-start",
          }}
          renderItem={({ item }) => (
            <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate("Product", { barcode: item.barcode })}
            >
            <View style={Styles.ProductContainer}>
              <View style={Styles.ProductInfo}>
                {item.image_front_small_url ? (
                  <Image
                    style={Styles.ProductImage}
                    source={{ uri: item.image_front_small_url }}
                  />
                ) : (
                  <Image
                    style={Styles.ProductImage}
                    source={require("../assets/product-placeholder.jpg")}
                  />
                )} 
                <Text
                style={Styles.ProductName}
                numberOfLines={4}
                ellipsizeMode="tail"
                >
                {(item.product_name ?? "Unknown").replace(/&quot;|&#039;/g, "'")}
                </Text>
                  <View style={Styles.EcoScoreContainer}>
                    <FontAwesome name="leaf" size={14} color={Colours.text} />
                    <Text style={Styles.EcoScore}>Eco Score: {item.eco?.ecoScore ?? item.ecoScore ?? "-"}</Text>
                  </View>
              </View>
            </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
    </ScrollView>
  );

}
const styles = StyleSheet.create({


});