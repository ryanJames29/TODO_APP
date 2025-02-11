import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { router } from "expo-router";
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CryptoJS from "crypto-js";

export default function RegisterScreen() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleGoBack = () => router.back(); // Go back to login

  const handleSignUp = async () => {
    if(!fullName || !email || !password){
      Alert.alert("Error", "Missing field data.");
      return;
    }

    try{
      const hashedPassword = CryptoJS.SHA256(password).toString();

      const userInformation = {fullName, email, password: hashedPassword};
      await AsyncStorage.setItem("user", JSON.stringify(userInformation));

      Alert.alert("Success", "Account Created!");
      router.push("/");
    } catch (error) {
      console.error("Error saving the user data:", error);
      Alert.alert("Error", "An Error Occurred during account creation");
    }
  }

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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 25,
  },
  input: {
    width: "80%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 12,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
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
  },
});
