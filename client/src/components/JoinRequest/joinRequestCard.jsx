// JoinRequestCard.jsx (שדרוג ויזואלי וחווייתי)
import React, { useState } from "react";
import "../../css/JoinRequestCard.css";
import { learningFormat, preferredDuration, ageRange, experienceLevel, sector } from "../formatHelpers";

function JoinRequestCard({ request, setRequests, refreshRequests, currentUserId }) {
  const [showSenderDetails, setShowSenderDetails] = useState(false);
  const [showCallDetails, setShowCallDetails] = useState(false);

  const statusLabel = {
    pending: "⏳ ממתינה",
    approved: "✅ אושרה",
    declined: "❌ נדחתה"
  }[request.status] || request.status;

  return (
    <div className="join-request-card">
      <h4>📬 בקשה לקריאה בנושא "{request.call.subject}"</h4>
      <p><strong>סטטוס:</strong> {statusLabel}</p>
      <p><strong>פרטים נוספים:</strong> {request.details || "---"}</p>

      {showCallDetails && request.call && (
        <div className="call-details">
          <hr />
          <h5>📚 פרטי הקריאה</h5>
          <p><strong>🧭 פורמט:</strong> {learningFormat[request.call.learningFormat]}</p>
          <p><strong>📍 מיקום:</strong> {request.call.place || "גמיש"}</p>
          <p><strong>🎯 גילאים:</strong> {ageRange[request.call.ageRange]}</p>
          <p><strong>⏱ משך:</strong> {preferredDuration[request.call.preferredDuration]}</p>
          <p><strong>📘 חומר:</strong> {request.call.material}</p>
          <p><strong>📝 הערות:</strong> {request.call.notes}</p>
          <p><strong>🕒 זמן:</strong> {new Date(request.call.time).toLocaleString("he-IL")}</p>
        </div>
      )}

      {showSenderDetails && request.sender && (
        <div className="sender-details">
          <hr />
          <h5>🙋 פרטי המבקש:</h5>
          <p><strong>שם:</strong> {request.sender.name}</p>
          <p><strong>מין:</strong> {request.sender.sex === 'male' ? 'זכר' : 'נקבה'}</p>
          <p><strong>גיל:</strong> {request.sender.age}</p>
          <p><strong>מגזר:</strong> {sector[request.sender.sector]}</p>
          <p><strong>עיר:</strong> {request.sender.city}</p>
          <p><strong>מדינה:</strong> {request.sender.country}</p>
          <p><strong>רמה:</strong> {experienceLevel[request.sender.experienceLevel]}</p>
          <p><strong>תגיות:</strong> {request.sender.tags}</p>
          <p><strong>ביוגרפיה:</strong> {request.sender.bio}</p>
        </div>
      )}

      <div className="request-buttons">
        <button onClick={() => setShowCallDetails(prev => !prev)}>
          {showCallDetails ? "הסתר פרטי קריאה" : "הצג פרטי קריאה"}
        </button>
        <button onClick={() => setShowSenderDetails(prev => !prev)}>
          {showSenderDetails ? "הסתר פרטי משתמש" : "הצג פרטי משתמש"}
        </button>
      </div>
    </div>
  );
}

export default JoinRequestCard;
