
import { useEffect, useState } from "react";
import api from "../services/api";

function BuddyRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionRequest, setActionRequest] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await api.get("/buddies/requests", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setRequests(response.data.requests);
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Failed to fetch buddy requests"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRequests();
  }, []);

  const handleAccept = async (requestId) => {
    try {
      setActionRequest(requestId);
      setError("");
      setSuccess("");

      const token = localStorage.getItem("token");

      const response = await api.patch(
        `/buddies/accept/${requestId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setSuccess(
        response.data.message ||
        "Buddy request accepted"
      );

      setRequests((currentRequests) =>
        currentRequests.filter(
          (request) => request._id !== requestId
        )
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Failed to accept buddy request"
      );
    } finally {
      setActionRequest(null);
    }
  };

  const handleReject = async (requestId) => {
    try {
      setActionRequest(requestId);
      setError("");
      setSuccess("");

      const token = localStorage.getItem("token");

      const response = await api.patch(
        `/buddies/reject/${requestId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setSuccess(
        response.data.message ||
        "Buddy request rejected"
      );

      setRequests((currentRequests) =>
        currentRequests.filter(
          (request) => request._id !== requestId
        )
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Failed to reject buddy request"
      );
    } finally {
      setActionRequest(null);
    }
  };

  return (
    <div>
      <h2>Buddy Requests</h2>

      {loading && <p>Loading requests...</p>}

      {error && <p>{error}</p>}

      {success && <p>{success}</p>}

      {!loading && requests.length === 0 && (
        <p>No pending buddy requests.</p>
      )}

      <div>
        {requests.map((request) => (
          <div
            key={request._id}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              marginBottom: "10px"
            }}
          >
            <h3>
              {request.sender?.fullName}
            </h3>

            <p>
              Email: {request.sender?.email}
            </p>

            <p>
              College:{" "}
              {request.sender?.college || "Not provided"}
            </p>

            <p>
              Course:{" "}
              {request.sender?.course || "Not provided"}
            </p>

            <p>
              Year:{" "}
              {request.sender?.year || "Not provided"}
            </p>

            <button
              onClick={() =>
                handleAccept(request._id)
              }
              disabled={
                actionRequest === request._id
              }
            >
              {actionRequest === request._id
                ? "Processing..."
                : "Accept"}
            </button>

            {" "}

            <button
              onClick={() =>
                handleReject(request._id)
              }
              disabled={
                actionRequest === request._id
              }
            >
              {actionRequest === request._id
                ? "Processing..."
                : "Reject"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BuddyRequests;