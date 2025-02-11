import { Redirect } from "expo-router";

export default function Index() {
  return <Redirect href="/auth/login" />;  // Change to an actual screen you have
}