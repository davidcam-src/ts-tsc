module.exports = {
  preset: "ts-jest",
  testEnvironment: 'node',
  testRegex: '(/__tests__/(?!data/).*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};