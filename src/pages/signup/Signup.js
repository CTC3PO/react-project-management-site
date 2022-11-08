import { useState } from "react";
import { useSignup } from "../../hooks/useSignup";

export default function Signup() {
  //states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailError, setThumbnailError] = useState(null);
  const { isPending, error, signup } = useSignup();

  //handleSubmit function
  const handleSubmit = (e) => {
    e.preventDefault();
    signup(email, password, displayName, thumbnail);
  };

  //handleFileChange function (let user upload profile photo)
  //handle errors if file is not image type or >100kb or no file is selected
  const handleFileChange = (e) => {
    setThumbnail(null);

    //let user upload image
    let selected = e.target.files[0];
    console.log(selected);

    //handle errors if no image is selected
    //if fail this check, just return and not checking next conditions
    if (!selected) {
      setThumbnailError("please select an files");
      return;
    }

    //handle error if file selected is not an image
    if (!selected.type.includes("image")) {
      setThumbnailError("Selected file must be an image");
      return;
    }

    //handle error if image file is >100kb
    if (selected.size > 100000) {
      setThumbnailError("Image file size must be less than 100kb");
      return;
    }

    //else, if none of above errors, set thumbnail and thumbnail error
    setThumbnail(selected);
    setThumbnailError(null);
    console.log("thumbnail updated");
  };

  //return a form for user to signup
  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2> Sign up</h2>
      <label>
        <span>Email: </span>
        <input
          required
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
      </label>
      <label>
        <span>Password: </span>
        <input
          required
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
      </label>
      <label>
        <span>Display Name: </span>
        <input
          required
          type="text"
          onChange={(e) => setDisplayName(e.target.value)}
          value={displayName}
        />
      </label>
      <label>
        <span>Profile Thumbnail: </span>
        <input required type="file" onChange={handleFileChange} />
      </label>
      {thumbnailError && <div className="error">{thumbnailError}</div>}
      {isPending && (
        <button className="btn" disabled>
          Loading...
        </button>
      )}
      {!isPending && <button className="btn">Sign up</button>}
      {error && <p> {error} </p>}
    </form>
  );
}
