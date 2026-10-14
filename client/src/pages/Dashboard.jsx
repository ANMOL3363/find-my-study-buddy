
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const getInitials = (name) => {
    if (!name) return "U";

    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div className="dashboard-page">

      <header className="dashboard-header">
        <div className="dashboard-brand">
          <div className="brand-icon">SB</div>

          <div>
            <h1>Study Buddy</h1>
            <span>Find. Connect. Study Together.</span>
          </div>
        </div>

        <div className="dashboard-user">
          <div className="dashboard-avatar">
            {getInitials(user?.fullName)}
          </div>

          <div className="dashboard-user-info">
            <strong>{user?.fullName || "User"}</strong>
            <span>Student</span>
          </div>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-main">

        <section className="welcome-section">
          <div>
            <p className="welcome-label">WELCOME BACK 👋</p>

            <h2>
              Hello, {user?.fullName || "User"}!
            </h2>

            <p>
              Ready to find your perfect study buddy?
              Connect with students and make studying
              more productive.
            </p>
          </div>

          <div className="welcome-decoration">
            🎓
          </div>
        </section>

        <section className="dashboard-stats">

          <div className="stat-card">
            <div className="stat-icon purple">
              👥
            </div>

            <div>
              <span>Study Buddies</span>
              <strong>Connect</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon blue">
              🔎
            </div>

            <div>
              <span>Discover</span>
              <strong>Find Students</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">
              💬
            </div>

            <div>
              <span>Messages</span>
              <strong>Start Chatting</strong>
            </div>
          </div>

        </section>

        <section className="dashboard-section">

          <div className="section-heading">
            <div>
              <h3>Quick Actions</h3>
              <p>
                Everything you need to manage your study network.
              </p>
            </div>
          </div>

          <div className="action-grid">

            <button
              className="action-card"
              onClick={() => navigate("/find-buddies")}
            >
              <div className="action-icon find-icon">
                🔎
              </div>

              <div>
                <h4>Find Study Buddies</h4>

                <p>
                  Discover students who share your
                  interests and subjects.
                </p>
              </div>

              <span className="action-arrow">
                →
              </span>
            </button>

            <button
              className="action-card"
              onClick={() => navigate("/buddy-requests")}
            >
              <div className="action-icon request-icon">
                🤝
              </div>

              <div>
                <h4>Buddy Requests</h4>

                <p>
                  View and manage your incoming
                  study buddy requests.
                </p>
              </div>

              <span className="action-arrow">
                →
              </span>
            </button>

            <button
              className="action-card"
              onClick={() => navigate("/my-buddies")}
            >
              <div className="action-icon buddies-icon">
                👥
              </div>

              <div>
                <h4>My Buddies</h4>

                <p>
                  View the students you've connected
                  with.
                </p>
              </div>

              <span className="action-arrow">
                →
              </span>
            </button>

            <button
              className="action-card"
              onClick={() => navigate("/chat")}
            >
              <div className="action-icon chat-icon">
                💬
              </div>

              <div>
                <h4>Chat</h4>

                <p>
                  Message your study buddies and
                  collaborate together.
                </p>
              </div>

              <span className="action-arrow">
                →
              </span>
            </button>

            <button
              className="action-card"
              onClick={() => navigate("/profile")}
            >
              <div className="action-icon profile-icon">
                👤
              </div>

              <div>
                <h4>My Profile</h4>

                <p>
                  Update your profile and study
                  preferences.
                </p>
              </div>

              <span className="action-arrow">
                →
              </span>
            </button>

          </div>
        </section>

        <section className="dashboard-tip">

          <div className="tip-icon">
            💡
          </div>

          <div>
            <h4>Study Buddy Tip</h4>

            <p>
              Connect with students who have similar
              subjects and study goals to make your
              learning journey more effective.
            </p>
          </div>

        </section>

      </main>

      <footer className="dashboard-footer">
        <p>
          © 2026 Study Buddy. Learn together, grow together.
        </p>
      </footer>

    </div>
  );
}

export default Dashboard;