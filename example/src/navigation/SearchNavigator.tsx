import { AppNavigation } from '@nameisjayant/react-native-navigation';
import { SearchListScreen } from '../screens/SearchList';
import { SearchResultScreen } from '../screens/SearchResult';
import { SearchRoutes } from './routes';
import type { SearchParamList } from './types';

/**
 * A stack nested inside the Search tab: its screens push under the tab bar,
 * and names it does not have (e.g. `Profile`) go to the root stack.
 */
export function SearchNavigator() {
  return (
    <AppNavigation<SearchParamList>
      screens={{
        [SearchRoutes.SearchList]: SearchListScreen,
        [SearchRoutes.SearchResult]: SearchResultScreen,
      }}
    />
  );
}
