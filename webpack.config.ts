import CopyPlugin from 'copy-webpack-plugin';

const config = {
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: './src/background.html', to: 'dist/audate/background.html' },
        { from: './src/options.html', to: 'dist/audate/options.html' },
      ],
    }),
  ],
};

// Run using `npx webpack --mode=development`
export default config;
