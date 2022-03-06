import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class RootDocument extends Document {
  render() {
    return (
      <Html lang='ko'>
        <Head>
          <meta charSet="utf-8" />
          {/* <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=no"
          /> */}
          <meta name="description" content="SSAFY 교육생만을 위한 커뮤니티!" />
          <meta name="keywords" content="SSAFY, 커뮤니티" />
          <style global jsx>
            {`
              html,
              body,
              #__next {
                height: 100%;
                width: 100%;
                overflow: hidden;
              }
            `}
          </style>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
