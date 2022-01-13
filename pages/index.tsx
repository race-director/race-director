import Head from "next/head";
import { Navigation } from "../components/Navigation";

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen dark:bg-zinc-900">
      <Head>
        <title>Race Director</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navigation></Navigation>
      <div className="max-w-7xl w-full flex flex-col prose dark:prose-invert"></div>
    </div>
  );
}
