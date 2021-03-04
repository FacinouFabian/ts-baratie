module.exports = api => {
  api.cache(true)

  const presets = [require('@babel/preset-env'), require('@babel/preset-typescript')]

  const plugins = ['@babel/plugin-proposal-class-properties', '@babel/transform-runtime']

  return {
    presets,
    plugins,
  }
}
