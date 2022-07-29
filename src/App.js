import "./App.css";
import { useState } from "react";

function App() {
  const [photos, setPhotos] = useState();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const handleNextPage = async () => {
    setLoading(true);
    setPageNumber((prevPage) => prevPage + 1);
    try {
      const data = await fetch(
        `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${process.env.FLICKER_API_KEY}&text=${input}&format=json&nojsoncallback=1&page=${pageNumber}`
      );
      const cleanData = await data.json();
      let photoArray = cleanData.photos.photo;
      photoArray.forEach((photo) => {
        photo.photoUrl = `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_t.jpg`;
        photo.photoPageUrl = `https://www.flickr.com/photos/${photo.owner}/${photo.id}`;
      });
      setPhotos((prevPhotos) => {
        return [...prevPhotos, ...photoArray];
      });
    } catch (e) {
      console.log(e);
      setError(true);
    }
    setLoading(false);
  };

  const handleClick = async () => {
    setPageNumber(1);
    setLoading(true);
    try {
      const data = await fetch(
        `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${process.env.FLICKER_API_KEY}&text=${input}&format=json&nojsoncallback=1&page=${pageNumber}`
      );
      const cleanData = await data.json();
      const photoArray = cleanData.photos.photo;
      photoArray.forEach((photo) => {
        photo.photoUrl = `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_t.jpg`;
        photo.photoPageUrl = `https://www.flickr.com/photos/${photo.owner}/${photo.id}`;
      });
      setPhotos(photoArray);
    } catch (e) {
      console.log(e);
      setError(true);
    }
    setLoading(false);
  };

  return (
    <div className="App">
      <h1>Photo Search</h1>
      <input type="text" value={input} onChange={handleChange} />
      <button type="button" onClick={handleClick}>
        Search
      </button>
      <div className="masonry">
        {loading && <div>Loading...</div>}
        {error && <div>Error...</div>}
        {!!photos &&
          photos.map((photo) => {
            return (
              <div className="cell" key={photo.id}>
                <a target="_blank" rel="noreferrer" href={photo.photoPageUrl}>
                  <img
                    className="photo"
                    src={photo.photoUrl}
                    alt={photo.title}
                    style={{ height: "100%" }}
                  />
                </a>
              </div>
            );
          })}
      </div>
      {!!photos && <button onClick={handleNextPage}>Load more</button>}
    </div>
  );
}

export default App;
