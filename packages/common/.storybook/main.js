module.exports = {
  stories: ["../src/**/*.stories.tsx", "../src/**/*.stories.ts"],
  addons: [
    "@storybook/addon-actions/register",
    "@storybook/addon-knobs/register"
  ],
  webpackFinal: async config => {
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      loader: require.resolve("babel-loader"),
      options: {
        presets: [["react-app", { flow: false, typescript: true }]]
      }
    });
    config.resolve.extensions.push(".ts", ".tsx");
    return config;
  }
};
