module.exports = {
  globals: {
    'ts-jest': {
      tsConfig: {
        jsx: 'react',
        target: 'es2019',
      },
    },
  },
  preset: 'ts-jest/presets/js-with-babel',
};
