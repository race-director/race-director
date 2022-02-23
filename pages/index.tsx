import {
  collection,
  DocumentData,
  getFirestore,
  limit,
  orderBy,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { DiscordActivity } from "../components/Discord";
import { Navigation } from "../components/Navigation";
import { PostCard } from "../components/Post";
import { post } from "../types";
import { firebaseApp, paginateQuery } from "../utils/firebase";

interface HomePageProps {
  host: string;
}
// Testing webhook
const HomePage: React.FC<HomePageProps> = ({ host }) => {
  const [posts, setPosts] = useState<post[]>([]);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData>>();

  useEffect(() => {
    loadMore();
  }, []);

  const loadMore = async (lastDoc?: QueryDocumentSnapshot<DocumentData>) => {
    const db = getFirestore(firebaseApp);
    const postCollection = collection(db, "posts");
    const orderPostsBy = orderBy("score", "desc");
    const queryLimit = limit(5);
    if (lastDoc) {
      paginateQuery(postCollection, [orderPostsBy, queryLimit], lastDoc).then(
        (docs) => {
          const lastVisible = docs.docs[docs.docs.length - 1];
          setLastDoc(lastVisible);
          let posts = docs.docs.map((doc) => doc.data() as post);
          setPosts((prevPosts) => [...prevPosts, ...posts]);
        }
      );
    } else {
      paginateQuery(postCollection, [orderPostsBy, queryLimit]).then((docs) => {
        const lastVisible = docs.docs[docs.docs.length - 1];
        setLastDoc(lastVisible);
        let posts = docs.docs.map((doc) => doc.data() as post);
        setPosts((prevPosts) => [...prevPosts, ...posts]);
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center pb-12 dark:bg-zinc-900">
      <Head>
        <title>Race Director</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navigation></Navigation>
      <div className="flex w-full max-w-screen-2xl flex-col">
        <div className="grid grid-cols-2 grid-rows-1 lg:grid-cols-8 lg:grid-rows-2">
          <div className="col-span-5 row-span-1 border-zinc-200 bg-black lg:col-span-5 lg:row-span-2">
            {posts[0] && (
              <Link href={`/p/${posts[0].id}`}>
                <a>
                  <div className="relative h-[20rem] md:h-[30rem] lg:h-[36rem]">
                    <div className="h-full w-full overflow-hidden object-cover">
                      <Image
                        priority
                        alt={posts[0].coverImage.coverImageCaption}
                        src={posts[0].coverImage.coverImageUrl}
                        layout="fill"
                        className="object-contain"
                      ></Image>
                    </div>
                    <div className="absolute bottom-0 top-0 grid w-full items-end bg-gradient-to-b from-transparent via-black/50 to-black/80 px-4 py-4 transition-all hover:opacity-80 lg:via-transparent lg:px-6 lg:py-12">
                      <h1 className="text-3xl font-black text-zinc-100 md:text-4xl lg:text-5xl">
                        {posts[0].metadata.headline}
                      </h1>
                    </div>
                  </div>
                </a>
              </Link>
            )}
          </div>
          <div className="h-60 border-zinc-200 bg-black lg:col-span-3 lg:h-72">
            {posts[1] && (
              <Link href={`/p/${posts[1].id}`}>
                <a className="">
                  <div className="relative h-full w-full">
                    <div className="h-full w-full overflow-hidden object-cover">
                      <Image
                        alt={posts[1].coverImage.coverImageCaption}
                        src={posts[1].coverImage.coverImageUrl}
                        className="object-cover"
                        layout="fill"
                      ></Image>
                    </div>
                    <div className="absolute bottom-0 top-0 grid w-full items-end bg-gradient-to-b from-transparent via-black/50 to-black/80 px-4 py-4 transition-all hover:opacity-80 lg:via-transparent lg:px-6 lg:py-12">
                      <h1 className="text-xl font-black text-zinc-100 md:text-2xl lg:text-2xl">
                        {posts[1].metadata.headline}
                      </h1>
                    </div>
                  </div>
                </a>
              </Link>
            )}
          </div>
          <div className="col-span-3 h-60 border-zinc-200 bg-black lg:h-72">
            {posts[2] && (
              <Link href={`/p/${posts[2].id}`}>
                <a className="">
                  <div className="relative h-full w-full">
                    <div className="h-full w-full overflow-hidden object-cover">
                      <Image
                        alt={posts[2].coverImage.coverImageCaption}
                        src={posts[2].coverImage.coverImageUrl}
                        className="object-cover"
                        layout="fill"
                      ></Image>
                    </div>
                    <div className="absolute bottom-0 top-0 grid w-full items-end bg-gradient-to-b from-transparent via-black/50 to-black/80 px-4 py-4 transition-all hover:opacity-80 lg:via-transparent lg:px-6 lg:py-12">
                      <h1 className="text-xl font-black text-zinc-100 md:text-2xl lg:text-2xl">
                        {posts[2].metadata.headline}
                      </h1>
                    </div>
                  </div>
                </a>
              </Link>
            )}
          </div>
        </div>
        <div className="grid gap-6 px-4 pt-6 lg:grid-cols-12 lg:px-10 lg:pt-12">
          <div className="items-start justify-start lg:col-span-5">
            <div className="sticky top-4 w-full">
              <h1 className="pb-2 text-3xl font-bold uppercase text-zinc-200 lg:pb-2 lg:text-4xl">
                Activity
              </h1>
              <div className="grid gap-4 pt-4">
                <DiscordActivity apiUrl="https://discord.com/api/guilds/937070357444190269/widget.json"></DiscordActivity>
              </div>
            </div>
          </div>
          <div className="grid gap-4 lg:col-span-7">
            <h1 className="pb-2 text-3xl font-bold uppercase text-zinc-200 lg:pb-2 lg:text-4xl">
              Suggested
            </h1>
            {posts.length > 3 &&
              posts.map((p, idx) => {
                if (idx >= 3)
                  return (
                    <PostCard
                      showAuthor
                      isLast={idx === posts.length - 1}
                      href={`${host}p/${p.id}`}
                      post={p}
                      key={idx}
                      loadMore={() => loadMore(lastDoc)}
                    ></PostCard>
                  );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<
  HomePageProps
> = async () => {
  return {
    props: {
      host: process.env.HOST || "",
    },
  };
};

export default HomePage;
