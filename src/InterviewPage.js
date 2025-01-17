import React, { useState, useRef } from "react";
import styles from "./InterviewPage.module.css";

const BASE_URL = "http://localhost:8081";

function InterviewPage() {
  const [isAnswering, setIsAnswering] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(
    "Please click 'Start Recording' to start the interview."
  );

  // MediaRecorder 相关
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]); // 用于存储录音数据片段

  // 播放语音问题
  const playVoice = async (text) => {
    try {
      const response = await fetch(`${BASE_URL}/api/speech`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch audio");
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (error) {
      console.error("Error playing voice:", error);
    }
  };

  // 开始回答 (开始录音)
  const handleStart = async () => {
    try {
      console.log(
        "isTypeSupported('audio/webm; codecs=opus') =>",
        MediaRecorder.isTypeSupported("audio/webm; codecs=opus")
      );
      // 访问麦克风
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // 初始化 MediaRecorder，指定 mimeType 为 'audio/webm; codecs=opus'
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: "audio/webm; codecs=opus",
      });

      // 每收到一段音频数据，就 push 到 chunksRef
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      // 开始录制
      mediaRecorderRef.current.start();
      setIsAnswering(true);
      console.log("Recording started...");
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  // 结束回答 (停止录音并发送给后端)
  const handleEnd = async () => {
    if (!mediaRecorderRef.current) return;

    // 停止录音
    mediaRecorderRef.current.stop();
    console.log("Recording stopped.");

    // 在 onstop 回调里合并数据并上传
    mediaRecorderRef.current.onstop = async () => {
      // 将所有 chunks 合并成一个 Blob
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      chunksRef.current = []; // 清空，为下次录音做准备

      // 用 FormData 发送到后端
      const formData = new FormData();
      // 注意，这里我们把文件命名为 'audio.webm'
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-"); // Timestamp for the output file
      formData.append("audio", blob, `audio-${timestamp}.webm`);

      try {
        const response = await fetch(`${BASE_URL}/api/transcribe`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Transcribe failed with status ${response.status}`);
        }

        const data = await response.json();
        const { transcript, nextQuestion } = data;

        setCurrentQuestion(nextQuestion || "No more questions.");

        console.log("User transcript:", transcript);
        console.log("Next question from AI:", nextQuestion);

        // 播放下一问题
        if (nextQuestion) {
          await playVoice(nextQuestion);
        }
      } catch (err) {
        console.error("Error sending audio to transcribe:", err);
      }

      setIsAnswering(false);
    };
  };

  return (
    <div className={styles.interviewPage}>
      {/* 侧边栏 / 进度等，可自行添加 */}
      <div className={styles.sidebar}>
        <h3 className={styles.sidebarTitle}>Interview Progress</h3>
      </div>

      {/* 主要内容区 */}
      <div className={styles.mainContent}>
        <div className={styles.chatWindow}>
          <div className={styles.questionBubble}>
            <p className={styles.questionText}>{currentQuestion}</p>
          </div>
        </div>

        <div className={styles.answerContainer}>
          {!isAnswering && (
            <button onClick={handleStart} className={styles.startButton}>
              Start Answering
            </button>
          )}

          {isAnswering && (
            <div className={styles.answeringSection}>
              <p className={styles.answeringStatus}>Recording...</p>
              <button onClick={handleEnd} className={styles.endButton}>
                End Answer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default InterviewPage;
