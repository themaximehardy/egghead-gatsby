# Build a Developer Blog with Gatsby

_Notes based on Laurie Barth's fantastic course on [Egghead.io](https://egghead.io/)._

### 1. Use npm init gatsby to create an initial Gatsby site

Use `npm init gatsby` with the `y` flag to create an initial Gatsby site.

```sh
npm init gatsby -y blog-course
npm run develop
# go to http://localhost:8000/
```

The site includes a `package.json` with Gatsby, React, and `react-dom` installed, an empty `gatsby-config.js` file, and two files in `src/pages` - `index.js` and `404.js`.

### 2. Add a Shared Layout Component to a Gatsby Site

Create a shared `Layout` component with semantic HTML to provide proper landmarks to the page. Additionally, use the `Link` component from the core Gatsby package to add a Homepage route to the header.

```js
// my-blog-course/src/components/layout.js
import React from 'react';
import { Link } from 'gatsby';

const Layout = ({ children }) => {
  return (
    <div>
      <header>
        <nav>
          <Link to='/'>Home</Link>
        </nav>
      </header>
      <main>{children}</main>
      <footer>A great footer.</footer>
    </div>
  );
};

export default Layout;
```

```js
// my-blog-course/src/pages/index.js
import * as React from 'react';
import Layout from '../components/layout';

const IndexPage = () => {
  return (
    <Layout>
      <div>Hello World!</div>
    </Layout>
  );
};

export default IndexPage;
```

### 3. Create an Accessible SEO Component using React Helmet

Add metadata to your `gatsby-config` file and query it using the `useStaticQuery` hook and the GraphQL template function.

React Helmet is a component that lets you control your document head using their React component. Install `gatsby-plugin-react-helmet` and use the Helmet component from `react-helmet` to pass in necessary information such as `title`, `description`, `language`, and `titleTemplate`.

Finally, use the meta keyword to add an array with targeted og and Twitter information.

```sh
npm install gatsby-plugin-react-helmet react-helmet
```

```js
// my-blog-course/gatsby-config.js
module.exports = {
  siteMetadata: {
    title: 'My Blog Course',
    description: 'My personal blog', // add more info like description and twitter
    twitter: 'myhandle',
  },
  plugins: ['gatsby-plugin-react-helmet'], // add this plugin here after installing it
};
```

```js
// my-blog-course/src/components/seo.js
import React from 'react';
import { Helmet } from 'react-helmet';
import { useStaticQuery, graphql } from 'gatsby';
import { siteMetadata } from '../../gatsby-config';

const SEO = ({ title, description, meta = [] }) => {
  const { site } = useStaticQuery(
    graphql`
      {
        site {
          siteMetadata {
            description
            title
            twitter
          }
        }
      }
    `
  );

  const metaDescription = description || site.siteMetadata.description;

  return (
    <Helmet
      title={title}
      htmlAttributes={{ lang: 'en' }}
      titleTemplate={`%s | ${siteMetadata.title}`}
      meta={[
        {
          name: 'description',
          content: metaDescription,
        },
        {
          property: 'og:title',
          content: title,
        },
        {
          property: 'og:description',
          content: metaDescription,
        },
        {
          property: 'og:type',
          content: 'website',
        },
        {
          property: 'twitter:title',
          content: title,
        },
        {
          property: 'twitter:description',
          content: metaDescription,
        },
        {
          property: 'twitter:creater',
          content: siteMetadata.twitter || '',
        },
        {
          property: 'twitter:card',
          content: 'summary',
        },
      ].concat(meta)}
    />
  );
};

export default SEO;
```

```js
// my-blog-course/src/pages/index.js
import * as React from 'react';
import Layout from '../components/layout';
import SEO from '../components/seo';

const IndexPage = () => {
  return (
    <Layout>
      <SEO title={'Home Page'} />
      <div>Hello World!</div>
    </Layout>
  );
};

export default IndexPage;
```

### 4. Use Gatsby Plugins to Source and Transform MDX Files

Create a `posts` directory at the root of your project with an MDX file. Inside the MDX file add Frontmatter and placeholder text.

