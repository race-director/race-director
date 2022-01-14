import {
  collection,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
} from "firebase/firestore";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Navigation } from "../components/Navigation";
import { post } from "../types";
import { firebaseApp } from "../utils/firebase";

interface HomePageProps {
  posts: [post, post, post];
}

const HomePage: React.FC<HomePageProps> = ({ posts }) => {
  return (
    <div className="flex flex-col items-center min-h-screen dark:bg-zinc-900">
      <Head>
        <title>Race Director</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navigation></Navigation>
      <div className="max-w-7xl w-full flex flex-col">
        <div className="grid lg:grid-cols-8 lg:grid-rows-2 grid-rows-1 grid-cols-2">
          <div className="lg:col-span-5 col-span-5 lg:row-span-2 row-span-1">
            <Link href={`/p/${posts[0].id}`}>
              <a>
                <div className="lg:h-[36rem] h-[20rem] md:h-[30rem] relative">
                  <div className="h-full w-full object-cover overflow-hidden">
                    <Image
                      alt={posts[0].coverImage.coverImageCaption}
                      src={posts[0].coverImage.coverImageUrl}
                      layout="fill"
                      className="object-cover"
                    ></Image>
                  </div>
                  <div className="absolute grid items-end lg:px-6 px-4 py-4 lg:py-12 bottom-0 w-full bg-gradient-to-b from-transparent to-black/80 via-transparent top-0">
                    <h1 className="lg:text-5xl md:text-4xl text-3xl font-black text-zinc-100">
                      {posts[0].metadata.headline}
                    </h1>
                  </div>
                </div>
              </a>
            </Link>
          </div>

          <div className="lg:col-span-3 lg:h-72 h-60">
            <Link href={`/p/${posts[1].id}`}>
              <a className="">
                <div className="h-full w-full relative">
                  <div className="h-full w-full object-cover overflow-hidden">
                    <Image
                      alt={posts[1].coverImage.coverImageCaption}
                      src={posts[1].coverImage.coverImageUrl}
                      className="object-cover"
                      layout="fill"
                    ></Image>
                  </div>
                  <div className="absolute grid items-end lg:px-6 px-4 py-4 lg:py-12 bottom-0 w-full bg-gradient-to-b from-transparent to-black/80 via-transparent top-0">
                    <h1 className="lg:text-2xl md:text-2xl text-xl font-black text-zinc-100">
                      {posts[1].metadata.headline}
                    </h1>
                  </div>
                </div>
              </a>
            </Link>
          </div>
          <div className="col-span-3 lg:h-72 h-60">
            <Link href={`/p/${posts[2].id}`}>
              <a className="">
                <div className="h-full w-full relative">
                  <div className="h-full w-full object-cover overflow-hidden">
                    <Image
                      alt={posts[2].coverImage.coverImageCaption}
                      src={posts[2].coverImage.coverImageUrl}
                      className="object-cover"
                      layout="fill"
                    ></Image>
                  </div>
                  <div className="absolute grid items-end lg:px-6 px-4 py-4 lg:py-12 bottom-0 w-full bg-gradient-to-b from-transparent to-black/80 via-transparent top-0">
                    <h1 className="lg:text-2xl md:text-2xl text-xl font-black text-zinc-100">
                      {posts[2].metadata.headline}
                    </h1>
                  </div>
                </div>
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<
  HomePageProps
> = async () => {
  const postsQ = query(
    collection(getFirestore(firebaseApp), "posts"),
    orderBy("metadata.createdAt", "desc"),
    limit(3)
  );

  const postRes = await getDocs(postsQ);
  const posts = postRes.docs.map((doc) => doc.data());

  return {
    props: {
      posts: posts as [post, post, post],
    },
  };
};

export default HomePage;
