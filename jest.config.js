module.exports = {
    "roots": [
        "<rootDir>/tests",
        "<rootDir>/src",
    ],
    "collectCoverageFrom": [
        "src/**/*.ts",
    ],
    "testMatch": [
        "**/__tests__/**/*.+(ts|tsx|js)",
        "**/?(*.)+(spec|test).+(ts|tsx|js)",
    ],
    "transform": {
        "^.+\\.(ts|tsx)$": "ts-jest",
    },
    "moduleNameMapper": {
        "@ethclients/(.*)": "<rootDir>/src/$1",
    },
};
