import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./InterviewForm.module.css";

function InterviewForm() {
  const [resume, setResume] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [roleName, setRoleName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [interviewDuration, setInterviewDuration] = useState(30);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("companyName", companyName);
    formData.append("roleName", roleName);
    formData.append("jobDescription", jobDescription);
    formData.append("interviewDuration", interviewDuration);

    // POST to backend to save the data
    try {
      const response = await fetch("http://localhost:8081/api/upload-details", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Failed to upload info");
      }
      // If successful, navigate to the InterviewPage
      navigate("/interview");
    } catch (err) {
      console.error("An error occurs:", err);
    }
  };

  return (
    <div>
      <header className={styles.header}>
        <h1 className={styles.platformName}>AInterview</h1>
        <p className={styles.slogan}>
          Your AI-Powered Partner for Interview Preparation
        </p>
      </header>
      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit} className={styles.interviewForm}>
          <div className={styles.formGroup}>
            <label htmlFor="resume">Resume:</label>
            <input
              type="file"
              id="resume"
              name="resume"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setResume(e.target.files[0])}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="companyName">Company Name:</label>
            <input
              type="text"
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Enter company name"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="roleName">Role Name:</label>
            <input
              type="text"
              id="roleName"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              placeholder="Enter role name"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="jobDescription">Job Description:</label>
            <textarea
              id="jobDescription"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Enter job description"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="interviewDuration">
              Interview Duration (minutes):
            </label>
            <input
              type="number"
              id="interviewDuration"
              value={interviewDuration}
              onChange={(e) => setInterviewDuration(e.target.value)}
              placeholder="Enter duration"
            />
          </div>

          <button type="submit" className={styles.submitButton}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default InterviewForm;
