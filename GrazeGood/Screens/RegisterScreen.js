import React from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator, TouchableOpacity } from "react-native";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Colours from "../styles/colours.js"
import Styles from "../styles/styles.js"

export default function RegisterScreen( { navigation, setUser } ) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const API_BASE = "https://grazegood.onrender.com";
  async function handleRegister() {
    if(!username || !password || !firstName || !lastName || !email) {
      Alert.alert("Missing required fields");
      return;
    }
    setLoading(true);

    try {
      console.log("Sending register request");
      const res = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          firstName,
          lastName,
          email
        })
      })

      const data = await res.json();

      if (res.ok) {
        const savedUser = await AsyncStorage.setItem("username", data.user.username);
        if(savedUser) {
          setUser(data.user.username);
        }
      } else {
        Alert.alert("Error", data?.error ?? "Registration failed");
      }
    } catch (e) {
      console.log("Registration Error:", e);
      Alert.alert("Error: ", "Network error");
    } finally {
      setLoading(false);
    }
  }
  return (
    <View style={Styles.StaticPage}>

    <View style={Styles.InputContainer}>
      <Text style={Styles.Title}>Enter Your Details</Text>
      <TextInput
      style={Styles.input}
      placeholder="Enter Username"
      value={username}
      onChangeText={setUsername}
      autoCapitalize="none"
      />

      <TextInput
      style={Styles.input}
      placeholder="Enter First Name"
      value={firstName}
      onChangeText={setFirstName}
      />

      <TextInput
      style={Styles.input}
      placeholder="Enter Last Name"
      value={lastName}
      onChangeText={setLastName}
      />

      <TextInput
      style={Styles.input}
      placeholder="Enter Email"
      value={email}
      onChangeText={setEmail}
      keyboardType="email-address"
      />

      <TextInput
      style={Styles.input}
      placeholder="Enter Password"
      value={password}
      onChangeText={setPassword}
      secureTextEntry={true}
      />

      <TouchableOpacity
      style={Styles.Button}
      onPress={handleRegister}
      >
        <Text style={Styles.ButtonText}>Register</Text>
      </TouchableOpacity>
      </View>
      <Text 
      style={{ color: Colours.text, fontSize: 18, fontWeight: "bold", marginTop: 20, alignSelf: "center" }}
      >
        Already Have an Account?
      </Text>
      <TouchableOpacity
      style={[Styles.Button, { width: "40%", alignSelf: "center" }]}
      onPress={() => navigation.navigate("Login")}
      >
        <Text style={Styles.ButtonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#C3B59F",
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: "#A0AF84",
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
  registerBtn: {
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
})