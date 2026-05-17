import React from "react";
import { View, Image, Text, TextInput, Alert, ActivityIndicator, TouchableOpacity, KeyboardAvoidingView, TouchableWithoutFeedback, Platform, Keyboard } from "react-native";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, {
  LinearTransition,
  FadeInLeft,
  FadeOutLeft,
  FadeOutRight,
  FadeInRight
} from 'react-native-reanimated';

import Colours from "../styles/colours.js"
import Styles from "../styles/styles.js"

export default function RegisterScreen( { navigation, setUser } ) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);

  const nextStep = () => {
    if (!canContinue()) return;
    setDirection(1);
    setStep((prev) => prev + 1);
  }
  const prevStep = () => {
    setDirection(-1);
    setStep((prev) => prev - 1);
  }

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
  function canContinue() {
    if (step === 1) {
      return username.trim().length > 0;
    }

    if (step === 2) {
      return (
        firstName.trim().length > 0 &&
        lastName.trim().length > 0
      );
    }

    if (step === 3) {
      return email.trim().length > 0;
    }

    if (step === 4) {
      return password.trim().length > 0;
    }

    return true;
  }
  function renderStep() {
  if (step === 0) {
    return (
      <>

        <Text style={[Styles.Title, { marginBottom: 0 }]}>Welcome to GrazeGood</Text>
        <View style={Styles.divider} />
        <Text style={[Styles.welcomeText, { fontWeight: "bold", fontSize: 20 }]}>
          Positive Environment, Positive Life
        </Text>
        <Text style={Styles.welcomeText}>Scan Products</Text>
        <Text style={Styles.welcomeText}>Understand Ingredients</Text>
        <Text style={Styles.welcomeText}>Make Better Choices</Text>
      </>
    );
  }

  if (step === 1) {
    return (
      <>
        <Text style={Styles.Title}>Choose a username</Text>
        <TextInput
          style={Styles.input}
          placeholder="Enter Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
      </>
    );
  }

  if (step === 2) {
    return (
      <>
        <Text style={Styles.Title}>What's your name?</Text>
        <TextInput
          style={Styles.input}
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          style={Styles.input}
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
        />
      </>
    );
  }

  if (step === 3) {
    return (
      <>
        <Text style={Styles.Title}>What's your email?</Text>
        <TextInput
          style={Styles.input}
          placeholder="Enter Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </>
    );
  }

  if (step === 4) {
    return (
      <>
        <Text style={Styles.Title}>Create a password</Text>
        <TextInput
          style={Styles.input}
          placeholder="Enter Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </>
    );
  }
}
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{flex: 1}}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={[Styles.StaticPage, { justifyContent: "center"}]}>
        <Animated.View
          key={step}
          layout={LinearTransition.springify()}
          entering={
            direction === 1
            ? FadeInRight.duration(400)
            : FadeInLeft.duration(400)
          }
          exiting={
            direction === 1
            ? FadeOutLeft.duration(300)
            : FadeOutRight.duration(300)
          }
          style={{width: "100%, alignItems: center"}}
        >
      <View style={Styles.InputContainer}>

          {renderStep()}
        <View style={{ flexDirection: "row", gap: 10 }}>
          {step > 0 && (
            <TouchableOpacity style={Styles.Button} onPress={prevStep}>
              <Text style={Styles.ButtonText}>Back</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[Styles.Button, !canContinue() && { opacity: 0.5 }]}
            onPress={step === 4 ? handleRegister : nextStep}
            disabled={!canContinue() ||loading}
          >
            <Text style={Styles.ButtonText}>
              {step === 4 ? "Register" : "Continue"}
            </Text>
          </TouchableOpacity>
        </View>

        {loading && <ActivityIndicator />}
      </View>

      <Text style={{ color: Colours.text, fontSize: 18, fontWeight: "bold", marginTop: 20, alignSelf: "center" }}>
        Already Have an Account?
      </Text>

      <TouchableOpacity
        style={[Styles.Button, { width: "30%", alignSelf: "center" }]}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={Styles.ButtonText}>Login</Text>
      </TouchableOpacity>
    </Animated.View>
    </View>
  </TouchableWithoutFeedback>
  </KeyboardAvoidingView>
  );
}