import {
  collection,
  getFirestore,
  limit,
  orderBy,
  query,
  Query,
  startAfter,
  startAt,
} from "firebase/firestore";
import { firebaseApp, getLastDocument } from ".";

const constructQuery = async (prevQ?: Query<unknown>) => {
  if (prevQ) {
    return query(
      collection(getFirestore(firebaseApp), "posts"),
      orderBy("score", "desc"),
      startAfter(await getLastDocument(prevQ)),
      limit(5)
    );
  } else {
    // This is the first query
    return query(
      collection(getFirestore(firebaseApp), "posts"),
      orderBy("score", "desc"),
      startAt(1),
      limit(7)
    );
  }
};

export default constructQuery;
