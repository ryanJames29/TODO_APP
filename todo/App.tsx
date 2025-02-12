import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./app/auth/login"; 
import TodoNav from "./app/tabs/todoNav";

export type RootStackParamList = {
  Login: undefined;
  "tabs/todoNav": undefined;
  "auth/login": undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    //updated navigation container - allows for the bottom navigation once logged in
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="tabs/todoNav" component={TodoNav} options={{ headerShown: false }} />
        <Stack.Screen name="auth/login" component={LoginScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
