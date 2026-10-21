import { AppNavigation } from '@nameisjayant/react-native-navigation';
import { ProfileScreen } from '../screens/Profile';
import { StackLabScreen } from '../screens/StackLab';
import { WelcomeScreen } from '../screens/Welcome';
import { MainTabs } from './MainTabs';
import { Routes } from './routes';
import type { RootParamList } from './types';

export function RootNavigator() {
  return (
    <AppNavigation<RootParamList>
      initialRoute={Routes.Welcome}
      screens={{
        [Routes.Welcome]: WelcomeScreen,
        [Routes.Main]: MainTabs,
        [Routes.Profile]: ProfileScreen,
        [Routes.StackLab]: StackLabScreen,
      }}
    />
  );
}
