import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { PreferencesProvider } from './context/PreferencesContext';
import { RootNavigator } from './navigation/RootNavigator';
import { colors } from './theme';

export default function App() {
  return (
    <PreferencesProvider>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <SafeAreaView style={styles.root}>
        <RootNavigator />
      </SafeAreaView>
    </PreferencesProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
