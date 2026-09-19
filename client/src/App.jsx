
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import FindBuddies from "./pages/FindBuddies";
import BuddyRequests from "./pages/BuddyRequests";
import MyBuddies from "./pages/MyBuddies";
import Chat from "./pages/Chat";


function Home() {
  return <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/find-buddies"
          element={<FindBuddies />}
        />

        <Route
          path="*"
          element={<Navigate to="/login" />}
        />
        <Route
          path="/buddy-requests"
          element={<BuddyRequests />}
        />
        <Route
          path="/my-buddies"
          element={<MyBuddies />}
        />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;