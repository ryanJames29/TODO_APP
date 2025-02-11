import { View, Text } from 'react-native';

export default function TestScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "white" }}>
      <Text style={{ fontSize: 24, color: "red" }}>🚀 Debug: Test Screen Loaded</Text>
    </View>
  );
}