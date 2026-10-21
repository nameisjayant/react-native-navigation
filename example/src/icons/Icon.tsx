import Svg, { Path } from 'react-native-svg';
import type { TabIconProps } from '@nameisjayant/react-native-navigation';
import { paths, type IconName } from './paths';

type IconProps = {
  name: IconName;
  color: string;
  size?: number;
};

export function Icon({ name, color, size = 24 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d={paths[name]} fill={color} />
    </Svg>
  );
}

/** A tab icon render function drawing one of the icon paths. */
export function tabIcon(name: IconName) {
  return ({ color, size }: TabIconProps) => (
    <Icon name={name} color={color} size={size} />
  );
}
