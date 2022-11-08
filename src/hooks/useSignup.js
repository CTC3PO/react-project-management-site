import { useState, useEffect } from "react";
import {
  projectAuth,
  projectFirestore,
  projectStorage,
} from "../firebase/config";
import { useAuthContext } from "./useAuthContext";

export const useSignup = () => {
  //states
  const [isCancelled, setIsCancelled] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  const { dispatch } = useAuthContext();

  //signup function
  const signup = async (email, password, displayName, thumbnail) => {
    //set states
    setIsPending(true);
    setError(null);

    //try to create user with email and password
    try {
      const res = await projectAuth.createUserWithEmailAndPassword(
        email,
        password
      );

      //if no resonse, throw error
      if (!res) {
        throw new Error("Could not complete signup");
      }

      //upload user thumbnail/profile photo to thumbnails/user's uid folder
      //if folders not existed, firebase will create the folders
      //this will save the image to the firebase storage
      const uploadPath = `thumbnails/${res.user.uid}/${thumbnail.name}`;
      const img = await projectStorage.ref(uploadPath).put(thumbnail);
      const imgURL = await img.ref.getDownloadURL();

      //add displayName and photo_URL to user
      await res.user.updateProfile({ displayName, photoURL: imgURL });

      //create a user document with the user's id (using doc method)
      //this will add to user to firestore database
      await projectFirestore.collection("users").doc(res.user.uid).set({
        online: true,
        displayName,
        photoURL: imgURL,
      });

      //dispatch LOGIN action
      dispatch({ type: "LOGIN", payload: res.user });

      //update states
      if (!isCancelled) {
        setIsPending(false);
        setError(null);
      }
      //catch error
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
  return { signup, isPending, error };
};
