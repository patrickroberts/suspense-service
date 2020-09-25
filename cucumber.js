require('ts-node').register({
  transpileOnly: true,
  compilerOptions: {
    jsx: 'react',
    module: 'commonjs'
  }
});

exports.default = [
  '--require features/**/*.ts',
  '--require features/**/*.tsx',
  '--publish-quiet'
].join(' ');
