// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import InterviewForm from "./InterviewForm";
import InterviewPage from "./InterviewPage";
import EvaluationPage from "./EvaluationPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<InterviewForm />} />
        <Route path="/interview" element={<InterviewPage />} />
      </Routes>
    </Router>
  );
}

export default App;
