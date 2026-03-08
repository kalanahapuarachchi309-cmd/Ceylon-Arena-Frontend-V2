import { useNavigate } from "react-router-dom";

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Unauthorized</h1>
      <p>You do not have permission to access this page.</p>
      <button type="button" onClick={() => navigate("/")}>
        Back to Home
      </button>
    </div>
  );
};

export default UnauthorizedPage;

