// CallCard.jsx (שדרוג ויזואלי וחווייתי)
import React, { useState } from "react";
import "../../css/CallCard.css";
import * as apiService from "../apiService.js";
import {
  learningFormat,
  preferredDuration,
  ageRange,
  experienceLevel,
  contactMethod,
  languageMap,
  sector
} from "../formatHelpers.js";

function CallCard({ call, user, setCalls, currentUserId }) {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const isOwner = call.targetUserId === currentUserId;
  const isAdmin = currentUser?.role === "admin";
  const [showUserDetails, setShowUserDetails] = useState(false);

  const handleDeleteCall = async (callId) => {
    if (!apiService.confirmAction("האם אתה בטוח שברצונך למחוק את הקריאה?")) return;
    try {
      await apiService.deleteData(`calls/${callId}`);
      setCalls((prevCalls) => prevCalls.filter((c) => c.callId !== callId));
    } catch (error) {
      alert(`שגיאה במחיקת הקריאה`);
    }
  };

  const joinRequest = async () => {
    if (!currentUser) {
      alert("יש להתחבר למערכת כדי לשלוח בקשה.");
      return;
    }

    const requestData = {
      callId: call.callId,
      userId: currentUser.id,
      targetUserId: call.userId,
      details: `בקשה להצטרפות לקריאה בנושא "${call.subject}"`
    };

    try {
      await apiService.addData("joinRequests", requestData);
      alert(`✅ בקשתך נשלחה בהצלחה!\n\n📚 נושא הקריאה: ${call.subject}\n📍 מיקום: ${call.place || "גמיש"}\n🕒 זמן: ${new Date(call.time).toLocaleString("he-IL")}`);
    } catch (error) {
      alert("❌ שגיאה בשליחת בקשה");
    }
  };

  return (
    <div className="call-card">
      <h3>📚 {call.subject}</h3>
      <p><strong>📍 מיקום:</strong> {call.place || "גמיש"}</p>
      <p><strong>🧭 פורמט:</strong> {learningFormat[call.learningFormat]}</p>
      <p><strong>🎯 גילאים:</strong> {ageRange[call.ageRange]}</p>
      <p><strong>⏱ משך:</strong> {preferredDuration[call.preferredDuration]}</p>
      <p><strong>📘 חומר:</strong> {call.material}</p>
      <p><strong>📝 הערות:</strong> {call.notes}</p>
      <p><strong>🕒 זמן:</strong> {new Date(call.time).toLocaleString("he-IL")}</p>

      {showUserDetails && call.sender && (
        <div className="user-details">
          <hr />
          <h4>🙋 פרטי יוזם הקריאה:</h4>
          <p><strong>שם:</strong> {call.sender.name}</p>
          <p><strong>מין:</strong> {call.sender.sex === 'male' ? 'זכר' : 'נקבה'}</p>
          <p><strong>גיל:</strong> {call.sender.age}</p>
          <p><strong>מגזר:</strong> {sector[call.sender.sector]}</p>
          <p><strong>עיר:</strong> {call.sender.city}</p>
          <p><strong>מדינה:</strong> {call.sender.country}</p>
          <p><strong>רמה:</strong> {experienceLevel[call.sender.experienceLevel]}</p>
          <p><strong>שפות:</strong> {call.sender.languages}</p>
          <p><strong>ביוגרפיה:</strong> {call.sender.bio}</p>
        </div>
      )}

      <div className="call-buttons">
        <button onClick={() => setShowUserDetails((prev) => !prev)}>
          {showUserDetails ? "הסתר פרטי משתמש" : "הצג פרטי משתמש"}
        </button>

        {isAdmin && (
          <button onClick={() => handleDeleteCall(call.id)}>🗑 מחיקה</button>
        )}

        {isOwner && (
          <button className="join-btn" onClick={joinRequest}>
            ✋ להצטרפות
          </button>
        )}
      </div>
    </div>
  );
}

export default CallCard;
