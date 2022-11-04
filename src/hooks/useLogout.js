import { useState, useEffect } from "react";
import { projectAuth, projectFirestore } from "../firebase/config";
import { useAuthContext } from "./useAuthContext";

export const useLogout = () => {
  //states
  const [isCancelled, setIsCancelled] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  const { dispatch } = useAuthContext();

  //login function
  //try to login
  //catch error
  const logout = async () => {
    //set states
    setIsPending(true);
    setError(null);

    //try to login
    try {
      //update online status
      const { uid } = projectAuth.currentUser;
      await projectFirestore
        .collection("users")
        .doc(uid)
        .update({ online: false });

      //log user out
      await projectAuth.signOut();

      //dispatch signout action
      dispatch({ type: "LOGOUT" });

      //update state
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
  return { logout, isPending, error };
};
