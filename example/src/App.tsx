import { Button, StyleSheet, Text, View } from 'react-native';
import {
  AppNavigation,
  useNavigation,
  type ScreenProps,
} from '@nameisjayant/react-native-navigation';

type RootParamList = {
  Home: undefined;
  Profile: { userId: string };
};

function Home({ navigation }: ScreenProps<RootParamList, 'Home'>) {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Home</Text>
      <Button
        title="Open profile"
        onPress={() => navigation.navigate('Profile', { userId: '42' })}
      />
    </View>
  );
}

function Profile({ route }: ScreenProps<RootParamList, 'Profile'>) {
  return (
    <View style={[styles.screen, styles.profile]}>
      <Text style={styles.title}>Profile of user {route.params.userId}</Text>
      <ProfileActions />
    </View>
  );
}

// Any nested component can reach the navigator through the hook.
function ProfileActions() {
  const navigation = useNavigation<RootParamList>();
  return (
    <View style={styles.actions}>
      <Button
        title="Push another profile"
        onPress={() =>
          navigation.navigate('Profile', { userId: String(Math.random()) })
        }
      />
      <Button title="Go back" onPress={() => navigation.goBack()} />
      <Button title="Pop to top" onPress={() => navigation.popToTop()} />
    </View>
  );
}

export default function App() {
  return <AppNavigation<RootParamList> screens={{ Home, Profile }} />;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    gap: 16,
  },
  profile: {
    backgroundColor: '#eef3ff',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
  },
  actions: {
    gap: 8,
  },
});
