import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import TodoListScreen from "./todo"; 
import ProfileScreen from "./profile";

export type BottomTabParamList = {
  ToDo: undefined;
  Profile: undefined;
};

//Create Bottom Tab Navigator
const Tab = createBottomTabNavigator<BottomTabParamList>();

const TodoNav: React.FC = () => {
  return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap = "help-circle"; // Default icon

            switch (route.name) {
              case "ToDo":
                iconName = "list";
                break;
              case "Profile":
                iconName = "person";
                break;
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "blue",
          tabBarInactiveTintColor: "gray",
          tabBarStyle: { backgroundColor: "#f8f8f8", paddingBottom: 5 },
          headerShown: false, // Hide header to make more space
        })}
      >
        <Tab.Screen name="ToDo" component={TodoListScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
  );
};

export default TodoNav;
