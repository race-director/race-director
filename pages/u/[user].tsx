import {
  collection,
  doc,
  DocumentData,
  getDoc,
  getFirestore,
  limit,
  orderBy,
  QueryDocumentSnapshot,
  where,
} from "firebase/firestore";
import { AnimatePresence } from "framer-motion";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import { Backdrop, Modal } from "../../components/Menus";
import { Navigation } from "../../components/Navigation";
import { PostCard } from "../../components/Post";
import { post, user } from "../../types";
import { firebaseApp, paginateQuery } from "../../utils/firebase";
import { Auth } from "../_app";

interface UserPageProps {
  userData: user;
  host: string;
}

// TODO: pagination
const UserPage: React.FC<UserPageProps> = ({ userData, host }) => {
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [user] = useContext(Auth);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [posts, setPosts] = useState<post[]>([]);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData>>();

  useEffect(() => {
    loadMore();
  }, []);

  const loadMore = async (lastDoc?: QueryDocumentSnapshot<DocumentData>) => {
    const db = getFirestore(firebaseApp);
    const postCollection = collection(db, "posts");
    const orderPostsBy = orderBy("metadata.createdAt", "desc");
    const wherePosts = where("metadata.author", "==", userData?.uid);
    const queryLimit = limit(2);
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

  useEffect(() => {
    if (user) {
      setIsOwnProfile(user.uid === userData?.uid);
    } else {
      setIsOwnProfile(false);
    }
  }, [user]);

  return (
    <div>
      <Head>
        <title>{userData?.displayName}&apos;s Profile</title>
      </Head>
      <AnimatePresence>
        {isEditOpen && (
          <Backdrop onClick={() => setIsEditOpen(false)}>
            <Modal>
              <div className="p-8 grid gap-4">
                <h1 className="text-2xl text-zinc-200/90 font-bold uppercase">
                  This feature is not implemented yet!
                </h1>
                <p className="text-zinc-200/70">It will be, just not yet</p>
                <div className="grid sm:grid-cols-2 grid-cols-1 gap-2 pt-2 text-zinc-200">
                  <button
                    onClick={() => setIsEditOpen(false)}
                    className="bg-zinc-700 hover:bg-zinc-600 active:scale-90 transform transition-all py-2 uppercase font-bold text- rounded-md"
                  >
                    Okay
                  </button>
                  <button
                    onClick={() => setIsEditOpen(false)}
                    className="bg-red-600 text-center hover:bg-red-700 active:scale-90 transform transition-all py-2 uppercase font-bold rounded-md"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </Modal>
          </Backdrop>
        )}
      </AnimatePresence>
      <div className="w-full flex flex-col items-center dark:bg-zinc-900 min-h-screen pb-12">
        <Navigation></Navigation>
        <div className="px-4 max-w-4xl w-screen dark:prose-invert font-sans py-8 md:py-12">
          <div className="grid md:grid-cols-4 grid-cols-1 gap-6 md:gap-8">
            <div className="grid items-center justify-center">
              <Image
                className="rounded-full object-cover"
                src={userData?.photoURL || ""}
                height={190}
                width={190}
                alt="User Profile"
              ></Image>
            </div>
            <div className="col-span-2 flex flex-col space-y-2 justify-center">
              <h1 className="text-3xl font-semibold text-zinc-200">
                {userData?.displayName}
              </h1>
              <p className="text-sm text-zinc-200/80">
                {userData?.bio ||
                  (isOwnProfile &&
                    !userData?.bio &&
                    "Your bio goes here. Only you can see this message.")}
              </p>
              <div className="pt-2 flex space-x-2">
                <button
                  onClick={() => setIsEditOpen(true)}
                  className="bg-red-600 disabled:cursor-not-allowed px-6 py-1 font-bold transition-all transform active:scale-95 hover:bg-red-700 uppercase text-zinc-200 rounded-md"
                >
                  {isOwnProfile ? "Edit Profile" : "Follow"}
                </button>
              </div>
            </div>
            <div className="flex md:flex-col md:space-y-4 space-y-0 md:space-x-0 space-x-4 md:justify-center md:px-8 md:border-l md:border-t-0 border-t py-4 border-zinc-200">
              <div>
                <p className="text-sm uppercase text-zinc-200/80">Following</p>
                <p className="text-lg font-bold text-zinc-200">
                  {userData?.following}
                </p>
              </div>
              <div>
                <p className="text-sm uppercase text-zinc-200/80">Following</p>
                <p className="text-lg font-bold text-zinc-200">
                  {userData?.following}
                </p>
              </div>
            </div>
          </div>
          <div className="md:pt-24 pt-6 grid md:gap-8">
            <h1 className="text-2xl lg:text-3xl font-bold uppercase text-zinc-200/80 pb-2 lg:pb-2">
              {userData?.displayName}&apos;s posts
            </h1>
            <div className="grid gap-4">
              {posts?.map((p, idx) => (
                <PostCard
                  priority={idx === 0}
                  isLast={idx === posts.length - 1}
                  href={`${host}p/${p.id}`}
                  post={p}
                  key={idx}
                  loadMore={() => loadMore(lastDoc)}
                ></PostCard>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<UserPageProps> = async (
  c
) => {
  let user: string | null = null;
  // Handle params edge cases
  if (c.params?.user) {
    if (typeof c.params.user === "string") {
      user = c.params.user;
    } else {
      user = c.params.user[0];
    }
  }
  const db = getFirestore(firebaseApp);
  const docRef = doc(db, "users", user || "");
  const docRes = await getDoc(docRef);

  if (docRes.exists()) {
    const userData = docRes.data() as user;
    return {
      props: {
        userData,
        host: process.env.HOST || "",
      },
    };
  }

  return { notFound: true };
};

export default UserPage;
