import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);

  // Fetch the user's email for display
  useEffect(() => {
    const fetchUserEmail = async () => {
      const storedEmail = await AsyncStorage.getItem("loggedInUserEmail");
      setEmail(storedEmail);
    };
    fetchUserEmail();
  }, []);

  // Fetch the user's name for display
  useEffect(() => {
    const fetchName = async () => {
      const storedName = await AsyncStorage.getItem("loggedInUser_name");
      setName(storedName);
    };
    fetchName();
  }, []);

  // Handle Logout
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

      {/* User Info (Left-aligned) */}
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.text}>{email}</Text>

        <Text style={styles.label}>Name:</Text>
        <Text style={styles.text}>{name}</Text>
      </View>

      {/* Logout Button at the Bottom */}
      <View style={styles.footer}>
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
    justifyContent: "space-between",
  },
  header: {
    alignItems: "center",
    marginTop: 50,
  },
  title: { 
    fontSize: 35, 
    fontWeight: "bold",
    fontFamily: "Courier New"
  },
  infoContainer: { 
    marginTop: 50,
    flex: 1, 
    paddingHorizontal: 30,
  },
  label: { 
    fontSize: 25, 
    fontWeight: "bold", 
    color: "black",
    marginBottom: 5,
    fontFamily: "Courier New",
  },
  text: { 
    fontSize: 18, 
    color: "black",
    marginBottom: 20,
    fontFamily: "Courier New",
    fontWeight: "bold"
  },
  footer: {
    alignItems: "center", 
    paddingBottom: 100,
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
  },
  logoutButtonText: { 
    fontSize: 20, 
    color: "white", 
    fontWeight: "bold",
    fontFamily: "Courier New"
  },
});

export default ProfileScreen;
