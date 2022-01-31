import { doc, getFirestore, setDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { firebaseApp } from ".";
import { editorContent } from "../../components/Editor";
import { post, user } from "../../types";
import { convertBlocksToMarkDown } from "../markdown";

const submitPost = async (editorState: editorContent, user: user) => {
  const { headline, content, summary, coverImage } = editorState;

  if (
    !headline ||
    !content ||
    !summary ||
    !coverImage.coverImageUrl ||
    !coverImage.coverImageCaption
  ) {
    if (!headline) {
      throw new Error("Headline is required");
    }
    if (!content) {
      throw new Error("Content is required");
    }
    if (!summary) {
      throw new Error("Summary is required");
    }
    if (!coverImage.coverImageUrl) {
      throw new Error("Cover Image is required");
    }
    if (!coverImage.coverImageCaption) {
      throw new Error("Cover Image Caption is required");
    }
  } else {
    const [markdownFile, filename] = convertBlocksToMarkDown(headline, content);

    // Handle cloud storage upload
    const storage = getStorage(firebaseApp);
    const fileRef = ref(storage, `/posts/${filename}`);
    const res = await uploadBytes(fileRef, markdownFile);
    const downloadURL = await getDownloadURL(res.ref);

    //Handle db post creation
    let postId = filename.replace(".md", "");
    const dbPost: post = {
      coverImage: {
        coverImageCaption: coverImage.coverImageCaption,
        coverImageUrl: coverImage.coverImageUrl,
      },
      id: postId,
      markdownUrl: downloadURL,
      metadata: {
        author: user?.uid || "",
        createdAt: new Date().getTime(),
        headline: headline,
        summary: summary,
        commentCount: 0,
        likeCount: 0,
        shareCount: 0,
        viewCount: 0,
      },
      score: 0,
    };

    // Upload post to the db
    const db = getFirestore(firebaseApp);
    const postDoc = doc(db, "posts", postId);
    await setDoc(postDoc, dbPost);

    // Store editable post
    const editorStateDoc = doc(db, `users/${user?.uid}/posts`, postId);
    await setDoc(editorStateDoc, editorState);

    return postId;
  }
  return "";
};

export default submitPost;
