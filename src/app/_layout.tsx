import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useColorScheme } from "react-native";

import { AnimatedSplashOverlay } from "@/components/animated-icon";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: "Skincare Checker",
            headerStyle: { backgroundColor: "#F1F8F1" },
            headerTintColor: "#2E7D32",
          }}
        />
        <Stack.Screen
          name="explore"
          options={{
            title: "Riwayat",
            headerStyle: { backgroundColor: "#F1F8F1" },
            headerTintColor: "#2E7D32",
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
