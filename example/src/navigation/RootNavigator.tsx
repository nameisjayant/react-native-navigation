import { AppNavigation } from '@nameisjayant/react-native-navigation';
import { ProfileScreen } from '../screens/Profile';
import { StackLabScreen } from '../screens/StackLab';
import { WelcomeScreen } from '../screens/Welcome';
import { MainTabs } from './MainTabs';
import type { RootParamList } from './types';

export function RootNavigator() {
  return (
    <AppNavigation<RootParamList>
      initialRoute="Welcome"
      screens={{
        Welcome: WelcomeScreen,
        Main: MainTabs,
        Profile: ProfileScreen,
        StackLab: StackLabScreen,
      }}
    />
  );
}
