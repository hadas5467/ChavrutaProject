import React, { useState } from "react";
import "../../css/CallCard.css";
import * as apiService from "../apiService.js";
import { callSchema } from "../../Schema/CallSchema.js"; // שנה לנתיב שלך
import {
  learningFormat,
  preferredDuration,
  ageRange,
  experienceLevel,
  availabilityStatus,
  contactMethod,
  languageMap,
  sector
} from "../formatHelpers.js";

function CallCard({ call, user, setCalls, currentUserId }) {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const isOwner = call.userId === currentUserId;
  const isAdmin = currentUser?.role === "admin";

  const handleDeleteCall = async (callId) => {
    if (!apiService.confirmAction("האם אתה בטוח שברצונך למחוק את הקריאה?")) return;
    try {
      await apiService.deleteData(`calls/${callId}`);
      setCalls((prevCalls) => prevCalls.filter((c) => c.callId !== callId));
    } catch (error) {
      //alert(`שגיאה במחיקת הקריאה: ${error.message}`);
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
      details: `בקשה להצטרפות לקריאה בנושא "${call.subject}"`,
    };

    try {
      await apiService.addData("joinRequests", requestData);
      alert(
        `✅ בקשתך נשלחה בהצלחה!\n\n📚 נושא הקריאה: ${call.subject}\n📍 מיקום: ${call.place || "גמיש"}\n🕒 זמן: ${new Date(call.time).toLocaleString("he-IL")}`
      );
    } catch (error) {
      alert("❌ שגיאה בשליחת בקשה: ");
    }
  };

  return (
    <div className="call-card">
      <h3>{call.subject}</h3>
      <p><strong>מיקום:</strong> {call.place || "גמיש"}</p>
      <p><strong>פורמט:</strong> {learningFormat[call.learningFormat]}</p>
      <p><strong>גילאים:</strong> {ageRange[call.ageRange]}</p>
      <p><strong>משך:</strong> {preferredDuration[call.preferredDuration]}</p>
      <p><strong>חומר:</strong> {call.material}</p>
      <p><strong>הערות:</strong> {call.notes}</p>
      <p><strong>זמן:</strong> {new Date(call.time).toLocaleString("he-IL")}</p>

      {(isOwner || isAdmin) && (
        <div className="call-buttons">
          <button onClick={() => handleDeleteCall(call.id)}>מחיקה</button>
        </div>
      )}

      {!isOwner && (
        <div className="call-buttons">
          <button className="join-btn" onClick={joinRequest}>
            להצטרפות
          </button>
        </div>
      )}
    </div>
  );
}

export default CallCard;
