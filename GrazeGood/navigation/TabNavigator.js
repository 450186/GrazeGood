import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome } from "@expo/vector-icons";
import { Text, Image, View } from "react-native";

import HomeScreen from "../Screens/HomeScreen";
import ScanScreen from "../Screens/ScanScreen";
import SavedScreen from "../Screens/SavedScreen";
import ProfileScreen from "../Screens/ProfileScreen";

import Styles from "../styles/styles.js";
import Colours from "../styles/colours.js";

const Tab = createBottomTabNavigator();
const API_BASE = "https://grazegood.onrender.com";

export default function TabNavigator({ setUser }) {
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const username = await AsyncStorage.getItem("username");
      if (!username) return;

      const res = await fetch(`${API_BASE}/user/${username}/profile`);
      const data = await res.json();

      if (res.ok) {
        setProfileImage(data.avatarUrl);
      }
    } catch (e) {
      console.log("Error loading profile image", e);
    }
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: Colours.accentTwo,
        tabBarInactiveTintColor: Colours.accent,
        tabBarStyle: {
          height: 80,
          paddingTop: 10,
          paddingBottom: 10,
          backgroundColor: Colours.background,
        },
        headerStyle: {
          backgroundColor: Colours.background,
          height: 120,
        },
        headerTitle: () => (
          <View style={Styles.logoContainer}>
            <Image source={require("../assets/GrazeLogo.png")} style={Styles.logo} />
            <Text style={Styles.Grazegood}>GrazeGood</Text>
          </View>
        ),
        headerShown: true,
        tabBarIcon: ({ color, size }) => {
          let iconName = "home";

          if (route.name === "Scan") iconName = "barcode";
          if (route.name === "Saved") iconName = "bookmark";
          if (route.name === "Profile") iconName = "user";

          return <FontAwesome name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home">
        {(props) => <HomeScreen {...props} setUser={setUser} />}
      </Tab.Screen>

      <Tab.Screen name="Scan" component={ScanScreen} />
      <Tab.Screen name="Saved" component={SavedScreen} />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) =>
            profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  borderWidth: 2,
                  borderColor: focused ? Colours.accentTwo : Colours.accent,
                }}
              />
            ) : (
              <FontAwesome
                name="user"
                size={24}
                color={focused ? Colours.accentTwo : Colours.accent}
              />
            ),
        }}
      />
    </Tab.Navigator>
  );
}