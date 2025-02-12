import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./app/auth/login"; 
import TodoNav from "./app/tabs/todoNav";
import { View, Platform, KeyboardAvoidingView } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context"; // ✅ Wrap the whole app

export type RootStackParamList = {
  Login: undefined;
  "tabs/todoNav": undefined;
  "auth/login": undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider> 
      <View style={{ flex: 1 }}>  
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="tabs/todoNav" component={TodoNav} options={{ headerShown: false }} />
            <Stack.Screen name="auth/login" component={LoginScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </SafeAreaProvider>
  );
}
