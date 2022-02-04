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
            <div className="grid aspect-video w-full items-center justify-center rounded-md border border-zinc-200">
              <p className="text-xl font-bold text-zinc-200/80">
                Your file is being uploaded
              </p>
            </div>
          ) : (
            <div
              {...getRootProps()}
              className="grid aspect-video w-full items-center justify-center rounded-md border border-zinc-200"
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p className="text-xl font-bold text-zinc-200/80">
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
          className="aspect-video w-full rounded-md border border-zinc-200 bg-black object-contain"
          src={editorState.coverImage.coverImageUrl}
        ></img>
      )}
      <input
        placeholder="Add a caption"
        className="h-8 w-full border border-x-0 border-t-0 border-zinc-200 bg-transparent py-3 px-4 pb-2 font-light text-zinc-200"
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
