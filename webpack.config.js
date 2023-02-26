import webpack from 'webpack';

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_DEBUG': 'false',
    }),
  ],
};
