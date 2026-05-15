
import React, { useState, useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, ActivityIndicator, Image, TouchableOpacity, ScrollView, Linking } from 'react-native';
import {CameraView, useCameraPermissions} from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';

import Colours from '../styles/colours.js';
import Styles from '../styles/styles.js';

export default function ScanScreen( { navigation } ) {
  const scanLock = useRef(false);
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [ecoScore, setEcoScore] = useState(null);
  const [ecoReason, setEcoReason] = useState(null);

  const [scansLeft, setScansLeft] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [adsLeft, setAdsLeft] = useState(5);
  const [canScan, setCanScan] = useState(true);

  const [lastBarcode, setLastBarcode] = useState(null);
  const [savedBy, setSavedBy] = useState(null);
  const [saving, setSaving] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);

useEffect(() => {
  pingAPI();

  (async () => {
    const username = await AsyncStorage.getItem("username");
    setSavedBy(username);
    if (!username) return;

    loadScanData(username);
  })();
}, []);

  const API_BASE = "https://grazegood.onrender.com";

  async function loadScanData(username) {
    try {
      const res = await fetch(`${API_BASE}/user/${username}/scans`);
      const data = await res.json();

      if (res.ok) {
        setScansLeft(data.scanCredits);
        setIsPremium(data.isPremium);
        setAdsLeft(5 - data.adsWatchedToday?? 0);
      } else {
        console.log("Error loading scans:", data?.error);
      }
    } catch (e) {
      console.error("Error getting scans:", e);
    }
  }
  async function pingAPI() {
    const res = await fetch(`${API_BASE}/health`);
    const data = await res.json();
    console.log(data);
  }
  async function DeviceId() {
    const existing = await AsyncStorage.getItem("deviceId");
    if(existing) return existing;

    const newId = `device-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    await AsyncStorage.setItem("deviceId", newId);
    return newId;
  }

async function saveProduct() {
  if (!product || !lastBarcode || !savedBy) {
    Toast.show({
      type: "error",
      text1: "Error",
      text2: "Missing required fields",
      visibilityTime: 2000,
    });
    return;
  }

  setSaving(true);

  try {
    const res = await fetch(`${API_BASE}/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        savedBy,
        barcode: lastBarcode,
        productName: product.product_name ?? null,
        brands: product.brands ?? null,
        imageUrl: product.image_front_small_url ?? null,
        nutriments: product.nutriments ?? null,
        nutrition_grades: product.nutrition_grades ?? null,
        ingredients: product.ingredients ?? [],
        ingredients_text: product.ingredients_text ?? null,
        ingredients_language: product.ingredients_language ?? product.ingredients_lc ?? product.lang ?? null,
        additives_tags: product.additives_tags ?? [],
        nova_group: product.nova_group ?? product.nutriments?.["nova-group"] ?? null,
        packaging_tags: product.packaging_tags ?? [],
        countries_tags: product.countries_tags ?? [],
        manufacturing_places: product.manufacturing_places ?? null,
        categories_tags: product.categories_tags ?? [],
        eco: {
          ecoScore,
          ecoReason,
        },
      }),
    });

    const data = await res.json();

    if (res.ok) {
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Product saved",
        visibilityTime: 2000,
      });
      console.log("Saved:", data);
    } else {
      Toast.show({
        type: "info",
        text1: "Info",
        text2: data?.error ?? "Unknown error",
        visibilityTime: 2000,
      });
      console.log("Save Error:", data?.error);
    }
  } catch (e) {
    Toast.show({
      type: "error",
      text1: "Error",
      text2: e?.message ?? "Network error",
      visibilityTime: 2000,
    });
    console.log("Save Error:", e);
  } finally {
    setSaving(false);
  }
}
function GetEcoIndicator(score) {
  if(score <=30) {
    return (
      <Text>
        <FontAwesome name='dot-circle-o' size={24} color='red'/>
      </Text>
    )
  }
  if(score <=70 && score > 30) {
    return (
      <Text>
        <FontAwesome name='dot-circle-o' size={24} color= {Colours.medium}/>
      </Text>
    )
  }
  if(score > 70) {
    return (
      <Text>
        <FontAwesome name='dot-circle-o' size={24} color='green'/>
      </Text>
    )
  }
  if(score == null) {
    return (
      <Text>
        <FontAwesome name='dot-circle-o' size={24} color='white'/>
      </Text>
    )
  }
}
async function rewardScans() {
  try {
    const rewardRes = await fetch(`${API_BASE}/user/${savedBy}/rewardScans`,{
      method: "POST",
    })
    const rewardData = await rewardRes.json();

    if(rewardRes.ok) {
      setScansLeft(rewardData.scanCredits)
      setIsPremium(rewardData.isPremium)
      setAdsLeft(5 - rewardData.adsWatchedToday?? 0)
      
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "5 scans rewarded",
        visibilityTime: 2000,
      })
    } else {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: rewardData?.error ?? "Could Not Reward Scans",
        visibilityTime: 2000,
      })
    }
  } catch (e) {
    console.log("Reward scan Error:", e);
  }
}
async function fetchProduct(productCode) {
  setLoading(true);
  setError(null);
  setProduct(null);
  setEcoScore(null);
  setEcoReason(null);

  try {
    const res = await fetch(`${API_BASE}/product/${encodeURIComponent(productCode)}`);
    const data = await res.json();

    if (res.ok) {
      setCanScan(true);
      setProduct(data);
      setEcoScore(data.eco?.ecoScore ?? null);
      setEcoReason(data.eco?.ecoReason ?? null);
      setCameraOpen(false);
      const scanRes = await fetch(`${API_BASE}/user/${savedBy}/useScan`,{
        method: "POST",
      })
      const scanData = await scanRes.json();

      if(scanRes.ok) {
        await loadScanData(savedBy);

      } else {
        console.log("Error loading Scans: ", scanData?.error);
      }
    } else {
      setCanScan(true);
      setProduct(null);
      setEcoScore(null);
      setEcoReason(null);
      setError(data?.error ?? "Not found");
    }
  } catch (e) {
    console.log(e);
    setProduct(null);
    setEcoScore(null);
    setEcoReason(null);
    setError("Network error");
  } finally {
    setLoading(false);
  }
}
  
  const handleScan = ({ data }) => {
    if (scanLock.current) return;
    scanLock.current = true;

    setScanned(true);
    setCanScan(false);
    setLastBarcode(data);
    fetchProduct(data);
  };

  let confidenceMessage = null;

  const confidence = product?.eco?.confidence;
  if (confidence >= 70) {
    confidenceMessage = "High confidence";
  } else if (confidence >= 40) {
    confidenceMessage = "Some environmental data unavailable";
  } else if (confidence != null) {
    confidenceMessage = "EcoScore estimated from limited data";
  }

  if(!permission) return <Text>Requesting camera permission</Text>
  if(!permission.granted) {
    return (
      <View style={Styles.StaticPage}>
            <View style={Styles.prePermissionContainer}>
              <Text style={Styles.prePermissionText}>
                GrazeGood needs camera access to scan products. Please grant camera permission to use the scanning feature.
              </Text>
              <TouchableOpacity style={Styles.Button} 
              onPress={async () => {
                if(permission?.canAskAgain === false) {
                  Linking.openSettings();
                  return;
                }
                const result = await requestPermission();

                if (!result.granted) {
                  Toast.show({
                    type: "error",
                    text1: "Camera Permission Needed",
                    text2: "Please allow camera access",
                    visibilityTime: 2000,
                  })
                }
              }}>
                <Text style={Styles.ButtonText}>Allow Camera Access</Text>
              </TouchableOpacity>
            </View>
      </View>
    )
  }
  return (
    <View style={Styles.StaticPage}>
      <StatusBar style="auto" />

      {cameraOpen ? (
        <>
        {!isPremium && (
          <View style={styles.scanCountContainer}>
            <View style={styles.adBadge}>
              <Text style={styles.adsLeft}>{adsLeft ?? "..."}</Text>
            </View>
              <TouchableOpacity
                style={styles.watchAdsBtn}
                onPress = { () => {
                  rewardScans()
                }}
              >
                <FontAwesome5 name="ad" size={30} color={Colours.button} />
              </TouchableOpacity>
              {!isPremium ? (
                <Text style={styles.ScanCounter}>Scans Left: {scansLeft ?? "..."}</Text>
              ) : (
                <Text style={styles.ScanCounter}>Unlimited Scans</Text>
              )}
            </View>
        )}
        <>
          <View style={styles.cameraWrapper}>
            <CameraView
              style={styles.Camera}
              barcodeScannerSettings={{
                barcodeTypes: ["ean13", "ean8", "upc_a", "upc_e"],
              }}
              onBarcodeScanned={scanned || !canScan ? undefined : handleScan}
            />
          </View>
          </>
          </>
      ) : product ? (
        <View style={styles.scanAgainContainer}>
          <TouchableOpacity
            style={[styles.scanAgainButton, {marginVertical: 20}]}
            onPress={() => {
              setCameraOpen(true);
              setScanned(false);
              setProduct(null);
              setError(null);
              scanLock.current = false;
              setScanned(false);
              setCanScan(true);
              setEcoScore(null);
              setEcoReason(null);
            }}
          >
            <Text style={Styles.ButtonText}>Scan Another Product</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View>
            <View style={styles.scanHeaderContainer}>
              <Text style={Styles.Title}>Scan a Product</Text>
              {!isPremium && (
                <View style={styles.adCountContainer}>
                  <View style={styles.adButtonWrapper}>
                    <TouchableOpacity style={styles.watchAdsBtnClosed} onPress={rewardScans}>
                      <FontAwesome5 name="ad" size={30} color={Colours.button} />
                    </TouchableOpacity>

                    <View style={styles.adBadge}>
                      <Text style={styles.adBadgeText}>{adsLeft ?? "..."}</Text>
                    </View>
                  </View>
                </View>
              )}
            </View>
          </View>

          <View style={Styles.SubContainer}>
            <Text style={[Styles.text, {marginTop: 20}]}>
              Scan a product to check how good it is for you and the environment!
            </Text>
            <Text style={Styles.text}>
              Hit the save button to save your products and review them later in the Saved tab
            </Text>
            <Text style={Styles.text}>
              The higher the eco score, the better for you and the environment!
            </Text>
            <Text style={Styles.text}>
              To start scanning, click the button below
            </Text>
            {!isPremium && (
              <>
                <Text style={Styles.text}>
                  Please Note, you get 5 scans per day and need to watch ads to get more
                </Text>
                <Text style={[Styles.text, styles.lastText]}>
                  Buy premium to get unlimited scans <TouchableOpacity onPress={() => navigation.navigate("Premium")}><Text style={styles.premiumNav}>here</Text></TouchableOpacity>
                </Text>
            </>
            )}
          </View>
          <View style={styles.openScannerContainer}>
            {!isPremium ? (
              <Text style={styles.scanCountClosed}>Scans Left: {scansLeft ?? "..."}</Text>
            ): (
              <Text style={styles.scanCountClosed}>Unlimited Scans</Text>
            )}

            <TouchableOpacity
              style={styles.openScannerButton}
              onPress={async () => {
                if (!isPremium && scansLeft !== null && scansLeft <= 0) {
                  Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'You have reached your scan limit, watch an ad to get more!',
                    visibilityTime: 2000
                  });
                  return;
                }

                if (savedBy) {
                  await loadScanData(savedBy);
                }

                scanLock.current = false;
                setCanScan(true);
                setCameraOpen(true);
                setScanned(false);
                setProduct(null);
                setError(null);
                setEcoScore(null);
                setEcoReason(null);
              }}
            >
              <Text style={Styles.ButtonText}>Open Scanner</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
  
    {cameraOpen && (
      <>
        <TouchableOpacity
          style={styles.closeButtonScanner}
          onPress={() => {
            setCameraOpen(false);
            setScanned(false);
            setProduct(null);
            setError(null);
            setEcoScore(null);
            setEcoReason(null);
          }}
        >
          <Text style={Styles.ButtonText}>Close Scanner</Text>
        </TouchableOpacity>
      </>
    )}

      {loading && <ActivityIndicator />}
      {error && <Text style={{color: 'red'}}>{error}</Text>}
      {product ? (
        <ScrollView
          style={{flex: 1, width: "100%"}}
          contentContainerStyle={{
            alignItems: "center",
            paddingBottom: 40
          }}
          showsVerticalScrollIndicator={false}
        >
        <TouchableOpacity
        activeOpacity={0.8}
        style={{width: "85%", margin: "auto"}}
        onPress={() => {
          navigation.navigate("Product", { barcode: lastBarcode });
        }}
        >
        <View style={Styles.ScannedInfo}>
          <Text style={Styles.ProductHead}>
            {(product.product_name ?? "Unknown").replace(/&quot;|&#039;/g, "'")}
          </Text>

          <Text style={[Styles.ProductHead, {marginBottom: 10}]}>
            {product.brands ?? "Unknown"}
          </Text>

          {ecoScore !== null && (
            <>
            <View style={Styles.divider}></View>
              <Text style={[Styles.ProductHead]}>Eco Score: {ecoScore} {GetEcoIndicator(ecoScore)}</Text>
            </>
          )}

          {ecoReason && ecoReason.length > 0 && (
            <>
              <View style={Styles.divider}></View>

              {ecoReason.map((flag, index) => (
                <Text key={index} style={[
                  Styles.EcoReason,
                  flag.impact === "low" ? {color: Colours.low} :
                  flag.impact === "medium" ? {color: Colours.medium} :
                  {color: Colours.high}
                ]}>
                {flag.message}
                </Text>
              ))}
              {confidenceMessage && (
                <Text style={Styles.EcoConfidence}>
                  {confidenceMessage}
                </Text>
              )}
            </>
          )}

          {product.image_front_small_url ? (
            <Image
              source={{ uri: product.image_front_small_url }}
              style={{ width: 200, height: 200 }}
            />
          ) : (
            <Image
              source={require("../assets/product-placeholder.jpg")}
              style={{ width: 200, height: 200 }}  
            />
          )}
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              saveProduct()
            }}
            style={Styles.Button}
            disabled={saving}
          >
            <Text style={Styles.ButtonText}>Save Product</Text>
          </TouchableOpacity>
        </View>
        </TouchableOpacity>
        </ScrollView>
      ) : null}
      {/* </ScrollView> */}
    </View>
  );
}

