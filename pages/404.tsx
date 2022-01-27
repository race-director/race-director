import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { Navigation } from "../components/Navigation";

interface NotFoundPageProps {}

const NotFoundPage: React.FC<NotFoundPageProps> = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center min-h-screen dark:bg-zinc-900 pb-12">
      <Head>
        <title>Race Director - Page not found</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navigation></Navigation>
      <div className="max-w-screen-2xl w-full flex flex-col space-y-8 items-center justify-center pt-32 px-4">
        <h1 className="text-3xl md:text-4xl font-black text-zinc-200 text-center">
          (404) <br /> Snap! We couldn&apos;t find what you were looking for.
        </h1>
        <div className="flex space-x-2">
          <Link href="/">
            <a className="bg-zinc-600 px-4 text-zinc-200 hover:bg-zinc-700 active:scale-90 transform transition-all py-2 uppercase font-bold rounded-md">
              Go home
            </a>
          </Link>
          <button
            onClick={() => router.back()}
            className="bg-red-600 px-4 text-zinc-200 text-center hover:bg-red-700 active:scale-90 transform transition-all py-2 uppercase font-bold rounded-md"
          >
            Go back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
