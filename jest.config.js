module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    setupFilesAfterEnv: ["<rootDir>/tests/jest.setup.ts"],
};
// 'preset: "ts-jest"': use ts-jest preset to handle TS files
// 'testEnvironment: "node"': set environment to Node.js
