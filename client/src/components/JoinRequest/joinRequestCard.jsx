import React, { useState } from 'react';
import "../../css/CallCard.css"; // משתמש באותו CSS כמו CallCard
import { joinRequestStatus } from "../formatHelpers";
import * as apiService from "../apiService";

function JoinRequestCard({ request, setRequests,refreshRequests, currentUserId }) {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const isOwner = request.targetUserId === currentUserId;
  const isAdmin = currentUser?.role === "admin";

  const [disabled, setDisabled] = useState(false);

  const handleDelete = async () => {
    if (disabled) return;
    setDisabled(true);
    if (!(isOwner || isAdmin)) {
      alert("רק בעל הבקשה או מנהל יכולים למחוק בקשה זו.");
      return;
    }
    if (!apiService.confirmAction("האם אתה בטוח שברצונך לדחות את הבקשה?")) return;
    try {
      await apiService.deleteData(`joinRequests/${request.id}`);
        refreshRequests();
      setRequests((prev) => prev.filter((r) => r.id !== request.id));
    } catch (error) {
      alert("שגיאה במחיקת הבקשה: " + error.message);
    }
  };
const handleApprove = async () => {
  if (disabled) return;
  setDisabled(true);
  try {
    // יצירת חברותא חדשה
    await apiService.addData("chavrutas", {
      user1: request.userId,
      user2: request.targetUserId,
      callId: request.callId,
      notesUser1: "",
      notesUser2: ""
    });

    // מחיקת כל הבקשות עם אותו callId
    const allRequests = await apiService.fetchData("joinRequests/");
    const sameCallRequests = allRequests.filter(r => r.callId === request.callId);
    for (const r of sameCallRequests) {
      await apiService.deleteData(`joinRequests/${r.id}`);
    }

    refreshRequests(); // רענון הרשימה
    alert("חברותא נוצרה בהצלחה!");
  } catch (error) {
    alert("שגיאה ביצירת החברותא: " + error.message);
  }
};
  // const handleApprove = async () => {
  //   if (disabled) return;
  //   setDisabled(true);
  //   try {
  //     // שלח בקשה ליצירת חברותא חדשה
  //     await apiService.addData("chavrutas", {
  //       user1: request.userId,         // בעל הקריאה
  //       user2: request.targetUserId,   // מי שביקש להצטרף
  //       callId: request.callId,
  //       notesUser1: "",
  //       notesUser2: ""
  //     });
  //     //    if (!(isOwner || isAdmin)) {
  //     //     alert("רק בעל הבקשה או מנהל יכולים למחוק בקשה זו.");
  //     //     return;
  //     //   }
  //     // try {
  //     //   await apiService.deleteData(`joinRequests/${request.id}`);
  //     //   setRequests((prev) => prev.filter((r) => r.id !== request.id));
  //     // } catch (error) {
  //     //   alert("שגיאה במחיקת הבקשה: " + error.message);
  //     // }
  //     setRequests((prev) => {
  //       prev.forEach(async (r) => {
  //         if (r.callId === request.callId) {
  //           try {
  //             await apiService.deleteData(`joinRequests/${r.id}`);
  //           } catch (error) {
  //             // אפשר להציג שגיאה או להתעלם
  //           }
  //         }
  //       });
  //       // מחזיר רק בקשות שלא שייכות ל-callId הזה
  //       return prev.filter((r) => r.callId !== request.callId);
  //     });
  //        refreshRequests();
  //     alert("חברותא נוצרה בהצלחה!");
  //     setRequests((prev) => prev.filter((r) => r.callId !== request.callId));
  //   } catch (error) {
  //     alert("שגיאה ביצירת החברותא: " + error.message);
  //   }
  // };
  return (
    <div className="call-card">
      <h3>📩 בקשה להצטרפות לקריאה #{request.callId}</h3>
      <p><strong>נשלחה מ:</strong> משתמש #{request.targetUserId}</p>
      <p><strong>סטטוס:</strong> {joinRequestStatus[request.status]}</p>
      <p><strong>פרטים:</strong> {request.details}</p>
      <p><strong>תאריך:</strong> {new Date(request.requestedAt).toLocaleString("he-IL")}</p>

      {!isAdmin  && (
        <div className="call-buttons">
          <button onClick={handleDelete}>מצטער, כבר לא רלוונטי</button>
          <button onClick={handleApprove}>מצוין! 👍</button>
        </div>
      )}

    </div>
  );
}

export default JoinRequestCard;
