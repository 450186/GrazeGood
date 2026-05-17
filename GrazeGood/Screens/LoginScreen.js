import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Colours from "../styles/colours.js";
import Styles from "../styles/styles.js";

export default function LoginScreen({ navigation, setUser }) {
  const [username, setUsernameLocal] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const API_BASE = "https://grazegood.onrender.com";

  async function handleLogin() {
    if (!username || !password) {
      Alert.alert("Missing fields", "Please enter username and password.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await res.json();
      console.log("LOGIN RESPONSE:", data);

      if (res.ok) {
        await AsyncStorage.setItem("username", data.user.username);
        setUser(data.user.username);
      } else {
        Alert.alert("Login failed", data?.error ?? "Login failed");
      }
    } catch (e) {
      console.log("Login error:", e);
      Alert.alert("Error", "Network error");
    } finally {
      setLoading(false);
    }
  }

return (
  <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    keyboardVerticalOffset={80}
  >
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[Styles.StaticPage, { justifyContent: "center" }]}>
        <View style={Styles.InputContainer}>
          <TextInput
            style={Styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsernameLocal}
            autoCapitalize="none"
            returnKeyType="next"
          />

          <TextInput
            style={Styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            returnKeyType="done"
            onSubmitEditing={Keyboard.dismiss}
          />

          <TouchableOpacity style={Styles.Button} onPress={handleLogin}>
            <Text style={Styles.ButtonText}>
              {loading ? "Loading..." : "Login"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: 12 }}>
          <Text style={{ color: Colours.text, fontSize: 18, fontWeight: "bold", alignSelf: "center" }}>
            Don't have an account?
          </Text>

          <TouchableOpacity
            style={[Styles.Button, { width: "30%", alignSelf: "center" }]}
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={Styles.ButtonText}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  </KeyboardAvoidingView>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#C3B59F",
  },
  InputContainer: {
    borderRadius: 10,
    padding: 20,
    backgroundColor: "#2D4739",
    width: "80%",

    shadowColor: "#000",
    shadowOffset: {
      width: 5,
      height: 5
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,

    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: 200,
    height: 40,
    margin: 12,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: "#d3c5b0ff",
  },
  loginBtn: {
    backgroundColor: '#108A2C',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    margin: 15
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  }
});