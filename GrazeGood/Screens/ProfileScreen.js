import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

import Styles from "../styles/styles.js"
import Colours from "../styles/colours.js"
import { FontAwesome, FontAwesome5, FontAwesome6 } from "@expo/vector-icons";

export default function ProfileScreen({ setUser, navigation, setTabProfileImage }) {
  const [username, setUsername] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [scansLeft, setScansLeft] = useState(null);

  const API_BASE = "https://grazegood.onrender.com";

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const storedUsername = await AsyncStorage.getItem("username");
      if (!storedUsername) return;

      setUsername(storedUsername);

      const profileRes = await fetch(`${API_BASE}/user/${storedUsername}/profile`);
      const profileData = await profileRes.json();

      if (profileRes.ok) {
        setProfileImage(profileData.avatarUrl);
      }

      const scanRes = await fetch(`${API_BASE}/user/${storedUsername}/scans`);
      const scanData = await scanRes.json();

      if (scanRes.ok) {
        setIsPremium(scanData.isPremium);
        setScansLeft(scanData.scanCredits);
      }
    } catch (e) {
      console.log("Error loading profile", e);
    }
  }

  async function logOut() {
    await AsyncStorage.removeItem("username");
    setUser(null);
  }
  async function randomiseAvatar() {
    try {
      const res = await fetch(`${API_BASE}/user/${username}/randomise-avatar`, {
        method: "POST",
      });
      const data = await res.json();
      if(res.ok) {
        setProfileImage(data.avatarUrl);
        setTabProfileImage(data.avatarUrl);
      } else {
        console.log("Error randomising avatar: ", data?.error);
      }
  } catch (e) {
      console.log("Error randomising avatar: ", e);
  }
}
  async function toggleRenewal(value) {
    try {
        if(!username) return;

        const res = await fetch(`${API_BASE}/user/${username}/togglePremiumRenewal`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({autoRenew: value})
         })
         const data = await res.json();

         if(res.ok) {
             Toast.show({
                 type: "success",
                 text1: "Success",
                 text2: value ? "Renewal enabled successfully" : "Renewal disabled successfully",
                 visibilityTime: 2000
             })
         } else {
            console.log("Error toggling renewal: ", data?.error);
         }
        } catch (e) {
            console.log("Toggle renewal Error: ", e);
        }
    }

  return (
    <View style={Styles.StaticPage}>
      <Text style={Styles.Title}>Profile</Text>

      {profileImage && (
        <View style={Styles.ProfileImageContainer}>
            <Image
            source={{ uri: profileImage }}
            style={{
                width: 110,
                height: 110,
                borderRadius: 55,
                alignSelf: "center",
                position: "relative"
            }}
            />
            <TouchableOpacity
            activeOpacity={0.8}
            onPress={randomiseAvatar}
            style={Styles.randomiseButton}
            >
                <FontAwesome6 name="shuffle" size={20} color={Colours.text}/>
            </TouchableOpacity>
        </View>
      )}

      <Text style={Styles.ProductHead}>{username}</Text>

      <Text style={Styles.Premiumtext}>
        {isPremium ? "Premium Member" : "Free Account"}
      </Text>

      <View style={{flex: 1}}></View>
      <TouchableOpacity style={Styles.logoutButton} onPress={logOut}>
        <Text style={Styles.ButtonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}