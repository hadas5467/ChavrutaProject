import React from "react";
import "../../css/CallCard.css"; // משתמש באותו CSS כמו CallCard
import { joinRequestStatus } from "../formatHelpers";
import * as apiService from "../apiService";

function JoinRequestCard({ request, setRequests, currentUserId }) {
  const isOwner = request.userId === currentUserId;

  const handleDelete = async () => {
    if (!apiService.confirmAction("האם אתה בטוח שברצונך למחוק את הבקשה?")) return;
    try {
      await apiService.deleteData(`joinRequests/${request.id}`);
      setRequests((prev) => prev.filter((r) => r.id !== request.id));
    } catch (error) {
      alert("שגיאה במחיקת הבקשה: " + error.message);
    }
  };

  return (
    <div className="call-card">
      <h3>📩 בקשה להצטרפות לקריאה #{request.callId}</h3>
      <p><strong>נשלחה מ:</strong> משתמש #{request.targetUserId}</p>
      <p><strong>סטטוס:</strong> {joinRequestStatus[request.status]}</p>
      <p><strong>פרטים:</strong> {request.details}</p>
      <p><strong>תאריך:</strong> {new Date(request.requestedAt).toLocaleString("he-IL")}</p>
      {isOwner && (
        <div className="call-buttons">
          <button onClick={handleDelete}>מחיקה</button>
        </div>
      )}
    </div>
  );
}

export default JoinRequestCard;
