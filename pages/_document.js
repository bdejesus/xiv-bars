/* eslint-disable react/no-danger */
import React from 'react';
import Document, {
  Html, Head, Main, NextScript
} from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en-US">
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
