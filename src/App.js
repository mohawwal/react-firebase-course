import { useEffect, useState } from 'react';
import './App.css';
import { Auth } from './components/auth';
import {db, auth, storage} from './config/firebase'
import {getDocs, collection, addDoc, deleteDoc, updateDoc, doc} from 'firebase/firestore'
//import { upload } from '@testing-library/user-event/dist/upload';
import { ref, uploadBytes } from 'firebase/storage';

function App() {
  const [movieList, setMovieList] = useState([])

  //New Movie States
  const [newMovieTitles, setNewMovieTitles] = useState("")
  const [newReleaseDate, setNewReleaseDate] = useState(0)
  const [isNewMovieOscar, setIsNewMovieOscar] = useState(false)

  // Update title state
  const [updatedTitle, setUpdatedTitle] = useState("")

  //File upload state
  const [fileUpload, setFileUpload] = useState(null)

  const movieCollectionRef = collection(db, "movies")


  const getMovieList = async () => {
    try{
      const data = await getDocs(movieCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(), 
        id:doc.id
      }))
      setMovieList(filteredData)
    } catch(err) {
      console.log(err)
    }
  }


  const onSubmitMovie = async () => {
    try {
      await addDoc(movieCollectionRef, {
        title: newMovieTitles, 
        releaseDate: newReleaseDate,
        receivedAnOscar: isNewMovieOscar,
        userId: auth?.currentUser?.uid
      });

      getMovieList();
    } catch(err) {
      console.error(err)
    }
  };

  useEffect(() => {
    getMovieList();
  }, [])

  const deleteMovie = async (id) => {
    const movieDoc = doc(db, "movies", id )
    await deleteDoc(movieDoc);
  }


  const UpdateMovieTitle = async (id) => {
    const movieDoc = doc(db, "movies", id)
    await updateDoc(movieDoc, {title: updatedTitle })
  }

 
const uploadFile = async () => {
  if (!fileUpload) return;
  const filesFolderRef = ref(storage, `projectFiles/${fileUpload.name}`);
  try {
    await uploadBytes(filesFolderRef, fileUpload)
  } catch(err) {
    console.error(err)
  }
}
 
  return (
    <div className="App">
      <Auth/>

      <div>
        <input type="text" placeholder='movie title...' 
          onChange={(e)=> setNewMovieTitles(e.target.value)} 
        />
        <input type="text" placeholder='Release Date...' typeof='number'
          onChange={(e)=> setNewReleaseDate(Number(e.target.value))}
        />
        <input type="checkbox" 
          checked={isNewMovieOscar} 
          onChange={(e) => setIsNewMovieOscar(e.target.checked)}  
        />
        <label>Received an Oscar</label>
        <button onClick={onSubmitMovie}>Submit Movie</button>
      </div>

      <div>{movieList.map((movie) => <div>
        <h1 style={{color: movie.receivedAnOscar ? "green" : "red"}}>{movie.title}</h1>
        <p>{movie.releaseDate}</p>

        <button onClick={() => deleteMovie(movie.id)}>Delete Movie</button>

        <input type="text" placeholder='new title'
          onChange={(e) => setUpdatedTitle(e.target.value)}
        />
        <button onClick={() => UpdateMovieTitle(movie.id)}>Update Title</button>
      </div>)}</div>


        <div>
          <input type="file" onChange={(e) => setFileUpload(e.target.files[0])} />
          <button onClick={uploadFile}>upload File</button>
        </div>
      
    </div>
  );
}


export default App;