With the `gatsby-source-filesystem` plugin, you can query the files in the posts directory. Finally, install `gatsby-plugin-mdx`, `@mdx-js/mdx` and `@mdx-js/react` to process the MDX files so they can be queried in the project.

Create a `posts` directory and `learning-gatsby.mdx` file in it.

```mdx
---
title: Learning About Gatsby
---

Nam voluptates reiciendis. Ea ad quae aut. Et totam voluptatem perspiciatis quaerat repellendus. Suscipit labore optio. Qui maxime rerum ut et quasi id molestiae tempora quia.

Sed pariatur pariatur sunt exercitationem et. Ut nobis dolor magnam dolor. Cumque ut distinctio ipsa ipsa repellat doloremque.

Quaerat ut officiis et nemo inventore. Voluptate et facilis voluptatem. Et sequi dolor molestiae. Qui nisi laudantium vel incidunt quam laborum quis eos. Deleniti at quas impedit voluptatibus aut. Earum quia itaque ut eligendi.
```

```sh
npm install gatsby-source-filesystem
```

```js
// my-blog-course/gatsby-config.js
module.exports = {
  siteMetadata: {
    title: 'My Blog Course',
    description: 'My personal blog',
    twitter: 'myhandle',
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-source-filesystem', // add these info
      options: {
        path: `${__dirname}/posts`,
        name: 'posts',
      },
    },
  ],
};
```

```sh
npm install gatsby-plugin-mdx @mdx-js/mdx @mdx-js/react
```

```js
// my-blog-course/gatsby-config.js
module.exports = {
  siteMetadata: {
    title: 'My Blog Course',
    description: 'My personal blog',
    twitter: 'myhandle',
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
  ],
};
```

After reloading the project by stopping it and call `npm run develop` again (needs to be done each time we change `gatsby-config.js`). In `GraphiQL` we have now access to `allMdx`:

```
query MyQuery {
  allMdx {
    nodes {
      frontmatter {
        title
      }
    }
  }
}
```

### 5. Use Gatsby's File System Route API to Generate Pages for Each MDX File

In the `pages` directory, create the `{Mdx.slug}.js` file. Using curly braces, you can denote a file system route API that operates on all "Mdx" nodes and creates a page with the path slug available on that node.

The File System Route API automatically passes the `id` of each MDX file node to the GraphQL query inside this file. Use the `id` to filter the query and get access to the processed MDX file.

Finally, pull in `data`, the result of our query, and expose the `title` from the frontmatter.

```js
// my-blog-course/src/pages/{Mdx.slug}.js
import React from 'react';
import { graphql } from 'gatsby';

const BlogPostPage = ({ data }) => {
  return <h1>{data.mdx.frontmatter.title}</h1>;
};

export const query = graphql`
  query BlogPostById($id: String) {
    mdx(id: { eq: $id }) {
      frontmatter {
        title
      }
    }
  }
`;

export default BlogPostPage;
```

### 6. Use MDXRenderer to Render MDX Content in a Gatsby Site

In this lesson, you will update the `BlogPostPage` component to render the post's content using MDXRenderer. MDXRenderer is a React component that takes compiled MDX content and renders it.

First, add the `body` to the GraphQL template function defined inside of `{Mdx.slug}.js`. Next, update the BlogPostPage component with a variable `post`, wrap the return object with the `Layout` component, expose the `title`, and use MDXRenderer. Inside MDXRenderer, pass `body` to render the entire post.

```js
// my-blog-course/src/pages/{Mdx.slug}.js
import React from 'react';
import { graphql } from 'gatsby';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import Layout from '../components/layout';

const BlogPostPage = ({ data }) => {
  const post = data.mdx;

  return (
    <Layout>
      <article>
        <h1>{post.frontmatter.title}</h1>
        <MDXRenderer>{post.body}</MDXRenderer>
      </article>
    </Layout>
  );
};

export const query = graphql`
  query BlogPostById($id: String) {
    mdx(id: { eq: $id }) {
      frontmatter {
        title
      }
      body
    }
  }
`;

export default BlogPostPage;
```

### 7. Add a List of Posts using a GraphQL Page Query

Inside of `index.js`, create a page query that grabs `allMDX` nodes, and in each node, grab the `slug` and `title`, that's available via the frontmatter.

