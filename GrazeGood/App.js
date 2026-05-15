import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import RootNavigator from "./navigation/RootNavigator";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import { BaseToast, ErrorToast, InfoToast } from "react-native-toast-message";
import Styles from "./styles/styles.js";
import Colours from "./styles/colours.js";
import {
  useFonts,
  Montserrat_700Bold,
  Montserrat_600SemiBold,
} from "@expo-google-fonts/montserrat";

const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: "#108A2C",
        backgroundColor: Colours.background,
        height: 100
      }}
      contentContainerStyle={{
        paddingHorizontal: 15,
      }}
      text1Style={{
        fontWeight: "bold",
        color: Colours.text,
      }}
      text2Style={{
        fontWeight: "bold",
        color: Colours.text,
      }}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: "#fa4437",
        backgroundColor: Colours.background,
        height: 100
      }}
      contentContainerStyle={{
        paddingHorizontal: 15,
      }}
      text1Style={{
        fontSize: 20,
        fontWeight: "bold",
        color: "#fa4437",
      }}
      text2Style={{
        fontSize: 16,
        fontWeight: "bold",
        color: "#fa4437",
      }}

    />
  ),
  info: (props) => (
    <InfoToast
      {...props}
      style={{
        borderLeftColor: "#108A2C",
        backgroundColor: Colours.background,
      }}
      contentContainerStyle={{
        paddingHorizontal: 15,
      }}
      text1Style={{
        fontSize: 20,
        fontWeight: "bold",
        color: Colours.text,
      }}
      text2Style={{
        fontSize: 16,
        fontWeight: "bold",
        color: Colours.text,
      }}
    />
  )
}
export default function App() {
    const [fontsLoaded] = useFonts({
    Montserrat_700Bold,
    Montserrat_600SemiBold,
  });

  if (!fontsLoaded) {
    return null;
  }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
      <Toast config={toastConfig} />
    </GestureHandlerRootView>
  );
}