import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { router } from "expo-router"; // Import router for navigation
import AsyncStorage from "@react-native-async-storage/async-storage";
import CryptoJS from "crypto-js";

export default function LoginScreen() {
  //states to store the email and passwords of the users.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  /*
    handleLogin takes the text entry from the form and compares it with
    the async storage user data
  */
  const handleLogin = async () => {
    try {
      const getUser = await AsyncStorage.getItem("user");

      //error handling for if the user doesnt exist.
      if (!getUser) {
        Alert.alert("Error", "User does not exist. Please create an account");
        return;
      }

      //parse the user data to get the email and hashed password.
      const userData = JSON.parse(getUser);
      const hashedInputPassword = CryptoJS.SHA256(password).toString();

      //confirm that the email and password are correct. Route accordingly
      if (userData.email === email && userData.password === hashedInputPassword) {
        router.push("/tabs/todo");
      } else {
        Alert.alert("Error", "Incorrect email or password");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      Alert.alert("Error", "Something went wrong.");
    }
  };

  //Routes to register screen
  const handleRegister = () => {
    router.push("/auth/register"); // Navigate to Register screen
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

  //the form displayed on the screen. Sets user information entered on click
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput 
        placeholder="Email" 
        style={styles.input} 
        value={email}
        onChangeText={setEmail}
      />
      <TextInput 
        placeholder="Password" 
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

      {/* 🔹 Clear Storage Button for Development Purposes */}
      <TouchableOpacity style={styles.clearButton} onPress={clearStorage}>
        <Text style={styles.clearButtonText}>Clear Storage (Dev)</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 4,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    color: "black",
    marginBottom: 25,
    fontWeight: "bold",
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
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#0056b3",
    alignItems: "center",
    width: "80%",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  linkText: {
    color: "#007BFF",
    fontSize: 16,
    marginTop: 15,
    textDecorationLine: "underline",
  },
  clearButton: {
    marginTop: 30,
    backgroundColor: "red", // Red to indicate it's a destructive action
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
});
