import {
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  getFirestore,
  increment,
  limit,
  orderBy,
  QueryDocumentSnapshot,
  setDoc,
  where,
} from "firebase/firestore";
import { AnimatePresence } from "framer-motion";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { Backdrop, Modal } from "../../components/Menus";
import { Navigation } from "../../components/Navigation";
import { PostCard } from "../../components/Post";
import { post, user } from "../../types";
import { follower, following } from "../../types/followers";
import { firebaseApp, paginateQuery } from "../../utils/firebase";
import { Auth } from "../_app";

interface UserPageProps {
  userData: user;
  host: string;
}

// TODO: pagination
const UserPage: React.FC<UserPageProps> = ({ userData, host }) => {
  const [localFollowingCount, setLocalFollowingCount] = useState<number>(
    userData?.following || 0
  );
  const [localFollowerCount, setLocalFollowerCount] = useState<number>(
    userData?.following || 0
  );
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [user] = useContext(Auth);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [posts, setPosts] = useState<post[]>([]);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData>>();

  const db = getFirestore(firebaseApp);
  const isFollowingDoc = doc(
    db,
    "users",
    `${userData?.uid}/followers/${user?.uid}`
  );
  const [isFollowing, isFollowingLoading] = useDocumentData(isFollowingDoc);

  useEffect(() => {
    loadMore();
  }, []);

  const loadMore = async (lastDoc?: QueryDocumentSnapshot<DocumentData>) => {
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
    setLocalFollowerCount(userData?.followers || 0);
    setLocalFollowingCount(userData?.following || 0);

    if (user) {
      setIsOwnProfile(user.uid === userData?.uid);
    } else {
      setIsOwnProfile(false);
    }
  }, [userData, user]);

  const handleFollow = () => {
    const currentUserDoc = doc(db, "users", userData?.uid || "");
    const currentAuthDoc = doc(db, "users", user?.uid || "");
    const followingDoc = doc(
      db,
      "users",
      `${user?.uid}/following/${userData?.uid}`
    );

    if (!!isFollowing) {
      // Unfollow
      deleteDoc(followingDoc);
      deleteDoc(isFollowingDoc);
      setDoc(currentUserDoc, { followers: increment(-1) }, { merge: true });
      setDoc(currentAuthDoc, { following: increment(-1) }, { merge: true });
      setLocalFollowerCount(localFollowerCount - 1);
    } else {
      // Follow
      setDoc(followingDoc, {
        createdAt: new Date().getTime(),
        userId: userData?.uid,
      } as following);
      setDoc(isFollowingDoc, {
        createdAt: new Date().getTime(),
        userId: user?.uid,
      } as follower);
      setDoc(currentUserDoc, { followers: increment(1) }, { merge: true });
      setDoc(currentAuthDoc, { following: increment(1) }, { merge: true });
      setLocalFollowerCount(localFollowerCount + 1);
    }
  };

  // const handleEditProfile = () => {
  //   console.log("edit");
  // };

  return (
    <div>
      <Head>
        <title>{userData?.displayName}&apos;s Profile</title>
      </Head>
      <AnimatePresence>
        {isEditOpen && (
          <Backdrop onClick={() => setIsEditOpen(false)}>
            <Modal>
              <div className="grid gap-4 p-8">
                <h1 className="text-2xl font-bold uppercase text-zinc-200/90">
                  This feature is not implemented yet!
                </h1>
                <p className="text-zinc-200/70">It will be, just not yet</p>
                <div className="grid grid-cols-1 gap-2 pt-2 text-zinc-200 sm:grid-cols-2">
                  <button
                    onClick={() => setIsEditOpen(false)}
                    className="text- transform rounded-md bg-zinc-700 py-2 font-bold uppercase transition-all hover:bg-zinc-600 active:scale-90"
                  >
                    Okay
                  </button>
                  <button
                    onClick={() => setIsEditOpen(false)}
                    className="transform rounded-md bg-red-600 py-2 text-center font-bold uppercase transition-all hover:bg-red-700 active:scale-90"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </Modal>
          </Backdrop>
        )}
      </AnimatePresence>
      <div className="flex min-h-screen w-full flex-col items-center pb-12 dark:bg-zinc-900">
        <Navigation></Navigation>
        <div className="w-screen max-w-4xl px-4 py-8 font-sans dark:prose-invert md:py-12">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-4 md:gap-8">
            <div className="grid items-center justify-center">
              <Image
                className="rounded-full object-cover"
                src={userData?.photoURL || ""}
                height={190}
                width={190}
                alt="User Profile"
              ></Image>
            </div>
            <div className="col-span-2 flex flex-col justify-center space-y-2">
              <h1 className="text-3xl font-semibold text-zinc-200">
                {userData?.displayName}
              </h1>
              <p className="text-sm text-zinc-200/80">
                {userData?.bio ||
                  (isOwnProfile &&
                    !userData?.bio &&
                    "Your bio goes here. Only you can see this message.")}
              </p>
              <div className="flex space-x-2 pt-2">
                <button
                  onClick={
                    isOwnProfile ? () => setIsEditOpen(true) : handleFollow
                  }
                  className="transform rounded-md bg-red-600 px-6 py-1 font-bold uppercase text-zinc-200 transition-all hover:bg-red-700 active:scale-95 disabled:cursor-not-allowed"
                >
                  {isOwnProfile
                    ? "Edit Profile"
                    : `${
                        !isFollowingLoading
                          ? !!isFollowing
                            ? "Unfollow"
                            : "Follow"
                          : "Loading"
                      }`}
                </button>
              </div>
            </div>
            <div className="flex space-y-0 space-x-4 border-t border-zinc-200 py-4 md:flex-col md:justify-center md:space-y-4 md:space-x-0 md:border-l md:border-t-0 md:px-8">
              <div>
                <p className="text-sm uppercase text-zinc-200/80">Following</p>
                <p className="text-lg font-bold text-zinc-200">
                  {localFollowingCount}
                </p>
              </div>
              <div>
                <p className="text-sm uppercase text-zinc-200/80">Followers</p>
                <p className="text-lg font-bold text-zinc-200">
                  {localFollowerCount}
                </p>
              </div>
            </div>
          </div>
          <div className="grid pt-6 md:gap-8 md:pt-24">
            <h1 className="pb-2 text-2xl font-bold uppercase text-zinc-200/80 lg:pb-2 lg:text-3xl">
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
