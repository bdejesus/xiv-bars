/* eslint-disable react/no-danger */
import React from 'react';
import Document, {
  Html, Main, NextScript
} from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en-US">
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
