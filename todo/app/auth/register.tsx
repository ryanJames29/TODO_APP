import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, StatusBar, KeyboardAvoidingView, Platform, Image, ImageBackground } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CryptoJS from "crypto-js";

const RegisterScreen = () => {
  //State variables to store user registration input.
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const insets = useSafeAreaInsets();

  const handleGoBack = () => router.back();

  const handleSignUp = async () => {
    if (!fullName || !email || !password) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    try {
      //Hash the password for security
      const hashedPassword = CryptoJS.SHA256(password).toString();
      const newUser = { fullName, email, password: hashedPassword };

      //Retrieve existing users
      const existingUsers = await AsyncStorage.getItem("users");
      const usersArray = existingUsers ? JSON.parse(existingUsers) : [];

      //Check if email already exists
      if (usersArray.some(user => user.email === email)) {
        Alert.alert("Error", "An account with this email already exists.");
        return;
      }

      //Add new user and save to AsyncStorage
      usersArray.push(newUser);
      await AsyncStorage.setItem("users", JSON.stringify(usersArray));

      Alert.alert("Success", "Account Created!");
      router.push("/");

    } catch (error) {
      console.error("Error saving user data:", error);
      Alert.alert("Error", "An error occurred during account creation.");
    }
  };

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
            <Text style={styles.title}>Create Account</Text>

            <TextInput
              placeholder="Full Name"
              placeholderTextColor="#aaa"
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
            />
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

            <TouchableOpacity style={styles.button} onPress={handleSignUp}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleGoBack}>
              <Text style={styles.linkText}>Back to Login</Text>
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
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
    marginTop: 25,
    marginBottom: 25
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Courier New"
  },
  linkText: {
    color: "#007BFF",
    marginTop: 15,
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Courier New"
  },
  icon: {
    width: 120,
    height: 120,
    marginBottom: 40,
  },
});

export default RegisterScreen;
