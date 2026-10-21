import { Text, View } from 'react-native';
import {
  ApiTag,
  Avatar,
  Button,
  Card,
  Header,
  IconBadge,
  ListRow,
  Screen,
  SectionHeader,
} from '../../components';
import { people } from '../../data/people';
import { resultsFor } from '../../data/topics';
import { Icon } from '../../icons';
import type { RootParamList, SearchScreenProps } from '../../navigation/types';
import { colors, typography } from '../../theme';
import { styles } from './styles';

export function SearchResultScreen({
  navigation,
  route,
}: SearchScreenProps<'SearchResult'>) {
  const { query } = route.params;
  const results = resultsFor(query);
  const authors = people.slice(1, 4);

  return (
    <Screen
      header={
        <Header
          back
          overline={`${results.length} results`}
          title={`“${query}”`}
        />
      }
    >
      <View style={styles.banner}>
        <Icon name="tab" color={colors.primary} size={20} />
        <Text style={styles.bannerText}>
          Pushed inside the Explore tab, so the tab bar stays visible. Back pops
          this stack first.
        </Text>
      </View>

      <Card flush>
        {results.map((result, index) => (
          <ListRow
            key={result.id}
            leading={<IconBadge name="star" tone="indigo" size={36} />}
            title={result.title}
            subtitle={result.summary}
            // Drill down: push another result on the nested stack.
            onPress={() =>
              navigation.navigate('SearchResult', {
                query: result.title.toLowerCase(),
              })
            }
            last={index === results.length - 1}
          />
        ))}
      </Card>

      <SectionHeader title="Written by" />
      <Text style={[typography.caption, styles.note]}>
        Profile is not in this stack: it opens in the root stack, over the tabs.
      </Text>
      <Card flush>
        {authors.map((person, index) => (
          <ListRow
            key={person.id}
            leading={<Avatar name={person.name} tone={person.tone} size={36} />}
            title={person.name}
            subtitle={person.role}
            onPress={() =>
              navigation
                .getParent<RootParamList>()
                ?.navigate('Profile', { userId: person.id })
            }
            last={index === authors.length - 1}
          />
        ))}
      </Card>

      <View style={styles.actions}>
        <Button
          label="Back to Explore"
          icon="popToTop"
          variant="secondary"
          onPress={() => navigation.popToTop()}
        />
        <View style={styles.apiRow}>
          <ApiTag>getParent()</ApiTag>
          <ApiTag>popToTop()</ApiTag>
        </View>
      </View>
    </Screen>
  );
}
