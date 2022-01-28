import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { Navigation } from "../components/Navigation";

interface ServerErrorProps {}

const ServerError: React.FC<ServerErrorProps> = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center min-h-screen dark:bg-zinc-900 pb-12">
      <Head>
        <title>Race Director - Server Error</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <Navigation></Navigation> */}
      <div className="max-w-screen-2xl w-full flex flex-col space-y-8 items-center justify-center pt-32 px-4">
        <div className="text-base md:text-2xl font-bold tracking-tighter text-zinc-900/80 dark:text-zinc-100 border-2 dark:border-zinc-50 border-zinc-900/80 px-2 py-1 rounded-sm">
          Race Director
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-zinc-200 text-center">
          (500) <br /> The server is currently in a scheduled maintenance.
          Please check again in a couple of hours while I get ready to open the
          beta!.
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
