import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>404</h1>
      <p>Page not found.</p>
      <button type="button" onClick={() => navigate("/")}>
        Back to Home
      </button>
    </div>
  );
};

export default NotFoundPage;

