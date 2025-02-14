import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);

  //Fetch the user's email for display
  useEffect(() => {
    const fetchUserEmail = async () => {
      const storedEmail = await AsyncStorage.getItem("loggedInUserEmail");
      setEmail(storedEmail);
    };
    fetchUserEmail();
  }, []);

  //Fetch the user's name for display
  useEffect(() => {
    const fetchName = async () => {
      const storedName = await AsyncStorage.getItem("loggedInUser_name");
      setName(storedName);
    };
    fetchName();
  }, []);

  //Handle Logout
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("loggedInUserEmail");
      router.push("/auth/login"); // Navigate to login screen
      console.log("User logged out.");
    } catch (error) {
      console.error("Error logging out:", error);
      Alert.alert("Error", "Failed to log out.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Profile title centered at the top */}
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      {/* User Info Box positioned towards the upper half */}
      <View style={styles.infoBox}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.text}>{name}</Text>

        <Text style={styles.label}>Email:</Text>
        <Text style={styles.text}>{email}</Text>

        {/* Logout Button - Adjusted to be very close to the bottom of the box */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 50,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: { 
    fontSize: 35, 
    fontWeight: "bold",
    fontFamily: "Courier",
  },
  infoBox: {
    width: "85%",
    backgroundColor: "#f5f5f5",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    paddingBottom: 10,
  },
  label: { 
    fontSize: 20, 
    fontWeight: "bold", 
    color: "black",
    marginBottom: 5,
    fontFamily: "Courier",
    textDecorationLine: "underline"
  },
  text: { 
    fontSize: 18, 
    color: "black",
    marginBottom: 15,
    fontFamily: "Courier",
    fontWeight: "bold"
  },
  logoutButton: { 
    backgroundColor: "red",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "black",
    width: "80%", 
    alignItems: "center",
    marginTop: 25,
  },
  logoutButtonText: { 
    fontSize: 20, 
    color: "white", 
    fontWeight: "bold",
    fontFamily: "Courier"
  },
});

export default ProfileScreen;
