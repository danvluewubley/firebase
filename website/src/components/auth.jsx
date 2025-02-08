import { useState, useEffect } from "react";
import { auth, googleProvider } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";

export const Auth = ({ setIsAuthenticated, setUserEmail, isAuthenticated }) => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsAuthenticated(true);
        setUserEmail(user.email); // Pass the user's email back to the parent
      } else {
        setIsAuthenticated(false);
        setUserEmail(null); // Clear the user email when logged out
      }
    });
    return () => unsubscribe();
  }, [setIsAuthenticated, setUserEmail]);

  const signUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword);
    } catch (err) {
      console.error(err);
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
      console.log("Logged out successfully!");
    } catch (err) {
      console.error("Error logging out: ", err);
    }
  };

  return (
    <>
      {!isAuthenticated && (
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
        </>
      )}

      {/* Show logged-in user's email and log out button if authenticated */}
      {isAuthenticated && (
        <div>
          <p>Welcome, {auth.currentUser.email}</p>
          <button onClick={logout}>Log Out</button>
        </div>
      )}
    </>
  );
};