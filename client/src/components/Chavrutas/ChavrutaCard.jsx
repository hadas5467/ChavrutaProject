// ChavrutaCard.jsx (שדרוג נעים וממוקד)
import { chavrutaStatus } from '../formatHelpers';
import "../../css/ChavrutaCard.css";
import React, { useState } from 'react';

const ChavrutaCard = ({ chavruta, users, currentUserId, editable = false, onUpdateNote }) => {
  const user1 = chavruta.user1 || null;
  const user2 = chavruta.user2 || null;

  const [noteUser1, setNoteUser1] = useState(chavruta.notesUser1 || '');
  const [noteUser2, setNoteUser2] = useState(chavruta.notesUser2 || '');
  const [showUser1, setShowUser1] = useState(false);
  const [showUser2, setShowUser2] = useState(false);
  const [showCall, setShowCall] = useState(false);

  const handleSave = (userField, value) => {
    if (onUpdateNote) {
      onUpdateNote(chavruta.chavrutaId, userField, value);
    }
  };

  return (
    <div className={`chavruta-card ${chavruta.status}`}>
      <h3>👥 {user1?.name} & {user2?.name}</h3>
      <p><strong>סטטוס:</strong> {chavrutaStatus[chavruta.status]}</p>

      {/* לחצנים לחשיפת פרטים */}
      <div className="chavruta-buttons">
        <button onClick={() => setShowUser1((prev) => !prev)}>
          {showUser1 ? 'הסתר פרטי משתמש 1' : 'הצג פרטי משתמש 1'}
        </button>
        <button onClick={() => setShowUser2((prev) => !prev)}>
          {showUser2 ? 'הסתר פרטי משתמש 2' : 'הצג פרטי משתמש 2'}
        </button>
        <button onClick={() => setShowCall((prev) => !prev)}>
          {showCall ? 'הסתר פרטי קריאה' : 'הצג פרטי קריאה'}
        </button>
      </div>

      {showUser1 && (
        <div className="user-details">
          <h4>🧑 פרטי {user1?.name}</h4>
          <p>📞 טלפון: {user1?.phone}</p>
          <p>📧 מייל: {user1?.gmail}</p>
          <p>🎂 גיל: {user1?.age}</p>
          <p>🏘 מגזר: {user1?.sector}</p>
          <p>🌐 שפות: {user1?.languages}</p>
          <p>📝 תיאור: {user1?.description}</p>
        </div>
      )}

      {showUser2 && (
        <div className="user-details">
          <h4>🧑 פרטי {user2?.name}</h4>
          <p>📞 טלפון: {user2?.phone}</p>
          <p>📧 מייל: {user2?.gmail}</p>
          <p>🎂 גיל: {user2?.age}</p>
          <p>🏘 מגזר: {user2?.sector}</p>
          <p>🌐 שפות: {user2?.languages}</p>
          <p>📝 תיאור: {user2?.description}</p>
        </div>
      )}

      {showCall && chavruta.call && (
        <div className="call-details">
          <h4>📘 פרטי הקריאה</h4>
          <p><strong>📍 מיקום:</strong> {chavruta.call.place}</p>
          <p><strong>📚 נושא:</strong> {chavruta.call.subject}</p>
          <p><strong>📑 חומרים:</strong> {chavruta.call.material}</p>
        </div>
      )}

      <p className="date">📅 נקבע ב: {new Date(chavruta.startedAt).toLocaleDateString('he-IL')}</p>

      {chavruta.status === 'ended' && (
        <div className="chavruta-notes">
          {chavruta.notesUser1 && <p><strong>הערה מ-{user1?.name}:</strong> {chavruta.notesUser1}</p>}
          {chavruta.notesUser2 && <p><strong>הערה מ-{user2?.name}:</strong> {chavruta.notesUser2}</p>}
        </div>
      )}
    </div>
  );
};

export default ChavrutaCard;
