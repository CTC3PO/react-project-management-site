import { useState, useEffect } from "react";
import { projectFirestore } from "../firebase/config";

export const useDocument = (collection, id) => {
  //states
  const [document, setDocument] = useState(null);
  const [error, setError] = useState(null);

  //realtime document data
  useEffect(() => {
    const ref = projectFirestore.collection(collection).doc(id);

    //get realtime update by onSnapshot
    const unsubscribe = ref.onSnapshot(
      (snapshot) => {
        //if the snapshot returns data (the data is in firestore already)
        if (snapshot.data()) {
          //set document as whatever returns for the document's data
          setDocument({ ...snapshot.data(), id: snapshot.id });
          setError(null);
        } else {
          setError("no such document exists");
        }
      },
      (err) => {
        console.log(err.message);
        setError("failed to get document");
      }
    );

    return () => unsubscribe();
  }, [collection, id]);

  return { document, error };
};
