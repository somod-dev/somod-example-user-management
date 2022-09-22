import { CssBaseline } from "@mui/material";
import { NextComponentType } from "next";
import { AppProps } from "next/app";
import Head from "next/head";
import { FunctionComponent } from "react";

const App: FunctionComponent<AppProps & { Component: NextComponentType }> = ({
  Component,
  pageProps
}) => {
  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <CssBaseline enableColorScheme />
      <Component {...pageProps} />
    </>
  );
};

export default App;
