module.exports = {
  preset: "ts-jest",
  testEnvironment: "node", // Set to 'node' to test Node.js code
  roots: ["<rootDir>"], // Define where Jest should search for tests
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.[jt]s$", // Match test files
  moduleFileExtensions: ["ts", "tsx", "js", "json"],
  transform: {
    "^.+\\.[t|j]sx?$": "ts-jest",
  },

  collectCoverage: true,
  type: "module",
};
