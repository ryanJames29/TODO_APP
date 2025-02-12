import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { router } from "expo-router"; // Import router for navigation
import AsyncStorage from "@react-native-async-storage/async-storage";
import CryptoJS from "crypto-js";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";  // ✅ Import RootStackParamList

export default function LoginScreen() {
  //states to store the email and passwords of the users.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  //handleLogin takes the text entry from the form and compares it with the async storage user data
  const handleLogin = async () => {
    try {
      // FOR DEV PURPOSES. SHOWS AVAILABLE ROUTES IF HAVING ROUTING ISSUES
      console.log("Available Routes:", navigation.getState());

      const users = await AsyncStorage.getItem("users"); // ✅ Retrieve all stored users
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

      {/* Clear Storage Button for Development Purposes */}
      <TouchableOpacity style={styles.clearButton} onPress={clearStorage}>
        <Text style={styles.clearButtonText}>Clear Storage (Dev)</Text>
      </TouchableOpacity>

      {/* Link under the button */}
      <TouchableOpacity onPress={handleRegister}>
        <Text style={styles.linkText}>Create Account</Text>
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
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#0056b3",
    alignItems: "center",
    width: "80%",
    marginTop: 25,
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
