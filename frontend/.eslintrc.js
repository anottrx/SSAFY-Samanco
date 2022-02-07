module.exports = {
  parser: "@babel/eslint-parser",
  parserOptions: { "requireConfigFile" : "false" }, 
  // babelOptions: { "configFile": "./.babelrc", },
  extends: [
    'plugin:@next/next/recommended',
  ],
};