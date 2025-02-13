import React, { useState } from "react";
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, StatusBar, KeyboardAvoidingView, Platform, Image, ImageBackground } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CryptoJS from "crypto-js";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";  

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Get safe area insets
  const insets = useSafeAreaInsets();

  //handleLogin takes the text entry from the form and compares it with the async storage user data
  const handleLogin = async () => {
    try {
      // FOR DEV PURPOSES. SHOWS AVAILABLE ROUTES IF HAVING ROUTING ISSUES
      console.log("Available Routes:", navigation.getState());

      const users = await AsyncStorage.getItem("users"); 
      if (!users) {
        Alert.alert("Error", "No registered users found.");
        return;
      }

      const usersArray = JSON.parse(users);
      const foundUser = usersArray.find(user => user.email === email);

      if (!foundUser) {
        Alert.alert("Error", "User not found.");
        return;
      }

      const hashedInputPassword = CryptoJS.SHA256(password).toString();
      if (foundUser.password !== hashedInputPassword) {
        Alert.alert("Error", "Incorrect password.");
        return;
      }

      //Both are used to populate the profile screen with the user information
      await AsyncStorage.setItem("loggedInUserEmail", foundUser.email);
      await AsyncStorage.setItem("loggedInUser_name", foundUser.fullName);
      console.log("Logged in user:", foundUser);

      //Navigate to the main app screen
      navigation.navigate("tabs/todoNav");

    } catch (error) {
      console.error("Error during login:", error);
      Alert.alert("Error", "Something went wrong.");
    }
  };

  //Routes to register screen => May need to change to navigate instead
  const handleRegister = () => {
    router.push("/auth/register");
  };

  //Clear AsyncStorage for development (removes all stored user data)
  const clearStorage = async () => {
    try {
      await AsyncStorage.clear();
      console.log("All AsyncStorage data cleared!");
      Alert.alert("Success", "All user data has been erased!");
    } catch (error) {
      console.error("Error clearing AsyncStorage:", error);
      Alert.alert("Error", "Failed to clear user data.");
    }
  };

  //The form displayed on the screen. Sets user information entered on click
  return (
    <ImageBackground
      source={require("../../components/ui/8573.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" translucent backgroundColor="black" />
      <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <View style={styles.container}>
          <Image source={require("../../components/ui/icon.png")} style={styles.icon} resizeMode="contain" />
          <Text style={styles.header}>To-Do App</Text>
          <Text style={styles.title}>Login</Text>

            <TextInput 
              placeholder="Email" 
              placeholderTextColor="#aaa"
              style={styles.input} 
              value={email}
              onChangeText={setEmail}
            />
            <TextInput 
              placeholder="Password" 
              placeholderTextColor="#aaa"
              style={styles.input} 
              secureTextEntry 
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            {/* Link under the button */}
            <TouchableOpacity onPress={handleRegister}>
              <Text style={styles.linkText}>Create Account</Text>
            </TouchableOpacity> 

            {/* Clear Storage Button for Development Purposes */}
            <TouchableOpacity style={styles.clearButton} onPress={clearStorage}>
              <Text style={styles.clearButtonText}>Clear Storage (Dev)</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
      </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "black",
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: "center",
  },
  header: {
    fontSize: 35,
    color: "white",
    marginBottom: 20,
    fontWeight: "bold",
    fontFamily: "Courier New"
  },
  title: {
    fontSize: 24,
    color: "white",
    marginBottom: 40,
    fontWeight: "bold",
    fontFamily: "Courier New"
  },
  input: {
    width: "80%",
    padding: 10,
    borderWidth: 2,
    borderColor: "#555",
    borderRadius: 10,
    marginBottom: 25,
    color: "white",
    backgroundColor: "#222",
    fontFamily: "Courier New",
    fontWeight: "bold"
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#0056b3",
    alignItems: "center",
    width: "80%",
    marginTop: 25,
    marginBottom: 25
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "Courier New"
  },
  linkText: {
    color: "#007BFF",
    fontSize: 16,
    marginTop: 15,
    fontFamily: "Courier New",
    fontWeight: "bold",
  },
  clearButton: {
    marginTop: 30,
    backgroundColor: "red",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "darkred",
    alignItems: "center",
    width: "80%",
  },
  clearButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  icon: {
    width: 120,
    height: 120,
    marginBottom: 40,
  },
});

export default LoginScreen;
