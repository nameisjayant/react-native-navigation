import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import {
  Card,
  Chip,
  FocusBadge,
  Header,
  IconBadge,
  ListRow,
  Screen,
  SectionHeader,
} from '../../components';
import { trendingTopics } from '../../data/topics';
import { Icon } from '../../icons';
import { SearchRoutes } from '../../navigation/routes';
import type { SearchScreenProps } from '../../navigation/types';
import { colors, typography } from '../../theme';
import { styles } from './styles';

export function SearchListScreen({
  navigation,
}: SearchScreenProps<'SearchList'>) {
  // Tabs stay mounted, so this state survives switching tabs.
  const [query, setQuery] = useState('');
  const [recent, setRecent] = useState<string[]>([]);

  const search = (text: string) => {
    const trimmed = text.trim();
    if (trimmed === '') {
      return;
    }
    setRecent((prev) =>
      [trimmed, ...prev.filter((item) => item !== trimmed)].slice(0, 4)
    );
    // Pushes inside the tab, keeping the tab bar visible.
    navigation.navigate(SearchRoutes.SearchResult, { query: trimmed });
  };

  return (
    <Screen
      header={
        <Header
          overline="Nested stack"
          title="Explore"
          subtitle="This tab renders its own <AppNavigation />."
          right={<FocusBadge />}
        />
      }
    >
      <View style={styles.searchBox}>
        <Icon name="search" color={colors.textSubtle} size={22} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={() => search(query)}
          placeholder="Search anything…"
          placeholderTextColor={colors.textSubtle}
          returnKeyType="search"
          style={styles.input}
        />
        {query !== '' && (
          <Pressable hitSlop={8} onPress={() => setQuery('')}>
            <Icon name="close" color={colors.textSubtle} size={18} />
          </Pressable>
        )}
      </View>
      <Text style={[typography.caption, styles.hint]}>
        Type something, switch tabs and come back: it is still here.
      </Text>

      <SectionHeader title="Trending" />
      <View style={styles.chips}>
        {trendingTopics.map((topic) => (
          <Chip
            key={topic}
            label={topic}
            icon="trending"
            onPress={() => search(topic)}
          />
        ))}
      </View>

      {recent.length > 0 && (
        <>
          <SectionHeader
            title="Recent"
            action={{ label: 'Clear', onPress: () => setRecent([]) }}
          />
          <Card flush>
            {recent.map((item, index) => (
              <ListRow
                key={item}
                leading={<IconBadge name="history" tone="sky" size={36} />}
                title={item}
                onPress={() => search(item)}
                last={index === recent.length - 1}
              />
            ))}
          </Card>
        </>
      )}
    </Screen>
  );
}
