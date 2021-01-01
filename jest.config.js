module.exports = {
  globals: {
    'ts-jest': {
      tsconfig: {
        jsx: 'react',
        target: 'es2019',
      },
    },
  },
  preset: 'ts-jest/presets/js-with-babel',
};
