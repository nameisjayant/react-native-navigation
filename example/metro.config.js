const path = require('path');
const { getDefaultConfig } = require('@react-native/metro-config');
const { withMetroConfig } = require('react-native-monorepo-config');

const root = path.resolve(__dirname, '..');

const escape = (value) => value.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = withMetroConfig(getDefaultConfig(__dirname), {
  root,
  dirname: __dirname,
  conditions: ['nameisjayant-react-native-navigation-source'],
});

// The Next.js docs site lives in the repo root too; keep Metro out of it.
config.resolver.blockList = [
  ...[config.resolver.blockList].flat().filter(Boolean),
  new RegExp(`^${escape(path.join(root, 'docs'))}[\\/\\\\]`),
];

module.exports = config;
