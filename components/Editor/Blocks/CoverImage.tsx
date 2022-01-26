import React, { useCallback, useContext, useState } from "react";
import { useDropzone } from "react-dropzone";
import { editorContent } from "..";
import { Auth } from "../../../pages/_app";
import { uploadImage } from "../../../utils/firebase";

interface CoverImageProps {
  editorState: [
    editorContent,
    React.Dispatch<React.SetStateAction<editorContent>>
  ];
}

const CoverImage: React.FC<CoverImageProps> = ({
  editorState: initialEditorState,
}) => {
  const [editorState, setEditorState] = initialEditorState;
  const [imageError, setImageError] = useState<Error>();
  const [fileLoading, setFileLoading] = useState(false);
  const [user] = useContext(Auth);

  const onDrop = useCallback(async (acceptedFiles) => {
    setFileLoading(true);
    setImageError(undefined);
    const imageFile = acceptedFiles[0] as File;
    try {
      const imageUrl = await uploadImage(imageFile, user?.uid || "");
      setEditorState({
        ...editorState,
        coverImage: { coverImageUrl: imageUrl, coverImageCaption: "" },
      });
    } catch (error) {
      setImageError(error as Error);
    }
    setFileLoading(false);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div>
      {!editorState.coverImage.coverImageUrl ? (
        <>
          {fileLoading ? (
            <div className="w-full aspect-video border border-zinc-200 rounded-md grid items-center justify-center">
              <p className="text-xl text-zinc-200/80 font-bold">
                Your file is being uploaded
              </p>
            </div>
          ) : (
            <div
              {...getRootProps()}
              className="w-full aspect-video border border-zinc-200 rounded-md grid items-center justify-center"
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p className="text-xl text-zinc-200/80 font-bold">
                  Drop Some files Here
                </p>
              ) : (
                <p className="text-xl font-light text-zinc-200/80">
                  {imageError
                    ? imageError.message
                    : "Drop Some files Here, Or click to select a file"}
                </p>
              )}
            </div>
          )}
        </>
      ) : (
        <img
          className="rounded-md object-cover border border-zinc-200 aspect-video"
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
  );
};

export default CoverImage;
