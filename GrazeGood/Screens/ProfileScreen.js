import React from "react";
import { View, Text, TouchableOpacity, Image, Switch, ActivityIndicator, ScrollView } from "react-native";
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
  const [loading, setLoading] = useState(false);

  const [premiumStart, setPremiumStart] = useState(null);
  const [premiumEnd, setPremiumEnd] = useState(null);
  const [autoRenewal, setAutoRenewal] = useState(false);

  const API_BASE = "https://grazegood.onrender.com";

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      setLoading(true);
      const storedUsername = await AsyncStorage.getItem("username");
      if (!storedUsername) return;

      setUsername(storedUsername);

      const profileRes = await fetch(`${API_BASE}/user/${storedUsername}/profile`);
      const profileData = await profileRes.json();

      if (profileRes.ok) {
        setProfileImage(profileData.avatarUrl);
        setTabProfileImage(profileData.avatarUrl);
      }

      const scanRes = await fetch(`${API_BASE}/user/${storedUsername}/scans`);
      const scanData = await scanRes.json();

      if (scanRes.ok) {
        setIsPremium(scanData.isPremium);
        setScansLeft(scanData.scanCredits);
      }

      const premiumRes = await fetch(`${API_BASE}/user/${storedUsername}/premium`);
      const premiumData = await premiumRes.json();

      if (premiumRes.ok) {
        setIsPremium(premiumData.isPremium);
        setPremiumStart(premiumData.premiumStart);
        setPremiumEnd(premiumData.premiumEnd);
        setAutoRenewal(premiumData.autoRenew);
      }
    } catch (e) {
      console.log("Error loading profile", e);
    } finally {
      setLoading(false);
    }
  }
    async function buyPremium() {
    try {
        if (!username) return;

        const res = await fetch(`${API_BASE}/user/${username}/buyPremium`, {
        method: "POST",
        });

        const data = await res.json();

        if (res.ok) {
        setIsPremium(data.isPremium);
        setPremiumStart(data.premiumStart);
        setPremiumEnd(data.premiumEnd);
        setAutoRenewal(data.autoRenew);

        Toast.show({
            type: "success",
            text1: "Premium activated",
            text2: "You are now a premium member",
            visibilityTime: 2000,
        });
        } else {
        console.log("Error buying premium:", data?.error);
        }
    } catch (e) {
        console.log("Buy premium error:", e);
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
            setAutoRenewal(data.autoRenew);

             Toast.show({
                 type: "success",
                 text1: "Success",
                 text2: data.autoRenew ? "Renewal enabled successfully" : "Renewal disabled successfully",
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
    <ScrollView style={{flex: 1, width: "100%"}}
    contentContainerStyle={{alignItems: "center", paddingBottom: 20, flexGrow: 1, justifyContent: "space-between"}}>
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
            {isPremium && (
                <FontAwesome5 style={Styles.PremiumIcon} name="crown" size={20}/>
            )}
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


    {loading ? (
      <ActivityIndicator size="large" color={Colours.text} />        
    ) : isPremium? (
        <>
        <Text style={Styles.Premiumtext}>
            {isPremium ? "Premium Member" : "Free Account"}
        </Text>
        <View style={Styles.PremiumContainer}>
            <View style={Styles.DateContainer}>
                <Text style={Styles.MemberSinceText}>Member Since:</Text>
                <Text style={Styles.PremiumDate}>{new Date(premiumStart).toDateString()}</Text>
            </View>
            <View style={Styles.DateContainer}>
                <Text style={Styles.MemberSinceText}>{!autoRenewal ? "Premium Ends: " : "Will renew on: "}</Text>
                <Text style={Styles.PremiumDate}>{new Date(premiumEnd).toDateString()}</Text>
            </View>
            <View style={Styles.switchContainer}>
                <Text style={Styles.switchLabel}>Auto Renewal</Text> 
                <Switch value={autoRenewal} onValueChange={toggleRenewal}/>
            </View>
        </View>
        </>
    ) : (
        <View style={Styles.PremiumContainer}>
            <Text style={[Styles.Premiumtext, {fontSize: 20}]}>
                You are not a premium member
            </Text>
            <Text style={{fontSize: 16, textAlign: "center", color: Colours.text}}>Upgrade to premium to unlock all features</Text>
            <View style={Styles.benefitsContainer}>
                <Text style={Styles.benefit}>
                    <FontAwesome name="check" size={16} color={Colours.text}/>
                    Unlimited scans!
                </Text>
                <Text style={Styles.benefit}>
                    <FontAwesome name="check" size={16} color={Colours.text}/>
                    No Ads!
                </Text>
                <Text style={Styles.benefit}>
                    <FontAwesome name="check" size={16} color={Colours.text}/>
                    Nutriment Information
                </Text>
            </View>
            <Text style={Styles.text}>All of that for just £3.99 per month</Text>
            <TouchableOpacity style={[Styles.Button, {width: "50%", margin: "auto"}]} onPress={buyPremium}>
                <Text style={Styles.ButtonText}>Buy Premium</Text>
            </TouchableOpacity>
        </View>
    )}


      <View style={{flex: 1}}></View>
      <TouchableOpacity style={Styles.logoutButton} onPress={logOut}>
        <Text style={Styles.ButtonText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}