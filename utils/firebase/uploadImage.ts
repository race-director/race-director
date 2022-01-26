import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { firebaseApp } from ".";
import { generateAlphanumericStr } from "../other";

const uploadImage = async (i: File, uid: string): Promise<string> => {
  if (
    i.name.includes(".jpg") ||
    i.name.includes(".jpeg") ||
    i.name.includes(".png")
  ) {
    if (i.size <= 5000000) {
      const storage = getStorage(firebaseApp);
      const extension = i.name.split(".").pop();
      const fileRef = ref(
        storage,
        `/users/${uid}/${generateAlphanumericStr(20)}.${extension}`
      );
      const res = await uploadBytes(fileRef, i);
      return await getDownloadURL(res.ref);
    } else {
      throw new Error(
        "Image size should be less than 5mb. Try a smaller image."
      );
    }
  } else {
    throw new Error(
      "File is not an image, try with files ending on .jpg, .jpeg or .png"
    );
  }
};

export default uploadImage;