Additionally, create a filter to sort all results using the frontmatter `title` field. Map through each post using the result of the query in the `data` object.

Finally, use the `Link` component and the `slugs` provided by the query result to link to each post.

```js
// my-blog-course/src/pages/index.js
import * as React from 'react';
import Layout from '../components/layout';
import SEO from '../components/seo';
import { graphql, Link } from 'gatsby';

const IndexPage = ({ data }) => {
  const posts = data.allMdx.nodes;

  return (
    <Layout>
      <SEO title={'Home Page'} />
      {posts.map((post) => {
        return (
          <Link to={post.slug} key={post.slug}>
            <h2>{post.frontmatter.title}</h2>
          </Link>
        );
      })}
    </Layout>
  );
};

export const pageQuery = graphql`
  query {
    allMdx(sort: { fields: [frontmatter___title], order: ASC }) {
      nodes {
        slug
        frontmatter {
          title
        }
      }
    }
  }
`;

export default IndexPage;
```

### 8. Add Theme UI to a Gatsby Site using gatsby-plugin-theme-ui and theme-ui

Theme UI is a library for building consistent, themeable React apps based on constraint-based design principles. It allows you to style any component in your application with typographic, color, and layout values defined in a shared theme object.

For this lesson, install the alpha versions of `gatsby-plugin-theme-ui` and `theme-ui.`: `theme-ui@0.4.0-alpha.3` and `gatsby-plugin-theme-ui@0.4.0-alpha.3`.

