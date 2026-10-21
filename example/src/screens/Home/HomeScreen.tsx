import { Text, View } from 'react-native';
import {
  useNavigation,
  type TabScreenProps,
} from '@nameisjayant/react-native-navigation';
import {
  Avatar,
  Card,
  FeatureCard,
  FocusBadge,
  Header,
  ListRow,
  Screen,
  SectionHeader,
} from '../../components';
import { people } from '../../data/people';
import { Icon } from '../../icons';
import type { RootParamList, TabName } from '../../navigation/types';
import { colors } from '../../theme';
import { styles } from './styles';

export function HomeScreen({ tabs }: TabScreenProps<TabName>) {
  // Tab screens push onto the root stack, covering the tab bar.
  const navigation = useNavigation<RootParamList>();

  return (
    <Screen
      header={
        <Header
          overline="Overview"
          title="Explore the library"
          subtitle="Every tile below opens a real feature."
          right={<FocusBadge />}
        />
      }
    >
      <View style={styles.grid}>
        <FeatureCard
          icon="person"
          tone="indigo"
          title="Stack"
          description="Push a profile with typed params, covering the tabs."
          api="navigate('Profile')"
          onPress={() => navigation.navigate('Profile', { userId: '42' })}
        />
        <FeatureCard
          icon="layers"
          tone="violet"
          title="Stack Lab"
          description="Push, replace, go back and pop to top."
          api="replace()"
          onPress={() => navigation.navigate('StackLab', { depth: 1 })}
        />
        <FeatureCard
          icon="explore"
          tone="teal"
          title="Nested stack"
          description="A whole stack living inside the Explore tab."
          api="tabs.jumpTo()"
          onPress={() => tabs.jumpTo('Search')}
        />
        <FeatureCard
          icon="palette"
          tone="rose"
          title="Tab bar"
          description="Restyle the tab bar or swap in your own."
          api="tabBar={…}"
          onPress={() => tabs.jumpTo('Settings')}
        />
      </View>

      <View style={styles.tip}>
        <Icon name="bolt" color={colors.primary} size={20} />
        <Text style={styles.tipText}>
          Open a screen and come back: the badge above counts how often this tab
          regained focus with useIsFocused().
        </Text>
      </View>

      <SectionHeader
        title="People"
        action={{ label: 'Explore', onPress: () => tabs.jumpTo('Search') }}
      />
      <Card flush>
        {people.slice(0, 4).map((person, index, list) => (
          <ListRow
            key={person.id}
            leading={<Avatar name={person.name} tone={person.tone} size={40} />}
            title={person.name}
            subtitle={person.role}
            onPress={() =>
              navigation.navigate('Profile', { userId: person.id })
            }
            last={index === list.length - 1}
          />
        ))}
      </Card>
    </Screen>
  );
}
