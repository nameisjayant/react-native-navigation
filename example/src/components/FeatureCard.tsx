import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { IconName } from '../icons';
import {
  colors,
  radius,
  shadow,
  spacing,
  typography,
  type Tone,
} from '../theme';
import { ApiTag } from './ApiTag';
import { IconBadge } from './IconBadge';

type FeatureCardProps = {
  icon: IconName;
  tone: Tone;
  title: string;
  description: string;
  api: string;
  onPress: () => void;
};

/** A tile on the Home tab that opens one feature of the library. */
export function FeatureCard({
  icon,
  tone,
  title,
  description,
  api,
  onPress,
}: FeatureCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <IconBadge name={icon} tone={tone} />
      <View style={styles.text}>
        <Text style={typography.heading}>{title}</Text>
        <Text style={typography.caption} numberOfLines={3}>
          {description}
        </Text>
      </View>
      <ApiTag>{api}</ApiTag>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexBasis: '47%',
    flexGrow: 1,
    padding: spacing.lg,
    gap: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    ...shadow,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  text: {
    flex: 1,
    gap: spacing.xs,
  },
});
