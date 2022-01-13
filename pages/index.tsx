import {
  collection,
  getFirestore,
  limit,
  orderBy,
  query,
} from "firebase/firestore";
import Head from "next/head";
import Link from "next/link";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Navigation } from "../components/Navigation";
import { firebaseApp } from "../utils/firebase";

export default function Home() {
  const postsQ = query(
    collection(getFirestore(firebaseApp), "posts"),
    orderBy("metadata.createdAt", "desc"),
    limit(3)
  );
  const [posts, loading] = useCollectionData(postsQ, { idField: "id" });

  return (
    <div className="flex flex-col items-center min-h-screen dark:bg-zinc-900">
      <Head>
        <title>Race Director</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navigation></Navigation>
      <div className="max-w-7xl w-full flex flex-col">
        {!loading && (
          <div className="grid lg:grid-cols-8 lg:grid-rows-2 grid-rows-1 grid-cols-2">
            <div className="object-cover lg:col-span-5 col-span-5 lg:row-span-2 row-span-1">
              {posts && posts[0] && (
                <Link href={`/p/${posts[0].id}`}>
                  <a className="">
                    <div className="h-full w-full relative">
                      <img
                        src={posts[0].coverImage.coverImageUrl}
                        className="h-full w-full object-cover"
                      ></img>
                      <div className="absolute grid items-end lg:px-6 px-4 py-4 lg:py-12 bottom-0 w-full bg-gradient-to-bl from-transparent to-black/80 top-0">
                        <h1 className="lg:text-5xl md:text-4xl text-3xl font-black text-zinc-100">
                          {posts[0].metadata.headline}
                        </h1>
                      </div>
                    </div>
                  </a>
                </Link>
              )}
            </div>

            <div className="lg:col-span-3 lg:h-72 h-60">
              {posts && posts[0] && (
                <Link href={`/p/${posts[1].id}`}>
                  <a className="">
                    <div className="h-full w-full relative">
                      <img
                        src={posts[1].coverImage.coverImageUrl}
                        className="h-full w-full object-cover"
                      ></img>
                      <div className="absolute grid items-end lg:px-6 px-4 py-4 lg:py-12 bottom-0 w-full bg-gradient-to-bl from-transparent to-black/80 top-0">
                        <h1 className="lg:text-2xl md:text-2xl text-xl font-black text-zinc-100">
                          {posts[1].metadata.headline}
                        </h1>
                      </div>
                    </div>
                  </a>
                </Link>
              )}
            </div>
            <div className="col-span-3 lg:h-72 h-60">
              {posts && posts[2] && (
                <Link href={`/p/${posts[2].id}`}>
                  <a className="">
                    <div className="h-full w-full relative">
                      <img
                        src={posts[2].coverImage.coverImageUrl}
                        className="h-full w-full object-cover"
                      ></img>
                      <div className="absolute grid items-end lg:px-6 px-4 py-4 lg:py-12 bottom-0 w-full bg-gradient-to-bl from-transparent to-black/80 top-0">
                        <h1 className="lg:text-2xl md:text-2xl text-xl font-black text-zinc-100">
                          {posts[2].metadata.headline}
                        </h1>
                      </div>
                    </div>
                  </a>
                </Link>
              )}
            </div>
          </div>
        )}

        {/* {!loading && (
          <pre className="text-white">{JSON.stringify(posts, null, 2)}</pre>
        )} */}
      </div>
    </div>
  );
}
