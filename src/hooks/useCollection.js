import { useState, useEffect, useRef } from "react";
import { projectFirestore } from "../firebase/config";

export const useCollection = (collection, _query, _orderBy) => {
  //states
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState(null);

  //query and orderBy

  const query = useRef(_query).current;
  const orderBy = useRef(_orderBy).current;

  //useEffect
  useEffect(() => {
    const ref = projectFirestore.collection(collection);

    if (query) {
      ref = ref.where(...query);
    }
    if (orderBy) {
      ref = ref.orderBy(...orderBy);
    }

    //unsub function
    const unsub = ref.onSnapshot(
      (snapshot) => {
        let results = [];
        snapshot.docs.forEach((doc) => {
          results.push({ ...doc.data(), id: doc.id });
        });

        //update state
        setDocuments(documents);
        setError(null);
      },
      (error) => {
        console.log(error);
        setError("could not fetch the data");
      }
    );
    return () => unsub();
  }, [collection, query, orderBy]);

  return { documents, error };
};
