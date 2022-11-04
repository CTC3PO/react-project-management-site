import { useState, useEffect } from "react";
import { projectFirestore } from "../firebase/config";

export const useDocument = (collection, id) => {
  //states
  const [document, setDocument] = useState(null);
  const [error, setError] = useState(null);

  //realtime document data
  useEffect(() => {
    const ref = projectFirestore.collection(collection).doc(id);

    const unsubscribe = ref.onSnapshot(
      (snapshot) => {
        //need to make sure the doc exists and has data
        if (snapshot.data()) {
          setDocument({ ...snapshot.data(), id: snapshot.id });
          setError(null);
        } else {
          setError("No such document exists");
        }
      },
      (error) => {
        console.log(error.message);
        setError("failed to get document");
      }
    );
    return () => unsubscribe();
  }, [collection, id]);

  return { document, error };
};
