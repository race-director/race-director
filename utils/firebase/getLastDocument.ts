import { getDocs, Query } from "firebase/firestore";

const getLastDocument = async (q: Query<unknown>) => {
  const documentSnapshots = await getDocs(q);
  return documentSnapshots.docs[documentSnapshots.docs.length - 1];
};

export default getLastDocument;