Add styles to the layout component using the [sx prop](https://theme-ui.com/sx-prop). Then install the [@theme-ui/presets package](https://theme-ui.com/packages/presets) and pass a preset in your gatsby-config file.

```sh
yarn add theme-ui@0.4.0-alpha.3 gatsby-plugin-theme-ui@0.4.0-alpha.3
```

Note: I used `yarn` because I got a problem with npm... And as Laurie suggested, I needed to add:

```json
// my-blog-course/package.json
//...
"resolutions": {
  "gatsby": "^3.0.1"
}
//...
```

```js
// my-blog-course/gatsby-config.js
module.exports = {
  siteMetadata: {
    title: 'My Blog Course',
    description: 'My personal blog',
    twitter: 'myhandle',
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
      resolve: 'gatsby-plugin-theme-ui', // add this one here
      options: {},
    },
  ],
};
```

```js
// my-blog-course/src/components/layout.js
/** @jsx jsx */
import { jsx } from 'theme-ui';
import { Link } from 'gatsby';

const bodyStyles = {
  mx: `2rem`,
  padding: `1rem`,
};

const headerStyles = {
  paddingLeft: `10px`,
};

const mainStyles = {
  maxWidth: `container`,
  padding: `1rem`,
  mx: `auto`,
  textAlign: `center`,
};

const footerStyles = {
  textAlign: `center`,
  background: `lightgrey`,
};

const Layout = ({ children }) => {
  return (
    <div sx={bodyStyles}>
      <header sx={headerStyles}>
        <nav>
          <Link to='/'>Home</Link>
        </nav>
      </header>
      <main sx={mainStyles}>{children}</main>
      <footer>
        <p sx={footerStyles}>A great footer.</p>
      </footer>
    </div>
  );
};

export default Layout;
```

However, we can also add an underlined preset. We'll install `@theme-ui/presets`, which comes with a number of them.

```sh
yarn add @theme-ui/presets
```

Then go back to `` and add this:

```js
// my-blog-course/gatsby-config.js
module.exports = {
  //...
  {
    resolve: 'gatsby-plugin-theme-ui',
    options: {
      preset: '@theme-ui/preset-funk' // try this one
    },
  },
  //...
};
```

### 9. Add Support for Syntax Highlighting in a Gatsby Site with @theme-ui/prism

[@theme-ui/prism](https://theme-ui.com/packages/prism/#syntax-themes) is a syntax highlighting component that works with Theme UI. In this lesson, use @theme-ui/prism to select a color scheme for rendering code snippets in MDX files.

Make sure to install `@theme-ui/prism@0.4.0-alpha.3`.

```sh
yarn add @theme-ui/prism@0.4.0-alpha.3
```

```js
// my-blog-course/gatsby-config.js
module.exports = {
  //...
  {
    resolve: 'gatsby-plugin-theme-ui',
    options: {
      preset: '@theme-ui/preset-funk',
      prismPreset: 'prism-okaidia', // add this line
    },
  },
  //...
};
```

```js
// my-blog-course/src/gatsby-plugin-theme-ui/components.js
/** @jsx jsx */
import Prism from '@theme-ui/prism';

export default {
  pre: (props) => props.children,
  code: Prism,
};
```

I've added some JS code in `my-blog-course/posts/learning-gatsby.mdx`. The result is great!

### 10. Render Performant Images with the Gatsby StaticImage Component

`StaticImage` is a React component designed for one-off images that adheres to best practices for performant images in browsers.

For this lesson, install `gatsby-plugin-image`, `gatsby-plugin-sharp`, and `gatsby-transformer-sharp`. Now, use the `StaticImage` component to pass an image URL as the `src`, add an `alt` attribute with a description, choose a `layout`, and pass an `aspectRatio` to crop the image.

To learn more about the available props, see the [gatsby-plugin-image README](https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-plugin-image#api).

```sh
yarn add gatsby-plugin-image gatsby-plugin-sharp
```

```js
// my-blog-course/gatsby-config.js
module.exports = {
  //...
  'gatsby-plugin-image',
  'gatsby-plugin-sharp',
  //...
};
```

```js
// my-blog-course/src/pages/index.js
import * as React from 'react';
import Layout from '../components/layout';
import SEO from '../components/seo';
import { graphql, Link } from 'gatsby';
import { StaticImage } from 'gatsby-plugin-image'; // add this line

const IndexPage = ({ data }) => {
  const posts = data.allMdx.nodes;

  return (
    <Layout>
      <SEO title={'Home Page'} />
      <StaticImage
        src='https://images.unsplash.com/photo-1506102383123-c8ef1e872756?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2250&q=80'
        alt='Sunset on the beach.'
        layout='fullWidth'
        aspectRatio={21 / 9}
      />
      {posts.map((post) => {
        return (
          <Link to={post.slug} key={post.slug}>
            <h2>{post.frontmatter.title}</h2>
          </Link>
        );
      })}
    </Layout>
  );
};

export const pageQuery = graphql`
  query {
    allMdx(sort: { fields: [frontmatter___title], order: ASC }) {
      nodes {
        slug
        frontmatter {
          title
        }
      }
    }
  }
`;

export default IndexPage;
```

### 11. Process Images and Render them using GatsbyImage

`GatsbyImage` is a React component specially designed to give users a great image experience. It combines speed and best practices.

Install `gatsby-transformer-sharp`. Source image files from your post frontmatter, process them using [gatsby-plugin-sharp](https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-plugin-image#api-1) and query them using `gatsby-transformer-sharp`. Then proceed to use the `GatsbyImage` component exported from `gatsby-plugin-image` to render the processed images.

Note: `GatsbyImage` is designed to support three different layouts, _fixed_: the image is not responsive, _fullWidth_: the image is designed to display the full width of the screen and will stretch beyond the size of its source if necessary, and _constrained_: a responsive image that will get larger and smaller depending on the screen size but will not get larger than the size of the source image (or width/height if either is passed).

```sh
yarn add gatsby-transformer-sharp
```

```js
// my-blog-course/gatsby-config.js
module.exports = {
  //...
  'gatsby-transformer-sharp', // add this line
  //...
};
```

```js
// my-blog-course/src/pages/{Mdx.slug}.js
import React from 'react';
import { graphql } from 'gatsby';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import Layout from '../components/layout';
import { GatsbyImage, getImage } from 'gatsby-plugin-image'; // add this line

const BlogPostPage = ({ data }) => {
  const post = data.mdx;
  const image = getImage(post.frontmatter.image);

  return (
    <Layout>
      <article>
        <GatsbyImage image={image} alt={post.frontmatter.imageAlt} />
        <h1>{post.frontmatter.title}</h1>
        <MDXRenderer>{post.body}</MDXRenderer>
      </article>
    </Layout>
  );
};

// change our query to get `image` and `imageAlt`
export const query = graphql`
  query BlogPostById($id: String) {
    mdx(id: { eq: $id }) {
      frontmatter {
        title
        image {
          childImageSharp {
            gatsbyImageData(layout: CONSTRAINED)
          }
        }
        imageAlt
      }
      body
    }
  }
`;

export default BlogPostPage;
```

### 12. Add Image Support to SEO Component

Add a `siteUrl` field to your `gatsby-config` metadata. Together with an image `src`, generate the URL for an image. Inside your SEO component, add an additional array to your Helmet `meta` field that is only used when an image is available. Set the appropriate fields and the `summary_large_image` Twitter card type so that the images will show up when shared on social sites.

```js
// my-blog-course/gatsby-config.js
module.exports = {
  siteMetadata: {
    title: 'My Blog Course',
    description: 'My personal blog',
    twitter: 'myhandle',
    siteUrl: 'https://example.com', // it corresponds to the domain of your production site
  },
  //...
};
```

```js
// my-blog-course/src/components/seo.js
import React from 'react';
import { Helmet } from 'react-helmet';
import { useStaticQuery, graphql } from 'gatsby';
import { siteMetadata } from '../../gatsby-config';

const SEO = ({ title, description, image, imageAlt, meta = [] }) => {
  const { site } = useStaticQuery(
    graphql`
      {
        site {
          siteMetadata {
            description
            title
            twitter
            siteUrl
          }
        }
      }
    `
  );

  const metaDescription = description || site.siteMetadata.description;
  const imageUrl = `${site.siteMetadata.siteUrl}${image}`;

  return (
    <Helmet
      title={title}
      htmlAttributes={{ lang: 'en' }}
      titleTemplate={`%s | ${siteMetadata.title}`}
      meta={[
        {
          name: 'description',
          content: metaDescription,
        },
        {
          property: 'og:title',
          content: title,
        },
        {
          property: 'og:description',
          content: metaDescription,
        },
        {
          property: 'og:type',
          content: 'website',
        },
        {
          property: 'twitter:title',
          content: title,
        },
        {
          property: 'twitter:description',
          content: metaDescription,
        },
        {
          property: 'twitter:creater',
          content: siteMetadata.twitter || '',
        },
        {
          property: 'twitter:card',
          content: 'summary',
        },
      ]
        .concat(
          image
            ? [
                {
                  property: 'og:image',
                  content: imageUrl,
                },
                {
                  property: 'og:image:alt',
                  content: imageAlt || title,
                },
                {
                  property: 'twitter:image',
                  content: imageUrl,
                },
                {
                  property: 'twitter:image:alt',
                  content: imageAlt || title,
                },
                {
                  property: 'twitter:card',
                  content: 'summary_large_image',
                },
              ]
            : [
                {
                  property: 'twitter:card',
                  content: 'summary',
                },
              ]
        )
        .concat(meta)}
    />
  );
};

export default SEO;
```

```js
// my-blog-course/src/pages/{Mdx.slug}.js
import React from 'react';
import { graphql } from 'gatsby';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import Layout from '../components/layout';
import { GatsbyImage, getImage, getSrc } from 'gatsby-plugin-image';
import SEO from '../components/seo';

const BlogPostPage = ({ data }) => {
  const post = data.mdx;
  const image = getImage(post.frontmatter.image);
  const seoImage = getSrc(post.frontmatter.image);

  return (
    <Layout>
      <article>
        <SEO
          title={post.frontmatter.title}
          description={post.frontmatter.description}
          image={seoImage}
          imageAlt={post.frontmatter.imageAlt}
        />
        <GatsbyImage image={image} alt={post.frontmatter.imageAlt} />
        <h1>{post.frontmatter.title}</h1>
        <MDXRenderer>{post.body}</MDXRenderer>
      </article>
    </Layout>
  );
};

export const query = graphql`
  query BlogPostById($id: String) {
    mdx(id: { eq: $id }) {
      frontmatter {
        title
        image {
          childImageSharp {
            gatsbyImageData(layout: CONSTRAINED)
          }
        }
        imageAlt
      }
      body
    }
  }
`;

export default BlogPostPage;
```
