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
    <div className="relative flex min-h-screen w-full flex-col items-center dark:bg-zinc-900">
      <Head>
        <title>Race Director - Studio</title>
      </Head>
      <Navigation></Navigation>
      {user ? (
        <>
          <div className="grid w-screen max-w-screen-2xl">
            <div className="grid gap-6 px-4 py-8 md:py-12">
              <h1 className="text-4xl font-bold text-zinc-200">Your posts</h1>
              <div className="grid gap-4">
                {posts?.length ? (
                  posts.map((p) => {
                    const { coverImage, id, metadata } = p;
                    return (
                      <Link key={id} href={`p/${id}`}>
                        <a>
                          <div className="flex flex-col space-x-4 overflow-hidden rounded-md border border-zinc-200 lg:flex-row">
                            <div className="aspect-video bg-black lg:h-44">
                              <img
                                className="h-full w-full object-contain"
                                src={coverImage.coverImageUrl}
                              ></img>
                            </div>
                            <div className="py-4 text-zinc-200">
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
                  <div className="flex flex-col space-x-4 overflow-hidden rounded-md border border-zinc-200 px-4 lg:flex-row">
                    <div className="py-4 text-zinc-200">
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
                  className="transform rounded-md border-2 border-zinc-200/70 py-2 px-4 text-lg font-semibold text-zinc-200/80 transition-all active:scale-95"
                >
                  Load more
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="pt-8">
          <p className="text-xl font-bold uppercase text-zinc-200/90">
            Log in to use the studio
          </p>
        </div>
      )}
      {user && (
        <Link href="/studio/new">
          <a className="fixed bottom-4 right-4 grid h-16 w-16 items-center justify-center rounded-full bg-red-600 md:bottom-8 md:right-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 0 24 24"
              width="24px"
              fill="#000000"
              className="h-10 w-10 fill-zinc-50"
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
