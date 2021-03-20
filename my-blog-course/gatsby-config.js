module.exports = {
  siteMetadata: {
    title: 'My Blog Course',
    description: 'My personal blog',
    twitter: 'myhandle',
    siteUrl: 'https://example.com', // it corresponds to the domain of your production site
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/posts`,
        name: 'posts',
      },
    },
    'gatsby-plugin-mdx',
    {
      resolve: 'gatsby-plugin-theme-ui',
      options: {
        preset: '@theme-ui/preset-funk',
        prismPreset: 'prism-okaidia',
      },
    },
    'gatsby-plugin-image',
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
  ],
};
