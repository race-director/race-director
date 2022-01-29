import {
  collection,
  doc,
  DocumentData,
  getFirestore,
  increment,
  limit,
  orderBy,
  QueryDocumentSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { Auth } from "../../pages/_app";
import { comment, post } from "../../types";
import { firebaseApp, paginateQuery } from "../../utils/firebase";
import { generateAlphanumericStr } from "../../utils/other";
import { Comment } from "../Comments";

interface CommentSectionProps {
  post: post;
}

const CommentSection: React.FC<CommentSectionProps> = ({ post }) => {
  const db = getFirestore(firebaseApp);
  const [user] = useContext(Auth);
  const [localCommentCount, setLocalCommentCount] = useState(
    post.metadata.commentCount
  );
  const [commentContent, setCommentContent] = useState<string>("");
  const [comments, setComments] = useState<comment[]>([]);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData>>();

  useEffect(() => {
    loadMore();
  }, []);

  const loadMore = (lastDoc?: QueryDocumentSnapshot<DocumentData>) => {
    const postCollection = collection(db, `posts/${post.id}/comments`);
    const orderPostsBy = orderBy("createdAt", "desc");
    const queryLimit = limit(3);
    if (lastDoc) {
      paginateQuery(postCollection, [orderPostsBy, queryLimit], lastDoc).then(
        (docs) => {
          const lastVisible = docs.docs[docs.docs.length - 1];
          setLastDoc(lastVisible);
          let comments = docs.docs.map((doc) => doc.data() as comment);
          setComments((prevComments) => [...prevComments, ...comments]);
        }
      );
    } else {
      paginateQuery(postCollection, [orderPostsBy, queryLimit]).then((docs) => {
        const lastVisible = docs.docs[docs.docs.length - 1];
        setLastDoc(lastVisible);
        let comments = docs.docs.map((doc) => doc.data() as comment);
        setComments((prevComments) => [...prevComments, ...comments]);
      });
    }
  };

  const submitComment = async () => {
    if (post && user) {
      const commentId = generateAlphanumericStr(20);
      const newComment: comment = {
        content: commentContent,
        createdAt: new Date().getTime(),
        postId: post.id,
        userId: user.uid,
        likes: 0,
        commentId,
      };

      setCommentContent("");

      //Update local ui
      setComments((prevComments) => [newComment, ...prevComments]);
      setLocalCommentCount(localCommentCount + 1);

      // Create new comment document in comments subcollection
      await setDoc(doc(db, `posts/${post.id}/comments`, commentId), newComment);

      // Update post's comment count
      await updateDoc(doc(db, `posts`, post.id), {
        "metadata.commentCount": increment(1),
      });
    }
  };

  return (
    <div className="not-prose grid gap-8">
      <div className="grid gap-4">
        <h2 className="text-xl md:text-2xl font-bold">Join in</h2>
        <div className="flex">
          <input
            disabled={!user}
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && commentContent) {
                submitComment();
              }
            }}
            placeholder={user ? "Add a comment..." : "Login to comment"}
            className="w-full px-2 py-2 disabled:opacity-60 disabled:cursor-not-allowed bg-transparent border dark:border-zinc-200/60 border-zinc-400/60 rounded-md flex-1 mr-2"
          ></input>
          <button
            onClick={submitComment}
            disabled={!commentContent || !user}
            className={`px-4 font-semibold dark:bg-cyan-600 bg-cyan-500 hover:bg-cyan-600 text-zinc-100 dark:hover:bg-cyan-700 rounded-md transform transition-all active:scale-95 disabled:opacity-60 disabled:hover:bg-cyan-500 dark:disabled:hover:bg-cyan-600 disabled:cursor-not-allowed`}
          >
            Send
          </button>
        </div>
      </div>

      <div className="grid gap-2" id="comments">
        <h2 className="text-xl md:text-2xl font-bold">
          Comments ({localCommentCount})
        </h2>
        <div className="grid">
          {comments.map((c, idx) => (
            <Comment comment={c} key={idx}></Comment>
          ))}
        </div>
        {comments.length === 0 && (
          <div>
            <p className="text-lg text-zinc-200/70">
              This is very quiet. Send a comment to start the conversation!
            </p>
          </div>
        )}
        {!(comments.length >= localCommentCount) && (
          <button
            className="py-2 px-4 border-zinc-200/70 border-2 rounded-md font-semibold transform active:scale-95 transition-all"
            onClick={() => loadMore(lastDoc)}
          >
            Load more comments
          </button>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
