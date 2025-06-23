import React, { useState } from "react";
import { Play, Trash2, Edit3, Save } from "lucide-react";
import * as apiService from "../../apiService";
import "../../css/lesson.css";

function LessonCard({ lesson, setLessons }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(lesson.title);

  const handleEditClick = () => {
    if (isEditing) {
      handleUpdateTitle(lesson, newTitle);
    }
    setIsEditing((prev) => !prev);
  };

  function handleUpdateTitle(lesson, newTitle) {
    if (!newTitle.trim()) {
      setNewTitle(lesson.title);
      return;
    }

    const updatedLesson = { ...lesson, title: newTitle };
    handleUpdateLesson(lesson, updatedLesson);
  }

  async function handleUpdateLesson(lesson, updateData) {
    try {
      //await apiService.UpdateData(`lessons/${lesson.id}`, updateData);
      setLessons((prevLessons) =>
        prevLessons.map((l) => (l.id === lesson.id ? { ...l, ...updateData } : l))
      );
    } catch (error) {
      alert(`שגיאה בעדכון השיעור: ${error.message}`);
    }
  }

  async function handleDeleteLesson(id) {
    if (!apiService.confirmAction("האם אתה בטוח שברצונך למחוק את השיעור?")) return;

    try {
      await apiService.deleteData(`lessons/${id}`);
      setLessons((prevLessons) => prevLessons.filter((l) => l.id !== id));
    } catch (error) {
      alert("שגיאה במחיקת השיעור");
    }
  }

  const handleJoinClick = () => {
    if (lesson.zoomLink) window.open(lesson.zoomLink, "_blank");
  };

  return (
    <div className="lesson-card">
      <p className="lesson-id">מספר מזהה: {lesson.id}</p>

      {isEditing ? (
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="lesson-edit-input"
        />
      ) : (
        <h3 className="lesson-title">{lesson.title}</h3>
      )}

      <p>מרצה: {lesson.teacher}</p>
      <p>תאריך: {lesson.date}</p>
      <p>שעה: {lesson.time}</p>
      <p>מספר משתתפים: {lesson.participants}</p>
      <p>{lesson.isLive ? "בשידור חי" : "לא בשידור חי"}</p>

      <div className="lesson-buttons">
        <button onClick={handleJoinClick} className="join-button">
          <Play size={16} /> הצטרף
        </button>
        <button onClick={handleEditClick} className="edit-button">
          {isEditing ? <Save size={16} /> : <Edit3 size={16} />}
          {isEditing ? "שמור" : "ערוך"}
        </button>
        <button onClick={() => handleDeleteLesson(lesson.id)} className="delete-button">
          <Trash2 size={16} /> מחק
        </button>
      </div>
    </div>
  );
}

export default LessonCard;
