module.exports = {
  "root": true,
  "parser": "babel-eslint",
  "plugins": [ "jest", "jsdoc" ],
  "extends": [
    "standard",
    "plugin:jest/recommended",
    "plugin:jsdoc/recommended"
  ],
  "env": {
    "browser": true,
    "jest/globals": true
  },
  "rules": {
    // More permissive spacing (Easier for code to follow gestalt principle of proximity)
    "padded-blocks": "off",

    // Function def and function call are consistent this way
    "space-before-function-paren": ["error", {
      "anonymous": "always",
      "named": "never",
      "asyncArrow": "always"
    }]
  }
}
