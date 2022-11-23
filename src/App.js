import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import PostList from "./pages/PostList";
import SearchPage from "./pages/SearchPage";
import TablePosts from "./pages/TablePosts";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/:hashtag" element={<PostList />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/posts" element={<TablePosts />} />
      </Routes>
    </Router>
  );
}

export default App;
