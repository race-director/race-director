import { collection, getFirestore } from "firebase/firestore";
import Head from "next/head";
import Link from "next/link";
import React, { useContext } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { editorContent } from "../../components/Editor";
import { Navigation } from "../../components/Navigation";
import { firebaseApp } from "../../utils/firebase";
import { Auth } from "../_app";

interface StudioPageProps {}

const StudioPage: React.FC<StudioPageProps> = () => {
  const [user] = useContext(Auth);
  const [snapshot, loading] = useCollectionData(
    collection(getFirestore(firebaseApp), `users/${user?.uid}/posts`),
    { idField: "id" }
  );

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
                {!loading && snapshot?.length ? (
                  snapshot.map((p) => {
                    const { coverImage, headline, summary } =
                      p as unknown as editorContent;
                    return (
                      <Link key={p.id} href={`p/${p.id}`}>
                        <a>
                          <div className="flex flex-col lg:flex-row space-x-4 border border-zinc-200 rounded-md overflow-hidden">
                            <div>
                              <img
                                className="lg:h-44 aspect-video object-cover w-full"
                                src={coverImage.coverImageUrl}
                              ></img>
                            </div>
                            <div className="text-zinc-200 py-4">
                              <h1 className="text-2xl font-bold tracking-tighter">
                                {headline}
                              </h1>
                              <p>{summary}</p>
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
