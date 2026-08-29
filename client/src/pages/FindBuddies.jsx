
import { useEffect, useState } from "react";
import api from "../services/api";

function FindBuddies() {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    subject: "",
    college: "",
    course: "",
    year: "",
    studyMode: "",
    location: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getUsers = async (customFilters = filters) => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const params = {};

      Object.entries(customFilters).forEach(([key, value]) => {
        if (value) {
          params[key] = value;
        }
      });

      const response = await api.get("/users/search", {
        params,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setUsers(response.data.users);
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Failed to fetch users"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    getUsers();
  };

  return (
    <div>
      <h2>Find Study Buddies</h2>

      <form onSubmit={handleSearch}>
        <div>
          <label>Subject</label>
          <br />
          <input
            type="text"
            name="subject"
            value={filters.subject}
            onChange={handleChange}
            placeholder="Example: JavaScript"
          />
        </div>

        <br />

        <div>
          <label>College</label>
          <br />
          <input
            type="text"
            name="college"
            value={filters.college}
            onChange={handleChange}
            placeholder="College name"
          />
        </div>

        <br />

        <div>
          <label>Course</label>
          <br />
          <input
            type="text"
            name="course"
            value={filters.course}
            onChange={handleChange}
            placeholder="Example: BCA"
          />
        </div>

        <br />

        <div>
          <label>Year</label>
          <br />
          <input
            type="number"
            name="year"
            value={filters.year}
            onChange={handleChange}
            placeholder="Example: 3"
          />
        </div>

        <br />

        <div>
          <label>Study Mode</label>
          <br />

          <select
            name="studyMode"
            value={filters.studyMode}
            onChange={handleChange}
          >
            <option value="">Any</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            <option value="both">Both</option>
          </select>
        </div>

        <br />

        <div>
          <label>Location</label>
          <br />

          <input
            type="text"
            name="location"
            value={filters.location}
            onChange={handleChange}
            placeholder="Example: Delhi"
          />
        </div>

        <br />

        <button type="submit">
          Search
        </button>
      </form>

      <hr />

      {loading && <p>Loading users...</p>}

      {error && <p>{error}</p>}

      {!loading && users.length === 0 && (
        <p>No users found.</p>
      )}

      <div>
        {users.map((user) => (
          <div
            key={user._id}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              marginBottom: "10px"
            }}
          >
            <h3>{user.fullName}</h3>

            <p>Email: {user.email}</p>

            <p>College: {user.college || "Not provided"}</p>

            <p>Course: {user.course || "Not provided"}</p>

            <p>Year: {user.year || "Not provided"}</p>

            <p>
              Subjects:{" "}
              {user.subjects?.length
                ? user.subjects.join(", ")
                : "Not provided"}
            </p>

            <p>
              Study Mode: {user.studyMode || "Not provided"}
            </p>

            <p>
              Location: {user.location || "Not provided"}
            </p>

            <p>
              Bio: {user.bio || "No bio available"}
            </p>

          </div>
        ))}
      </div>
    </div>
  );
}

export default FindBuddies;