const styles = StyleSheet.create({
  lastText: {
    marginTop: 50,
  },
  openScannerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  openScannerButton: {
    backgroundColor: Colours.button,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  scanAgainContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanAgainButton: {
    backgroundColor: Colours.button,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: 'center',
  },
  closeButtonScanner: {
    backgroundColor: Colours.button,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
    width: "50%",
    alignSelf: "center",
  },
  cameraWrapper: {
    flex: 1,
    width: "100%",
    height: "75%",
    borderRadius: 10,
    overflow: "hidden",
  },
  Camera: {
    height: "100%",
    width: "100%",
    borderRadius: 10,
  },
  ScanCounter: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: Colours.text,
    borderRadius: 10,
    width: "50%",
    margin: "auto",
    padding: 5,
  },
  scanCountContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  watchAdsBtn: {
    padding: 5,
    backgroundColor: "#108A2C",
    borderRadius: 10,
    marginTop: 10,
    marginVertical: 10,
    position: "absolute",
    right: 0,
    bottom: 0
  },
  adButtonWrapper: {
    position: "relative",
    width: 52,
    height: 52,
    overflow: "visible",
  },
  adBadge: {
    width: 24,
    height: 24,
    borderRadius: 14,
    backgroundColor: "#FF3B30",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: -2,
    top: -2,
    zIndex: 10,
    elevation: 10,
  },
  adBadgeText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    lineHeight: 16,
  },
  premiumNav: {
    fontSize: 20,
    fontWeight: "bold",
    color: "blue",
  },
  scanHeaderContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: 'relative',
  },
  adCountContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 10,
    top: 13
  },
  watchAdsBtnClosed: {
    width: 52,
    height: 52,
    backgroundColor: "transparent",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  scanCountClosed: {
    color: Colours.text,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 'auto'
  },
  prePermissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  prePermissionText: {
    color: Colours.text,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
});
