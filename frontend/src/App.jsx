// import React from "react";
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import About from "./components/About";
// import Problems from "./components/Problems";
// import Leaderboard from "./components/Leaderboard";
// import Login from "./components/Login";
// import Signup from "./components/Signup";
// import ProtectedRoute from "./components/ProtectedRoute";

// const App = () => {
//   return (
//     <Router>
//       <div>
//         <Navbar />
//         <div className="content">
//           <Routes>
//             <Route path="/login" element={<Login />} />
//             <Route path="/signup" element={<Signup />} />

//             <Route path="/" element={<About />} />
//             <Route path="/problems" element={<Problems />} />
//             <Route path="/leaderboard" element={<Leaderboard />} />
//           </Routes>
//         </div>
//       </div>
//     </Router>
//   );
// };

// export default App;

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import About from "./components/About";
import Problems from "./components/Problems";
import Leaderboard from "./components/Leaderboard";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  const isAuthenticated = !!localStorage.getItem("token"); // Check if token exists

  return (
    <Router>
      <div className="content">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected routes */}
          <Route path="/" element={<ProtectedRoute element={<About />} />} />
          <Route
            path="/problems"
            element={<ProtectedRoute element={<Problems />} />}
          />
          <Route
            path="/leaderboard"
            element={<ProtectedRoute element={<Leaderboard />} />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
