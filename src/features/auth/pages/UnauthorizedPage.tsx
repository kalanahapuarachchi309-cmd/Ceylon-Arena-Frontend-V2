import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useToast } from "../../../shared/providers/CustomToastProvider";

const UnauthorizedPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  useEffect(() => {
    const fromPath =
      typeof location.state === "object" &&
      location.state &&
      "from" in location.state &&
      typeof (location.state as { from?: string }).from === "string"
        ? (location.state as { from: string }).from
        : undefined;

    toast.warning({
      title: "Access Denied",
      message: fromPath ? `You cannot access ${fromPath}.` : "You do not have permission to access this page.",
      dedupeKey: fromPath ? `unauthorized:${fromPath}` : "unauthorized:generic",
    });
  }, [location.state, toast]);

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

