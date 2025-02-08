import { useState, useEffect } from "react";
import { db, auth } from "./config/firebase"; // Import Firebase methods
import {
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { Auth } from "./components/Auth"; // Import the Auth component

function App() {
  const [movieList, setMovieList] = useState([]);
  const [newMovieTitle, setNewMovieTitle] = useState("");
  const [newReleaseDate, setNewReleaseDate] = useState(0);
  const [isNewMovieOscar, setIsNewMovieOscar] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track if user is authenticated
  const [userEmail, setUserEmail] = useState(null); // Store user's email

  const moviesCollectionRef = collection(db, "movies");

  const getMovieList = async () => {
    try {
      const data = await getDocs(moviesCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setMovieList(filteredData);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteMovie = async (id) => {
    try {
      const movieDoc = doc(db, "movies", id);
      await deleteDoc(movieDoc);
      getMovieList();
    } catch (err) {
      console.error(err);
    }
  };

  const updateMovieTitle = async (id) => {
    try {
      const movieDoc = doc(db, "movies", id);
      await updateDoc(movieDoc, { title: updatedTitle });
      getMovieList();
    } catch (err) {
      console.error(err);
    }
  };

  const onSubmitMovie = async () => {
    try {
      await addDoc(moviesCollectionRef, {
        title: newMovieTitle,
        releaseDate: newReleaseDate,
        receivedAnOscar: isNewMovieOscar,
        userId: auth?.currentUser?.uid, // Store current user's UID
      });
      getMovieList();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getMovieList();
  }, []);

  return (
    <>
      {/* Pass down the setIsAuthenticated and setUserEmail to Auth component */}
      <Auth
        setIsAuthenticated={setIsAuthenticated}
        setUserEmail={setUserEmail}
        isAuthenticated={isAuthenticated}
      />

      {/* Show the movie submission form only if the user is authenticated */}
      {isAuthenticated && (
        <div>
          <input
            placeholder="Movie title..."
            onChange={(e) => setNewMovieTitle(e.target.value)}
          />
          <input
            placeholder="Release Date..."
            type="number"
            onChange={(e) => setNewReleaseDate(Number(e.target.value))}
          />
          <input
            type="checkbox"
            checked={isNewMovieOscar}
            onChange={(e) => setIsNewMovieOscar(e.target.checked)}
          />
          <label>Oscar?</label>
          <button onClick={onSubmitMovie}>Submit Movie</button>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Released Date</th>
            <th>Oscar?</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {movieList.map((movie) => (
            <tr key={movie.id}>
              <td>{movie.title}</td>
              <td>{movie.releaseDate}</td>
              <td>{movie.receivedAnOscar ? "Yes" : "No"}</td>
              <td>
                {/* Show these buttons only if the user owns the movie */}
                {(movie.userId === auth?.currentUser?.uid || import.meta.env.VITE_ADMIN_UID === auth?.currentUser?.uid) && (
                    <>
                      <button onClick={() => deleteMovie(movie.id)}>
                        Delete Me
                      </button>
                      <input
                        placeholder="New title..."
                        onChange={(e) => setUpdatedTitle(e.target.value)}
                      />
                      <button onClick={() => updateMovieTitle(movie.id)}>
                        Update Title
                      </button>
                    </>
                  )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default App;
