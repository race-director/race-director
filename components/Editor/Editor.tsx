import React, { useCallback, useContext, useState } from "react";
import { Headline, Paragraph, Quote, Subheading } from "./Blocks";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, setDoc, doc } from "firebase/firestore";
import { firebaseApp } from "../../utils/firebase";
import { convertBlocksToMarkDown } from "../../utils/markdown";
import { post } from "../../types";
import { Auth } from "../../pages/_app";
import { useRouter } from "next/router";
import { useDropzone } from "react-dropzone";
import { generateAlphanumericStr } from "../../utils/other";

interface EditorProps {
  initialEditorContent?: editorContent;
}

export interface editorContent {
  headline: string;
  summary: string;
  coverImage: {
    coverImageUrl: string;
    coverImageCaption: string;
  };
  content: block[];
}

export type blockType = "subheading" | "paragraph" | "image" | "quote";

export interface block {
  type: blockType;
  text: string;
  imgSrc?: string;
  author?: string;
}

const Editor: React.FC<EditorProps> = ({ initialEditorContent }) => {
  const [user] = useContext(Auth);
  const router = useRouter();
  const [editorState, setEditorState] = useState<editorContent>(
    initialEditorContent || {
      coverImage: {
        coverImageCaption: "",
        coverImageUrl: "",
      },
      headline: "",
      summary: "",
      content: [{ text: "", type: "paragraph" }],
    }
  );
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach(async (file: File) => {
      if (
        file.name.includes(".jpg") ||
        file.name.includes(".png") ||
        file.name.includes(".jpeg")
      ) {
        const storage = getStorage(firebaseApp);
        const extension = file.name.split(".").pop();
        const fileRef = ref(
          storage,
          `/users/${user?.uid}/${generateAlphanumericStr(8)}.${extension}`
        );
        const res = await uploadBytes(fileRef, file);
        const downloadURL = await getDownloadURL(res.ref);
        setEditorState({
          ...editorState,
          coverImage: { ...editorState.coverImage, coverImageUrl: downloadURL },
        });
      }
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleSubmit = async () => {
    const { headline, content, summary, coverImage } = editorState;
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

    router.push("/studio");
  };

  const createBlock = (type: blockType) => {
    setEditorState({
      ...editorState,
      content: [...editorState.content, { text: "", type }],
    });
  };

  return (
    <div className="grid gap-4 grid-cols-1">
      <div>
        {!editorState.coverImage.coverImageUrl ? (
          <div
            {...getRootProps()}
            className="w-full h-96 border border-zinc-200 rounded-md grid items-center justify-center"
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p className="text-xl text-zinc-200/80 font-bold">
                Drop Some files Here
              </p>
            ) : (
              <p className="text-xl font-light text-zinc-200/80">
                Drop Some files Here, Or click to select a file
              </p>
            )}
          </div>
        ) : (
          <img
            className="rounded-md object-cover border border-zinc-200"
            src={editorState.coverImage.coverImageUrl}
          ></img>
        )}
        <input
          placeholder="Add a caption"
          className="bg-transparent w-full border border-zinc-200 text-zinc-200 border-x-0 border-t-0 py-3 pb-2 px-4 h-8 font-light"
          onChange={(e) => {
            setEditorState({
              ...editorState,
              coverImage: {
                ...editorState.coverImage,
                coverImageCaption: e.target.value,
              },
            });
          }}
        ></input>
      </div>
      <Headline
        createBlockFx={createBlock}
        editorState={[editorState, setEditorState]}
      ></Headline>
      <textarea
        placeholder="Write a summary for your post"
        className="bg-transparent border border-zinc-200 text-zinc-200 pt-3 pb-2 px-4 h-16 font-semibold rounded-md focus:ring ring-blue-200"
        onChange={(e) =>
          setEditorState({ ...editorState, summary: e.target.value })
        }
        value={editorState.summary}
      ></textarea>
      {editorState.content.map(({ type }, idx) => {
        switch (type) {
          case "paragraph":
            return (
              <Paragraph
                createBlockFx={createBlock}
                idx={idx}
                key={idx}
                editorState={[editorState, setEditorState]}
              ></Paragraph>
            );
          case "subheading":
            return (
              <Subheading
                createBlockFx={createBlock}
                idx={idx}
                key={idx}
                editorState={[editorState, setEditorState]}
              ></Subheading>
            );
          case "quote":
            return (
              <Quote
                idx={idx}
                key={idx}
                editorState={[editorState, setEditorState]}
              ></Quote>
            );
        }
      })}
      <button onClick={() => createBlock("paragraph")}>New Paragraph</button>
      <button onClick={() => createBlock("subheading")}>New Subheading</button>
      <button onClick={() => createBlock("quote")}>New Quote</button>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default Editor;
