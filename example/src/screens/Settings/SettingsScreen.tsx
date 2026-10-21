import { Pressable, Switch, Text, View } from 'react-native';
import { useNavigation, useTabs } from '@nameisjayant/react-native-navigation';
import {
  ApiTag,
  Card,
  Header,
  IconBadge,
  ListRow,
  Screen,
  SectionHeader,
} from '../../components';
import {
  usePreferences,
  type TabBarVariant,
} from '../../context/PreferencesContext';
import { Icon } from '../../icons';
import type { RootParamList, TabName } from '../../navigation/types';
import { accents, colors, typography } from '../../theme';
import { styles } from './styles';

const variants: { value: TabBarVariant; title: string; api: string }[] = [
  { value: 'classic', title: 'Classic', api: 'tabBarStyle' },
  { value: 'floating', title: 'Floating', api: 'tabBar={…}' },
];

export function SettingsScreen() {
  const {
    tabBarVariant,
    setTabBarVariant,
    accent,
    setAccent,
    backToHomeTab,
    setBackToHomeTab,
  } = usePreferences();

  return (
    <Screen
      header={
        <Header
          overline="Bottom tabs"
          title="Settings"
          subtitle="Changes apply to the tab bar right away."
        />
      }
    >
      <SectionHeader title="Tab bar" />
      <View style={styles.variants}>
        {variants.map((variant) => {
          const selected = variant.value === tabBarVariant;
          return (
            <Pressable
              key={variant.value}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              onPress={() => setTabBarVariant(variant.value)}
              style={[
                styles.variant,
                selected && { borderColor: accent.color },
              ]}
            >
              <TabBarPreview variant={variant.value} color={accent.color} />
              <View style={styles.variantFooter}>
                <Text style={typography.heading}>{variant.title}</Text>
                {selected && (
                  <Icon name="check" color={accent.color} size={20} />
                )}
              </View>
              <ApiTag>{variant.api}</ApiTag>
            </Pressable>
          );
        })}
      </View>

      <SectionHeader title="Accent" />
      <Card>
        <View style={styles.swatches}>
          {accents.map((item) => {
            const selected = item.name === accent.name;
            return (
              <Pressable
                key={item.name}
                accessibilityRole="radio"
                accessibilityLabel={item.name}
                accessibilityState={{ selected }}
                onPress={() => setAccent(item)}
                style={[
                  styles.swatchRing,
                  selected && { borderColor: item.color },
                ]}
              >
                <View style={[styles.swatch, { backgroundColor: item.color }]}>
                  {selected && (
                    <Icon name="check" color={colors.onPrimary} size={18} />
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>
        <View style={styles.accentFooter}>
          <Text style={typography.caption}>{accent.name}</Text>
          <ApiTag>activeTintColor</ApiTag>
        </View>
      </Card>

      <SectionHeader title="Behavior" />
      <Card flush>
        <ListRow
          leading={<IconBadge name="undo" tone="sky" />}
          title="Back returns to Home"
          subtitle={`backBehavior="${backToHomeTab ? 'initialTab' : 'none'}"`}
          trailing={
            <Switch
              value={backToHomeTab}
              onValueChange={setBackToHomeTab}
              trackColor={{ true: accent.color, false: colors.border }}
            />
          }
          last
        />
      </Card>

      <SectionHeader title="Navigate" />
      <SettingsShortcuts />

      <Text style={[typography.caption, styles.version]}>
        @nameisjayant/react-native-navigation · v0.1.0
      </Text>
    </Screen>
  );
}

// Nested components reach the tabs and the root stack through hooks.
function SettingsShortcuts() {
  const tabs = useTabs<TabName>();
  const navigation = useNavigation<RootParamList>();
  return (
    <Card flush>
      <ListRow
        leading={<IconBadge name="home" tone="indigo" />}
        title="Back to Home"
        subtitle="useTabs().jumpTo('Home')"
        onPress={() => tabs.jumpTo('Home')}
      />
      <ListRow
        leading={<IconBadge name="layers" tone="violet" />}
        title="Open the Stack Lab"
        subtitle="Pushed over the tabs"
        onPress={() => navigation.navigate('StackLab', { depth: 1 })}
      />
      <ListRow
        leading={<IconBadge name="logout" tone="rose" />}
        title="Sign out"
        subtitle="replace('Welcome'): the tabs are gone from history"
        onPress={() => navigation.replace('Welcome')}
        last
      />
    </Card>
  );
}

/** A miniature drawing of each tab bar style. */
function TabBarPreview({
  variant,
  color,
}: {
  variant: TabBarVariant;
  color: string;
}) {
  if (variant === 'floating') {
    return (
      <View style={styles.preview}>
        <View style={styles.previewFloating}>
          <View style={[styles.previewPill, { backgroundColor: color }]} />
          <View style={styles.previewDotDark} />
          <View style={styles.previewDotDark} />
        </View>
      </View>
    );
  }
  return (
    <View style={styles.preview}>
      <View style={styles.previewClassic}>
        <View style={[styles.previewDot, { backgroundColor: color }]} />
        <View style={styles.previewDot} />
        <View style={styles.previewDot} />
      </View>
    </View>
  );
}
