// EvaluationPage.js
import React from "react";
import "./EvaluationPage.css";

function EvaluationPage() {
  const score = 85; // 模拟的分数，实际中会通过算法生成
  const feedback =
    "Your answers were clear and concise. However, you can improve your confidence when discussing your strengths and weaknesses.";

  const handleDownloadRecording = () => {
    // 模拟录音下载，实际中需要将真实文件路径传递给用户
    const link = document.createElement("a");
    link.href = "/path-to-audio-file.mp3"; // 替换为实际录音文件路径
    link.download = "interview_recording.mp3";
    link.click();
  };

  const handleDownloadTranscript = () => {
    // 模拟文本下载
    const link = document.createElement("a");
    link.href = "/path-to-transcript.txt"; // 替换为实际转译文本路径
    link.download = "interview_transcript.txt";
    link.click();
  };

  return (
    <div className="evaluation-page">
      <h2>Interview Evaluation</h2>

      <div className="score-section">
        <div className="score-circle">
          <p>{score}</p>
        </div>
        <p className="score-text">Your Score</p>
      </div>

      <div className="feedback-section">
        <h3>Feedback</h3>
        <p>{feedback}</p>
      </div>

      <div className="download-section">
        <h3>Download Files for Review</h3>
        <button onClick={handleDownloadRecording} className="download-button">
          Download Recording
        </button>
        <button onClick={handleDownloadTranscript} className="download-button">
          Download Transcript
        </button>
      </div>
    </div>
  );
}

export default EvaluationPage;
