const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Alias 설정 추가
config.resolver.alias = {
  '@': path.resolve(__dirname),
  '@src': path.resolve(__dirname, 'src'),
  '@app': path.resolve(__dirname, 'app'),
  '@assets': path.resolve(__dirname, 'assets'),
  '@components': path.resolve(__dirname, 'src/components'),
  '@features': path.resolve(__dirname, 'src/features'),
  '@hooks': path.resolve(__dirname, 'src/hooks'),
  '@store': path.resolve(__dirname, 'src/store'),
  '@types': path.resolve(__dirname, 'src/types'),
  '@lib': path.resolve(__dirname, 'src/lib'),
  '@constants': path.resolve(__dirname, 'src/constants'),
  '@config': path.resolve(__dirname, 'src/config'),
};

module.exports = withNativeWind(config, { input: './global.css' });
