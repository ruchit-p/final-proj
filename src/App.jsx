import Navbar from "./components/sections/Navbar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CreatePost from "./pages/CreatePost";
import Home from "./pages/Home";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import PostPage from "./pages/Post";
import EditPost from "./pages/EditPost";

function App() {
  return (
    <>
      <AuthProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/createpost" element={<CreatePost />} />
            <Route path="/post/:id" element={<PostPage />} />
            <Route path="/post/:id/edit" element={<EditPost />} />
          </Routes>
        </Router>
      </AuthProvider>
    </>
  );
}

export default App;
