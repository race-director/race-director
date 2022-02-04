import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { Navigation } from "../components/Navigation";

interface ServerErrorProps {}

const ServerError: React.FC<ServerErrorProps> = () => {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center pb-12 dark:bg-zinc-900">
      <Head>
        <title>Race Director - Server Error</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <Navigation></Navigation> */}
      <div className="flex w-full max-w-screen-2xl flex-col items-center justify-center space-y-8 px-4 pt-32">
        <div className="rounded-sm border-2 border-zinc-900/80 px-2 py-1 text-base font-bold tracking-tighter text-zinc-900/80 dark:border-zinc-50 dark:text-zinc-100 md:text-2xl">
          Race Director
        </div>
        <h1 className="text-center text-3xl font-black text-zinc-200 md:text-4xl">
          (500) <br /> The server is currently shut down because of the database
          quota being reached. Quota renews daily, so check again in a couple of
          hours.
        </h1>
        <p className="text-lg text-zinc-200/80">
          I&apos;m really sorry for the inconvenience
        </p>

        <div className="flex space-x-2">
          {/* <Link href="/">
            <a className="bg-zinc-600 px-4 text-zinc-200 hover:bg-zinc-700 active:scale-90 transform transition-all py-2 uppercase font-bold rounded-md">
              Go home
            </a>
          </Link>
          <button
            onClick={() => router.back()}
            className="bg-red-600 px-4 text-zinc-200 text-center hover:bg-red-700 active:scale-90 transform transition-all py-2 uppercase font-bold rounded-md"
          >
            Go back
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default ServerError;
