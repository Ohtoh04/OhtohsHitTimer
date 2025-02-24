// SettingsScreen.tsx
import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { useTheme } from '@/context/theme-context';

const SettingsScreen = () => {
  const { theme, setTheme } = useTheme();

  return (
    <View style={styles.container}>
      <Button
        title="Light Theme"
        onPress={() => setTheme('light')}
      />
      <Button
        title="Dark Theme"
        onPress={() => setTheme('dark')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SettingsScreen;