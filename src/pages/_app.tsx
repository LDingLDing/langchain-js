import type { AppProps } from "next/app";
import type { Metadata } from "next";

import Layout from "../components/layout";
import "./globals.css";

export const metadata: Metadata = {
  title: "...",
  description: "...",
};

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
