import {
  collection,
  getDocs,
  getFirestore,
  limit,
  query,
} from "firebase/firestore";
import { post } from "../types";

const EXTERNAL_DATA_URL = "https://racedirector.vercel.app";

function generateSiteMap(posts: post[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <!--We manually set the two URLs we know already-->
     <url>
       <loc>${EXTERNAL_DATA_URL}</loc>
     </url>
     ${posts
       .map(({ id }) => {
         return `
       <url>
           <loc>${`${EXTERNAL_DATA_URL}/p/${id}`}</loc>
       </url>
     `;
       })
       .join("")}
   </urlset>
 `;
}

import type { GetServerSideProps } from "next";
import { firebaseApp } from "../utils/firebase";

const Page = () => {};

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const db = getFirestore(firebaseApp);
  const postCollection = collection(db, "posts");
  const q = query(postCollection, limit(500));
  const querySnapshot = await getDocs(q);

  const posts = querySnapshot.docs.map((doc) => {
    return {
      id: doc.id,
      ...doc.data(),
    } as post;
  });

  // We generate the XML sitemap with the posts data
  const sitemap = generateSiteMap(posts);
  res.setHeader("Content-Type", "text/xml");
  // Cache the sitemap for 1 week
  res.setHeader("Cache-Control", "s-maxage=604800");
  // we send the XML to the browser
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default Page;
