import React, { useEffect, useState } from "react";
import { ActivityIndicator, View, Image, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import TabNavigator from "./TabNavigator";
import LoginScreen from "../Screens/LoginScreen";
import RegisterScreen from "../Screens/RegisterScreen";
import ProfileScreen from "../Screens/ProfileScreen";
import ProductScreen from "../Screens/ProductScreen";

import Styles from "../styles/styles.js";
import Colours from "../styles/colours.js";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const savedUser = await AsyncStorage.getItem("username");
        if (savedUser) {
          setUser(savedUser);
        }
      } catch (e) {
        console.log("Error loading user:", e);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return (
    <Stack.Navigator screenOptions={{ 
      headerShown: true,
      headerStyle: {
          backgroundColor: Colours.background,
          height: 120,
      },
      headerTitleStyle: {
          color: Colours.text,
          fontSize: 30,
      },
      headerBackVisible: true,
      headerBackButtonDisplayMode: "minimal",
      }}>
      {user ? (
        <>
          <Stack.Screen name="MainTabs"
          options={{headerShown: false}}
          >
            {(props) => <TabNavigator {...props} setUser={setUser} />}
          </Stack.Screen>

          <Stack.Screen name="Profile">
            {(props) => <ProfileScreen {...props} setUser={setUser} />}
          </Stack.Screen>
          <Stack.Screen
          options={{
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
            }
          }}
          name="Product" component={ProductScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login">
            {(props) => <LoginScreen {...props} setUser={setUser} />}
          </Stack.Screen>
          <Stack.Screen name="Register">
            {(props) => <RegisterScreen {...props} setUser={setUser} />}
          </Stack.Screen>
        </>
      )}
    </Stack.Navigator>
  );
}