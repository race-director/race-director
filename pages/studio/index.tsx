import {
  collection,
  DocumentData,
  getFirestore,
  limit,
  orderBy,
  QueryDocumentSnapshot,
  where,
} from "firebase/firestore";
import Head from "next/head";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import { Navigation } from "../../components/Navigation";
import { post } from "../../types";
import { firebaseApp, paginateQuery } from "../../utils/firebase";
import { Auth } from "../_app";

interface StudioPageProps {}

const StudioPage: React.FC<StudioPageProps> = () => {
  const [user, userLoading] = useContext(Auth);
  const [posts, setPosts] = useState<post[]>([]);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData>>();

  useEffect(() => {
    if (user && !userLoading) {
      loadMore();
    }
  }, [userLoading]);

  const loadMore = (lastDoc?: QueryDocumentSnapshot<DocumentData>) => {
    const db = getFirestore(firebaseApp);
    const postCollection = collection(db, "posts");
    const orderPostsBy = orderBy("metadata.createdAt", "desc");
    const wherePosts = where("metadata.author", "==", user?.uid);
    const queryLimit = limit(3);
    if (lastDoc) {
      paginateQuery(
        postCollection,
        [orderPostsBy, queryLimit, wherePosts],
        lastDoc
      ).then((docs) => {
        const lastVisible = docs.docs[docs.docs.length - 1];
        setLastDoc(lastVisible);
        let posts = docs.docs.map((doc) => doc.data() as post);
        setPosts((prevPosts) => [...prevPosts, ...posts]);
      });
    } else {
      paginateQuery(postCollection, [
        orderPostsBy,
        queryLimit,
        wherePosts,
      ]).then((docs) => {
        const lastVisible = docs.docs[docs.docs.length - 1];
        setLastDoc(lastVisible);
        let posts = docs.docs.map((doc) => doc.data() as post);
        setPosts((prevPosts) => [...prevPosts, ...posts]);
      });
    }
  };

  return (
    <div className="dark:bg-zinc-900 min-h-screen w-full flex items-center flex-col relative">
      <Head>
        <title>Race Director - Studio</title>
      </Head>
      <Navigation></Navigation>
      {user ? (
        <>
          <div className="max-w-screen-2xl w-screen grid">
            <div className="grid gap-6 px-4 py-8 md:py-12">
              <h1 className="text-4xl text-zinc-200 font-bold">Your posts</h1>
              <div className="grid gap-4">
                {posts?.length ? (
                  posts.map((p) => {
                    const { coverImage, id, metadata } = p;
                    return (
                      <Link key={id} href={`p/${id}`}>
                        <a>
                          <div className="flex flex-col lg:flex-row space-x-4 border border-zinc-200 rounded-md overflow-hidden">
                            <div className="lg:h-44 aspect-video bg-black">
                              <img
                                className="object-contain h-full w-full"
                                src={coverImage.coverImageUrl}
                              ></img>
                            </div>
                            <div className="text-zinc-200 py-4">
                              <h1 className="text-2xl font-bold tracking-tighter">
                                {metadata.headline}
                              </h1>
                              <p>{metadata.summary}</p>
                            </div>
                          </div>
                        </a>
                      </Link>
                    );
                  })
                ) : (
                  <div className="flex flex-col lg:flex-row space-x-4 border border-zinc-200 rounded-md overflow-hidden px-4">
                    <div className="text-zinc-200 py-4">
                      <h1 className="text-2xl font-bold tracking-tighter">
                        You have not written any posts yet
                      </h1>
                      <p>
                        Write your first by clicking on the red button at the
                        bottom of the screen
                      </p>
                    </div>
                  </div>
                )}
                <button
                  onClick={() => loadMore(lastDoc)}
                  className="text-lg text-zinc-200/80 py-2 px-4 border-zinc-200/70 border-2 rounded-md font-semibold transform active:scale-95 transition-all"
                >
                  Load more
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="pt-8">
          <p className="text-xl uppercase font-bold text-zinc-200/90">
            Log in to use the studio
          </p>
        </div>
      )}
      {user && (
        <Link href="/studio/new">
          <a className="fixed bottom-4 right-4 md:bottom-8 md:right-8 bg-red-600 h-16 w-16 rounded-full grid items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 0 24 24"
              width="24px"
              fill="#000000"
              className="fill-zinc-50 h-10 w-10"
            >
              <path d="M0 0h24v24H0V0z" fill="none" />
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
          </a>
        </Link>
      )}
    </div>
  );
};

export default StudioPage;
