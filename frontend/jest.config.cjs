// jest.config.js
module.exports = {
  testMatch: ['**/__tests__/**/*.test.js', '**/_test/**/*.test.js'],
  transform: {
    '^.+\\.jsx?$': ['babel-jest', { presets: ['@babel/preset-react'] }],
  },
  setupFilesAfterEnv: ['./jest.setup.js'],
  moduleFileExtensions: ['js', 'mjs', 'cjs', 'jsx', 'ts', 'tsx', 'json', 'node'],
  testEnvironment: 'jsdom',
};
