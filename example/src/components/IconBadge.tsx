import { StyleSheet, View } from 'react-native';
import { Icon, type IconName } from '../icons';
import { radius, tones, type Tone } from '../theme';

type IconBadgeProps = {
  name: IconName;
  tone?: Tone;
  size?: number;
};

/** An icon on a soft tinted rounded square. */
export function IconBadge({
  name,
  tone = 'indigo',
  size = 40,
}: IconBadgeProps) {
  const { bg, fg } = tones[tone];
  return (
    <View
      style={[styles.badge, { width: size, height: size, backgroundColor: bg }]}
    >
      <Icon name={name} color={fg} size={size * 0.5} />
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.sm + 2,
  },
});
