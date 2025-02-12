import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";  // ✅ Import RootStackParamList
import { router } from "expo-router"; // Import router for navigation

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);

  //Fetch the Name and email of the user for population on profile
  useEffect(() => {
    const fetchUserEmail = async () => {
      const storedEmail = await AsyncStorage.getItem("loggedInUserEmail");
      setEmail(storedEmail);
    };
    fetchUserEmail();
  }, []);

  useEffect(() => {
   const fetchName = async () => {
    const storedName = await AsyncStorage.getItem("loggedInUser_name");
    setName(storedName);
   };
   fetchName();
  }, []);

  const handleLogout = async () => {
    try {
      //remove the user once logged out to keep it clean
      await AsyncStorage.removeItem("loggedInUserEmail");
      router.push("/auth/login"); //Navigate back to the login screen. - Again, may need to change to navigate
      console.log("User logged out.");
    } catch (error) {
      console.error("Error logging out:", error);
      Alert.alert("Error", "Failed to log out.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.text}>Email: {email}</Text>
      <Text style={styles.text}>Name: {name}</Text>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "white" },
  title: { fontSize: 24, marginBottom: 10, fontWeight: "bold" },
  text: { fontSize: 18, marginBottom: 20 },
  logoutButton: { backgroundColor: "red", padding: 10, borderRadius: 5 },
  logoutButtonText: { fontSize: 18, color: "white", fontWeight: "bold" },
});

export default ProfileScreen;
