import { useState } from "react";
import { auth, googleProvider } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";

export const Auth = () => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");

  console.log(auth?.currentUser?.email);

  const signUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword);
    } catch (err) {
      console.error();
    }
  };

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
    } catch (err) {
      console.error(err);
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error(err);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <input
        placeholder="Sign Up Email..."
        onChange={(e) => setSignUpEmail(e.target.value)}
      />
      <input
        placeholder="Sign Up Password..."
        onChange={(e) => setSignUpPassword(e.target.value)}
        type="password"
      />
      <button onClick={signUp}>Create Account</button>
      <input
        placeholder="Login Email..."
        onChange={(e) => setLoginEmail(e.target.value)}
      />
      <input
        placeholder="Login Password..."
        onChange={(e) => setLoginPassword(e.target.value)}
        type="password"
      />
      <button onClick={login}>Sign In</button>

      <button onClick={signInWithGoogle}>Sign In With Google</button>
      <button onClick={logout}>Logout</button>
    </>
  );
};
