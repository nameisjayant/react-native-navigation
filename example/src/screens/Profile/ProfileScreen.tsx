import { Text, View } from 'react-native';
import { useNavigation, useRoute } from '@nameisjayant/react-native-navigation';
import {
  Avatar,
  Button,
  Card,
  FocusBadge,
  Header,
  ListRow,
  Screen,
  SectionHeader,
} from '../../components';
import { findPerson, people } from '../../data/people';
import type { RootParamList, RootScreenProps } from '../../navigation/types';
import { tones, typography } from '../../theme';
import { styles } from './styles';

export function ProfileScreen({ route }: RootScreenProps<'Profile'>) {
  const others = people.filter((person) => person.id !== route.params.userId);
  return (
    <Screen header={<Header back right={<FocusBadge />} />}>
      <ProfileHero />

      <SectionHeader title="More people" />
      <Card flush>
        {others.slice(0, 3).map((person, index) => (
          <ProfileLink key={person.id} userId={person.id} last={index === 2} />
        ))}
      </Card>

      <ProfileActions />
    </Screen>
  );
}

// Any component inside the screen can read its params with useRoute().
function ProfileHero() {
  const { params, key } = useRoute<RootParamList, 'Profile'>();
  const person = findPerson(params.userId);
  const name = person?.name ?? `User ${params.userId}`;
  const tone = person?.tone ?? 'indigo';
  const seed = Number(params.userId) || 1;

  return (
    <Card style={styles.hero}>
      <View style={[styles.cover, { backgroundColor: tones[tone].bg }]} />
      <Avatar name={name} tone={tone} size={88} />
      <View style={styles.identity}>
        <Text style={typography.title}>{name}</Text>
        <Text style={typography.body}>{person?.role ?? 'Guest'}</Text>
      </View>
      <View style={styles.stats}>
        <Stat label="Screens" value={seed * 3} />
        <View style={styles.statDivider} />
        <Stat label="Stars" value={seed * 17} />
        <View style={styles.statDivider} />
        <Stat label="Commits" value={seed * 41} />
      </View>
      <Text style={[typography.mono, styles.routeKey]}>key: {key}</Text>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={typography.caption}>{label}</Text>
    </View>
  );
}

function ProfileLink({ userId, last }: { userId: string; last: boolean }) {
  const navigation = useNavigation<RootParamList>();
  const person = findPerson(userId);
  if (person == null) {
    return null;
  }
  return (
    <ListRow
      leading={<Avatar name={person.name} tone={person.tone} size={40} />}
      title={person.name}
      subtitle="Pushes another Profile on the stack"
      onPress={() => navigation.navigate('Profile', { userId })}
      last={last}
    />
  );
}

function ProfileActions() {
  const navigation = useNavigation<RootParamList>();
  return (
    <View style={styles.actions}>
      <Button
        label="Go back"
        icon="arrowBack"
        variant="secondary"
        style={styles.action}
        onPress={() => navigation.goBack()}
      />
      <Button
        label="Pop to top"
        icon="popToTop"
        style={styles.action}
        onPress={() => navigation.popToTop()}
      />
    </View>
  );
}
