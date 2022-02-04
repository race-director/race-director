import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { Navigation } from "../components/Navigation";

interface NotFoundPageProps {}

const NotFoundPage: React.FC<NotFoundPageProps> = () => {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center pb-12 dark:bg-zinc-900">
      <Head>
        <title>Race Director - Page not found</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navigation></Navigation>
      <div className="flex w-full max-w-screen-2xl flex-col items-center justify-center space-y-8 px-4 pt-32">
        <h1 className="text-center text-3xl font-black text-zinc-200 md:text-4xl">
          (404) <br /> Snap! We couldn&apos;t find what you were looking for.
        </h1>
        <div className="flex space-x-2">
          <Link href="/">
            <a className="transform rounded-md bg-zinc-600 px-4 py-2 font-bold uppercase text-zinc-200 transition-all hover:bg-zinc-700 active:scale-90">
              Go home
            </a>
          </Link>
          <button
            onClick={() => router.back()}
            className="transform rounded-md bg-red-600 px-4 py-2 text-center font-bold uppercase text-zinc-200 transition-all hover:bg-red-700 active:scale-90"
          >
            Go back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
