
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div>
      <h1>Study Buddy Dashboard</h1>

      <p>
        Welcome, {user?.fullName || "User"}!
      </p>

      <hr />

      <h2>Navigation</h2>

      <div>
        <button>
          My Profile
        </button>

        <button onClick={() => navigate("/find-buddies")}>
          Find Study Buddies
        </button>

        <button>
          Buddy Requests
        </button>

        <button>
          My Buddies
        </button>

        <button>
          Chat
        </button>
      </div>

      <br />

      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default Dashboard;