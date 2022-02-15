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
import { generateAlphanumericStr, ratePost } from "../../utils/other";
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

  useEffect(() => {
    // Text area resizing
    // see https://stackoverflow.com/questions/454202/creating-a-textarea-with-auto-resize
    const tx = document.getElementsByTagName("textarea");
    for (let i = 0; i < tx.length; i++) {
      tx[i].setAttribute(
        "style",
        "height:" + tx[i].scrollHeight + "px;overflow-y:hidden;"
      );
      tx[i].addEventListener("input", OnInput, false);
    }

    function OnInput(this: any) {
      this.style.height = "auto";
      this.style.height = this.scrollHeight + "px";
    }
  });

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
        score: ratePost({
          ...post,
          metadata: { ...post.metadata, commentCount: localCommentCount + 1 },
        }),
      });
    }
  };

  return (
    <div className="not-prose grid gap-8">
      <div className="grid gap-4">
        <h2 className="text-xl font-bold md:text-2xl">Join in</h2>
        <div className="flex">
          <textarea
            wrap="hard"
            disabled={!user}
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && commentContent) {
                submitComment();
              }
            }}
            placeholder={user ? "Add a comment..." : "Login to comment"}
            className="mr-2 w-full flex-1 resize-none rounded-md border border-zinc-400/60 bg-transparent px-2 py-2 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-200/60"
          ></textarea>
          <button
            onClick={submitComment}
            disabled={!commentContent || !user}
            className={`transform rounded-md bg-cyan-500 px-4 font-semibold text-zinc-100 transition-all hover:bg-cyan-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-cyan-500 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:disabled:hover:bg-cyan-600`}
          >
            Send
          </button>
        </div>
      </div>

      <div className="grid gap-2" id="comments">
        <h2 className="text-xl font-bold md:text-2xl">
          Comments ({localCommentCount})
        </h2>
        <div className="grid">
          {comments.map((c, idx) => (
            <Comment comment={c} key={idx} post={post}></Comment>
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
            className="transform rounded-md border-2 border-zinc-200/70 py-2 px-4 font-semibold transition-all active:scale-95"
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
