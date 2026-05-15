import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome } from "@expo/vector-icons";
import { TouchableOpacity, Text, Image, View } from "react-native";

import HomeScreen from "../Screens/HomeScreen";
import ScanScreen from "../Screens/ScanScreen";
import SavedScreen from "../Screens/SavedScreen";
import ProfileScreen from "../Screens/ProfileScreen";

import Styles from "../styles/styles.js";
import Colours from "../styles/colours.js";

const Tab = createBottomTabNavigator();

export default function TabNavigator({ setUser }) {
  return (
    <Tab.Navigator
      screenOptions={({route, navigation}) => ({
        tabBarActiveTintColor: Colours.accentTwo,
        tabBarInactiveTintColor: Colours.accent,
        tabBarStyle: {
          height: 80,
          paddingTop: 10,
          paddingBottom: 10,
          backgroundColor: Colours.background
        },
        headerStyle: {
          backgroundColor: Colours.background,
          height: 120,
        },
        headerTitleStyle: {
          color: Colours.text,
          fontSize: 30,
        },
        headerTitle: () => {
          return (
            <View style={Styles.logoContainer}>
              <Image
                source={require("../assets/GrazeLogo.png")}
                style={Styles.logo}
              />
              <Text style={Styles.Grazegood}>
                GrazeGood
              </Text>
            </View>
          )
        },
        tabBarItemStyle: {
          justifyContent: "center",
          alignItems: "center"
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: 500,
        },
        headerShown: true,
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = "home";
          } else if (route.name === "Scan") {
            iconName = "barcode";
          } else if (route.name === "Saved") {
            iconName = "bookmark";
          } else if (route.name === "Profile") {
            iconName = "user";
          }
          return <FontAwesome name={iconName} size={size} color={color} />
        }
      })}
    >
      <Tab.Screen name="Home">
        {(props) => <HomeScreen {...props} setUser={setUser} />}
      </Tab.Screen>
      <Tab.Screen name="Scan" component={ScanScreen} />
      <Tab.Screen name="Saved" component={SavedScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}