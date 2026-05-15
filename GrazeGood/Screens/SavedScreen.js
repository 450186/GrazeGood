import React, { useState, useCallback } from "react";
import { View, Text, ActivityIndicator, Image, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { Pressable } from "react-native";
import { FontAwesome5, FontAwesome6 } from "@expo/vector-icons";
import Swipeable from "react-native-gesture-handler/Swipeable";

import Colours from "../styles/colours.js";
import Styles from "../styles/styles.js";

export default function SavedScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const API_BASE = "https://grazegood.onrender.com";

  useFocusEffect(
    useCallback(() => {
      loadProducts();
    }, [])
  );
  async function deleteProduct(barcode) {
    try {
      const username = await AsyncStorage.getItem("username");

      const res = await fetch(`${API_BASE}/saved/${username}/${barcode}`, {
        method: "DELETE",
      })

      const data = await res.json();

      if(res.ok) {
        setProducts((prev) => prev.filter((item) => item.barcode !== barcode))
      } else {
        console.log("Error deleting product", data?.error);
      }
    } catch(e) {
      console.log("Error deleting product", e);
    }
  }
  function renderRightActions(barcode) {
    return (
      <Pressable 
      onPress={() => deleteProduct(barcode)}
      style={styles.deleteButton}
      >
        <Text style={styles.deleteText}>
          <FontAwesome5 name="trash" size={36} color="white" />
        </Text>
      </Pressable>
    )
  }
  async function loadProducts( isRefreshing = false) {
    if(isRefreshing) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    try {
      const username = await AsyncStorage.getItem("username");
      const res = await fetch(`${API_BASE}/saved/${username}`);
      const data = await res.json();

      if (res.ok) {
        setProducts(data);
      } else {
        console.log("Saved products error:", data?.error);
        setProducts([]);
      }

    } catch(e) {
      console.log("Error loading saved Products", e)
    } finally {
      if(isRefreshing) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  }
  if(loading) {
    return (
      <View style={Styles.savedPage}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return (
    <View style={Styles.savedPage}>
      <FlatList
        style={Styles.SavedFlatlist}
        data={products}
        keyExtractor={(item) => item.barcode}
        refreshing={refreshing}
        contentContainerStyle={{ flexGrow: 1 }}
        onRefresh={() => loadProducts(true)}
        renderItem={({ item }) => (
          <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate("Product", { barcode: item.barcode })}>
          <Swipeable renderRightActions={() => renderRightActions(item.barcode)}>
            <View style={Styles.SavedProductContainer}>
              <View style={Styles.savedProduct}>
                {item.imageUrl ? (
                    <Image
                      source={{ uri: item.imageUrl }}
                      style={{ width: 150, height: 150, borderRadius: 10 }}
                    />
                ) : (
                    <Image
                      style={{ width: 150, height: 150, borderRadius: 10 }}
                      source={require("../assets/product-placeholder.jpg")}
                    />
                )}
                <View style={Styles.savedProductInfo}>
                  <Text style={{ fontSize: 16, fontWeight: "bold", color: Colours.text }}>
                    {item.product_name.replace("&quot;", "'") ?? "Unknown Product"}
                  </Text>
                  <Text style={{color: Colours.text, fontSize: 15, fontWeight: "bold", marginTop: 10}}>{item.brands}</Text>
                  <View style={Styles.divider}></View>
                  <Text style={{color: Colours.text, fontSize: 18}}>Eco Score: {item.ecoScore ?? "N/A"}</Text>
                </View>
              </View>
            </View>
          </Swipeable>
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.falseText}>No saved products</Text>
            <Text>Pull down to refresh</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  falseText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "red",
    textAlign: "center",
    justifyContent: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colours.background,
    margin: 0,
  },
  deleteButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fa4437",
    borderRadius: 10,
    width: "25%",
    marginHorizontal: 10,
    marginVertical: 10,

    shadowColor: "#000",
    shadowOffset: {
      width: 5,
      height: 5
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
  deleteText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  }
})