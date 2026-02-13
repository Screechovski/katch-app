const { getDefaultConfig } = require('expo/metro-config'); // or 'metro-config' for bare RN

const config = getDefaultConfig(__dirname);

config.resolver.unstable_conditionNames = [
    'browser',
    'require',
    'react-native',
];

module.exports = config;
