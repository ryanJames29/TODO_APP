import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { router } from "expo-router";
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CryptoJS from "crypto-js";

export default function RegisterScreen() {
  //State variables to store user registration input.
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
      const userExists = usersArray.some(user => user.email === email);
      if (userExists) {
        Alert.alert("Error", "An account with this email already exists.");
        return;
      }

      //Add new user to the array and save back to AsyncStorage
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
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <TextInput
        placeholder="Full Name"
        style={styles.input}
        placeholderTextColor="#333"
        value={fullName}
        onChangeText={setFullName}
      />
      <TextInput
        placeholder="Email"
        style={styles.input}
        placeholderTextColor="#333"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        placeholderTextColor="#333"
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    color: "black",
    marginBottom: 50,
    fontWeight: "bold",
    paddingTop: 50,
  },
  input: {
    width: "80%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 25,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 12,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
    marginTop: 25,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  linkText: {
    color: "#007BFF",
    marginTop: 15,
    textDecorationLine: "underline",
    fontSize: 16,
  },
});
