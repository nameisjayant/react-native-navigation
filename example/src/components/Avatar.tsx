import { StyleSheet, Text, View } from 'react-native';
import { radius, tones, type Tone } from '../theme';

type AvatarProps = {
  name: string;
  tone?: Tone;
  size?: number;
};

export function Avatar({ name, tone = 'indigo', size = 48 }: AvatarProps) {
  const { bg, fg } = tones[tone];
  const initials = name
    .split(' ')
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase();
  return (
    <View
      style={[
        styles.avatar,
        { width: size, height: size, backgroundColor: bg },
      ]}
    >
      <Text style={[styles.initials, { color: fg, fontSize: size * 0.36 }]}>
        {initials}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
  },
  initials: {
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
