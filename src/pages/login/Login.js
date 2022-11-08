import { useState, useEffect } from "react";
import { useLogin } from "../../hooks/useLogin";

export default function Login() {
  //states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isPending, error, login } = useLogin();

  //handleSubmit function
  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };

  //return a form
  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Login</h2>
      <label>
        <span>Email: </span>
        <input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          required
        />
      </label>
      <label>
        <span>Password: </span>
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          required
        />
      </label>
      {isPending && (
        <button className="btn" disabled>
          Loading...
        </button>
      )}
      {!isPending && <button className="btn">Login</button>}
      {error && <div className="error">{error}</div>}
    </form>
  );
}
