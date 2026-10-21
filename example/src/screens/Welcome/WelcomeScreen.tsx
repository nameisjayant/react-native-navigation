import { Text, View } from 'react-native';
import {
  ApiTag,
  Button,
  Card,
  IconBadge,
  ListRow,
  Screen,
  SectionHeader,
} from '../../components';
import { Icon } from '../../icons';
import type { RootScreenProps } from '../../navigation/types';
import { colors, typography } from '../../theme';
import { styles } from './styles';

const highlights = ['Native stack', 'Bottom tabs', 'Nested', 'Typed'];

export function WelcomeScreen({ navigation }: RootScreenProps<'Welcome'>) {
  return (
    <Screen contentStyle={styles.content}>
      <View style={styles.hero}>
        <View style={[styles.glow, styles.glowLarge]} />
        <View style={[styles.glow, styles.glowSmall]} />
        <View style={styles.logo}>
          <Icon name="layers" color={colors.onPrimary} size={28} />
        </View>
        <Text style={styles.heroTitle}>Navigation,{'\n'}made native.</Text>
        <Text style={styles.heroBody}>
          Stacks rendered by Jetpack Compose Navigation 3, bottom tabs, nested
          navigators and fully typed params.
        </Text>
        <View style={styles.highlights}>
          {highlights.map((label) => (
            <View key={label} style={styles.highlight}>
              <Text style={styles.highlightLabel}>{label}</Text>
            </View>
          ))}
        </View>
      </View>

      <SectionHeader title="Jump straight in" />
      <Card flush>
        {/* Open a given tab of the nested navigator. */}
        <ListRow
          leading={<IconBadge name="settings" tone="amber" />}
          title="Open the Settings tab"
          subtitle="navigate('Main', { screen: 'Settings' })"
          onPress={() => navigation.navigate('Main', { screen: 'Settings' })}
        />
        {/* Two levels deep: a tab, then a screen of the stack inside it. */}
        <ListRow
          leading={<IconBadge name="link" tone="teal" />}
          title="Deep link to a search result"
          subtitle="Main → Explore tab → SearchResult"
          onPress={() =>
            navigation.navigate('Main', {
              screen: 'Search',
              params: {
                screen: 'SearchResult',
                params: { query: 'deep links' },
              },
            })
          }
        />
        <ListRow
          leading={<IconBadge name="layers" tone="violet" />}
          title="Open the Stack Lab"
          subtitle="Push, replace and pop, live"
          onPress={() => navigation.navigate('StackLab', { depth: 1 })}
          last
        />
      </Card>

      <View style={styles.footer}>
        <Button
          label="Get started"
          icon="arrowForward"
          onPress={() => navigation.navigate('Main')}
        />
        <View style={styles.footerNote}>
          <Text style={typography.caption}>Pushes the tabs with</Text>
          <ApiTag>navigate('Main')</ApiTag>
        </View>
      </View>
    </Screen>
  );
}
