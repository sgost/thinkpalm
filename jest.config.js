const { defaults } = require('jest-config');

module.exports = {
    setupFilesAfterEnv: ['<rootDir>/setUpTests.js'],
    moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx', 'svg'],
    testEnvironment: 'jsdom',
    collectCoverage: true,
    coverageReporters: ["lcov"],
    coverageDirectory: "./code-coverage",
    testResultsProcessor: "jest-sonar-reporter",
    globals: {
        window: {
            open: () => { }
        }
    },
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
        "@src(.*)$": "<rootDir>/src$1",
        "@store(.*)$": "<rootDir>/src/store$1",
        "@components(.*)$": "<rootDir>/src/components$1",
        "\\.(css|less|sass|scss)$": "identity-obj-proxy"
    },
    "transform": {
        "^.+\\.(ts|tsx|js|jsx)$": "babel-jest",
        "^.+\\.scss$": "<rootDir>/svgTransform.js",
        "^.+\\.svg$": "<rootDir>/svgTransform.js",
        "^.+\\.png$": "<rootDir>/svgTransform.js",
        "^.+\\.jpg$": "<rootDir>/svgTransform.js"
    },
    "reporters": ["default"]
};