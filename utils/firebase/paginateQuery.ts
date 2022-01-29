import {
  DocumentData,
  getDocs,
  Query,
  query,
  QueryConstraint,
  QueryDocumentSnapshot,
  startAfter,
} from "firebase/firestore";

const paginateQuery = async (
  collectionRef: Query<DocumentData>,
  QueryConstraints: QueryConstraint[],
  lastDoc?: QueryDocumentSnapshot<DocumentData>
) => {
  if (lastDoc) {
    const q = query(collectionRef, ...QueryConstraints, startAfter(lastDoc));
    return await getDocs(q);
  } else {
    const q = query(collectionRef, ...QueryConstraints);
    return await getDocs(q);
  }
};

export default paginateQuery;
