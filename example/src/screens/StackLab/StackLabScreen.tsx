import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { useRoute } from '@nameisjayant/react-native-navigation';
import {
  ApiTag,
  Button,
  Card,
  FocusBadge,
  Header,
  Screen,
  SectionHeader,
} from '../../components';
import type { RootParamList, RootScreenProps } from '../../navigation/types';
import { colors, typography } from '../../theme';
import { styles } from './styles';

const MAX_LAYERS = 5;

export function StackLabScreen({ navigation }: RootScreenProps<'StackLab'>) {
  const { key, name, params } = useRoute<RootParamList, 'StackLab'>();
  const { depth } = params;
  const canGoBack = navigation.canGoBack();

  return (
    <Screen
      header={
        <Header
          back
          overline="Playground"
          title="Stack Lab"
          subtitle="Each action changes the real back stack."
          right={<FocusBadge />}
        />
      }
    >
      <Card style={styles.visual}>
        <StackLayers depth={depth} />
        <View style={styles.depthRow}>
          <Text style={styles.depthValue}>{depth}</Text>
          <Text style={typography.caption}>
            {depth === 1 ? 'lab screen' : 'lab screens'} on the stack
          </Text>
        </View>
      </Card>

      <SectionHeader title="Current route" />
      <Card style={styles.routeCard}>
        <RouteLine label="name" value={String(name)} />
        <RouteLine label="key" value={key} />
        <RouteLine label="params" value={JSON.stringify(params)} />
        <RouteLine label="canGoBack()" value={String(canGoBack)} />
      </Card>

      <SectionHeader title="Actions" />
      <View style={styles.actions}>
        <Action api="navigate()" description="Push a new lab screen on top.">
          <Button
            label="Push"
            icon="add"
            onPress={() =>
              navigation.navigate('StackLab', { depth: depth + 1 })
            }
          />
        </Action>
        <Action
          api="replace()"
          description="Swap this screen for a new one: same depth, new key."
        >
          <Button
            label="Replace"
            icon="swap"
            variant="secondary"
            onPress={() => navigation.replace('StackLab', { depth })}
          />
        </Action>
        <Action api="goBack()" description="Pop this screen.">
          <Button
            label="Go back"
            icon="arrowBack"
            variant="secondary"
            disabled={!canGoBack}
            onPress={() => navigation.goBack()}
          />
        </Action>
        <Action
          api="popToTop()"
          description="Pop everything above the first screen."
        >
          <Button
            label="Pop to top"
            icon="popToTop"
            variant="danger"
            onPress={() => navigation.popToTop()}
          />
        </Action>
      </View>
    </Screen>
  );
}

/** Draws the lab screens as stacked cards, the top one in full color. */
function StackLayers({ depth }: { depth: number }) {
  const shown = Math.min(depth, MAX_LAYERS);
  return (
    <View style={[styles.layers, { height: 64 + (shown - 1) * 14 }]}>
      {Array.from({ length: shown }, (_, index) => {
        const fromTop = shown - 1 - index;
        return (
          <View
            key={index}
            style={[
              styles.layer,
              {
                top: index * 14,
                transform: [{ scale: 1 - fromTop * 0.06 }],
                opacity: 1 - fromTop * 0.18,
                backgroundColor:
                  fromTop === 0 ? colors.primary : colors.inkMuted,
              },
            ]}
          >
            {fromTop === 0 && (
              <Text style={styles.layerLabel}>StackLab · depth {depth}</Text>
            )}
          </View>
        );
      })}
    </View>
  );
}

function RouteLine({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.routeLine}>
      <Text style={[typography.mono, styles.routeLabel]}>{label}</Text>
      <Text style={[typography.mono, styles.routeValue]} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

function Action({
  api,
  description,
  children,
}: {
  api: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <Card style={styles.action}>
      <View style={styles.actionText}>
        <ApiTag>{api}</ApiTag>
        <Text style={typography.caption}>{description}</Text>
      </View>
      {children}
    </Card>
  );
}
