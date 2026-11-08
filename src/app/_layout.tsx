import { DarkTheme, DefaultTheme, ThemeProvider, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: 'Skincare Checker',
            headerStyle: { backgroundColor: '#F1F8F1' },
            headerTintColor: '#2E7D32',
          }}
        />
        <Stack.Screen
          name="explore"
          options={{
            title: 'Daftar Bahan',
            headerStyle: { backgroundColor: '#F1F8F1' },
            headerTintColor: '#2E7D32',
          }}
        />
        <Stack.Screen
          name="ingredient-search"
          options={{
            title: 'Pencarian Bahan API',
            headerStyle: { backgroundColor: '#F1F8F1' },
            headerTintColor: '#2E7D32',
          }}
        />
        <Stack.Screen
          name="api-test"
          options={{
            title: 'Test API & Promise',
            headerStyle: { backgroundColor: '#F1F8F1' },
            headerTintColor: '#2E7D32',
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}