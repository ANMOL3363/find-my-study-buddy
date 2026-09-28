
import { useEffect, useState } from "react";
import api from "../services/api";

function MyBuddies() {
  const [buddies, setBuddies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [removingBuddy, setRemovingBuddy] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getBuddies = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await api.get("/buddies/list", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setBuddies(response.data.buddies);
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Failed to fetch study buddies"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBuddies();
  }, []);

  const handleRemove = async (buddyId) => {
    const confirmed = window.confirm(
      "Are you sure you want to remove this study buddy?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setRemovingBuddy(buddyId);
      setError("");
      setSuccess("");

      const token = localStorage.getItem("token");

      const response = await api.delete(
        `/buddies/remove/${buddyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setSuccess(
        response.data.message ||
        "Study buddy removed successfully"
      );

      setBuddies((currentBuddies) =>
        currentBuddies.filter(
          (buddy) => buddy._id !== buddyId
        )
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Failed to remove study buddy"
      );
    } finally {
      setRemovingBuddy(null);
    }
  };

  return (
    <div>
      <h2>My Study Buddies</h2>

      {loading && <p>Loading buddies...</p>}

      {error && <p>{error}</p>}

      {success && <p>{success}</p>}

      {!loading && buddies.length === 0 && (
        <p>You don't have any study buddies yet.</p>
      )}

      <div>
        {buddies.map((buddy) => (
          <div
            key={buddy._id}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              marginBottom: "10px"
            }}
          >
            <h3>{buddy.fullName}</h3>

            <p>
              Email: {buddy.email}
            </p>

            <p>
              College:{" "}
              {buddy.college || "Not provided"}
            </p>

            <p>
              Course:{" "}
              {buddy.course || "Not provided"}
            </p>

            <p>
              Year:{" "}
              {buddy.year || "Not provided"}
            </p>

            <p>
              Subjects:{" "}
              {buddy.subjects?.length
                ? buddy.subjects.join(", ")
                : "Not provided"}
            </p>

            <p>
              Study Mode:{" "}
              {buddy.studyMode || "Not provided"}
            </p>

            <p>
              Location:{" "}
              {buddy.location || "Not provided"}
            </p>

            <button
              onClick={() =>
                handleRemove(buddy._id)
              }
              disabled={
                removingBuddy === buddy._id
              }
            >
              {removingBuddy === buddy._id
                ? "Removing..."
                : "Remove Buddy"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyBuddies;