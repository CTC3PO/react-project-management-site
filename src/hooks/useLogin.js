import { useState, useEffect } from "react";
import { projectAuth, projectFirestore } from "../firebase/config";
import { useAuthContext } from "./useAuthContext";

export const useLogin = () => {
  //states
  const [isCancelled, setIsCancelled] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  const { dispatch } = useAuthContext();

  //login function
  //try to login
  //catch error
  const login = async (email, password) => {
    //set states
    setIsPending(true);
    setError(null);

    //try to login
    try {
      const res = await projectAuth.signInWithEmailAndPassword(email, password);

      const documentRef = projectFirestore
        .collection("users")
        .doc(res.user.uid);

      await documentRef.update({ online: true });

      //dispatch LOGIN action
      dispatch({ type: "LOGIN", payload: res.user });

      if (!isCancelled) {
        setIsPending(false);
        setError(null);
      }
    } catch (err) {
      if (!isCancelled) {
        setIsPending(false);
        setError(err.message);
      }
    }
  };

  //useEffect to invoke setIsCancelled as true once
  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  //return
  return { login, isPending, error };
};
