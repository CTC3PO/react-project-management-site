//import
import { useReducer, useState, useEffect } from "react";
import { projectFirestore, timestamp } from "../firebase/config";

//initialState
const initialState = {
  isPending: false,
  error: null,
  document: null,
  success: null,
};

//firestoreReducer (state, action): 5 action types
const firestoreReducer = (state, action) => {
  switch (action.type) {
    case "IS_PENDING":
      return { isPending: true, error: null, document: null, success: false };
    case "ERROR":
      return {
        isPending: false,
        error: action.payload,
        document: null,
        success: false,
      };

    case "ADDED_DOCUMENT":
      return {
        isPending: false,
        error: null,
        document: action.payload,
        success: true,
      };

    case "DELETED_DOCUMENT":
      return { isPending: false, error: null, document: null, success: true };

    case "UPDATED_DOCUMENT":
      return {
        isPending: false,
        error: null,
        document: action.payload,
        success: true,
      };

    default:
      return state;
  }
};

//useFirestore function (collection)

export const useFirestore = (collection) => {
  //state / useReducer, isCancelled
  const [response, dispatch] = useReducer(firestoreReducer, initialState);
  const [isCancelled, setIsCancelled] = useState(false);

  //collection ref const
  const ref = projectFirestore.collection(collection);

  //only dispatch action if not cancelled
  const dispatchIfNotCancelled = (action) => {
    if (!isCancelled) {
      dispatch(action);
    }
  };

  //add a doc- await function (w. try, catch)
  const addDocument = async (doc) => {
    //dispatch IS_PENDING action
    dispatch({ type: "IS_PENDING" });
    //try to add doc
    try {
      const createdAt = timestamp.fromDate(new Date());
      const addedDoc = await ref.add({ ...doc, createdAt });
      dispatchIfNotCancelled({ type: "ADDED_DOCUMENT", payload: addedDoc });
    } catch (err) {
      dispatchIfNotCancelled({ type: "ERROR", payload: err.message });
    }
  };

  //delete a doc - await function
  const deleteDocument = async (id) => {
    dispatch({ type: "IS_PENDING" });

    try {
      await ref.doc(id).delete();
      dispatchIfNotCancelled({ type: "DELETED_DOCUMENT" });
    } catch (err) {
      dispatchIfNotCancelled({ type: "ERROR", payload: "could not delete" });
    }
  };

  //update a doc - await function
  const updateDocument = async (id, updates) => {
    dispatch({ type: "IS_PENDING" });

    try {
      const updatedDoc = await ref.doc(id).update(updates);
      dispatchIfNotCancelled({
        type: "UPDATED_DOCUMENT",
        payload: updatedDoc,
      });
      return updatedDoc;
    } catch (err) {
      dispatchIfNotCancelled({ type: "ERROR", payload: err });
      return null;
    }
  };

  //useEffect
  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  return { addDocument, deleteDocument, updateDocument, response };
};
