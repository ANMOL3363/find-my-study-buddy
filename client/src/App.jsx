
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import Register from "./pages/Register";

import Login from "./pages/Login";

function Home() {
  return <Navigate to="/login" />;
}

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to Study Buddy.</p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="*"
          element={<Navigate to="/login" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;