// components/Call/CallForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  learningFormat, preferredDuration,ageRange} from '../formatHelpers';
import '../../css/CallCard.css'
const CallForm = ({ onSuccess }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    subject: '',
    material: '',
    learningFormat: 'any',
    preferredDuration: '1_hour',
    ageRange: '25-35',
    place: '',
    notes: '',
    time: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) return alert("יש להתחבר כדי לפרסם קריאה");

    const newCall = {
      ...formData,
      userId: user.id,
      targetUserId: null
    };

    try {
      const result = await addData('calls', newCall);
      if (!result || !result.call.id) {
        throw new Error("ההוספה נכשלה - לא התקבלה תשובה תקינה");
      }
      alert("✅ קריאה נוספה");
      navigate('/home');
      setFormData({
        subject: '',
        material: '',
        learningFormat: 'any',
        preferredDuration: '1_hour',
        ageRange: '25-35',
        place: '',
        notes: '',
        time: ''
      });
      if (onSuccess) onSuccess(result);
    } catch (err) {
      //alert("❌ שגיאה בהוספת קריאה");
      console.log(err);
    }
  };

  return (
    <form className="call-card call-form" onSubmit={handleSubmit}>
      <h3>📢 יצירת קריאה חדשה</h3>
      <input name="subject" placeholder="נושא" value={formData.subject} onChange={handleChange} required />
      <input name="material" placeholder="חומר לימוד" value={formData.material} onChange={handleChange} />
      <input name="place" placeholder="אופציונלי- כתובת מדויקת" value={formData.place} onChange={handleChange} />
      <input type="datetime-local" name="time" value={formData.time} onChange={handleChange} required />

      <label>פורמט לימוד:</label>
      <select name="learningFormat" value={formData.learningFormat} onChange={handleChange}>
        {Object.entries(learningFormat).map(([key, label]) => (
          <option key={key} value={key}>{label}</option>
        ))}
      </select>

      <label>משך לימוד:</label>
      <select name="preferredDuration" value={formData.preferredDuration} onChange={handleChange}>
        {Object.entries(preferredDuration).map(([key, label]) => (
          <option key={key} value={key}>{label}</option>
        ))}
      </select>

      <label>טווח גילאים:</label>
      <select name="ageRange" value={formData.ageRange} onChange={handleChange}>
        {Object.entries(ageRange).map(([key, label]) => (
          <option key={key} value={key}>{label}</option>
        ))}
      </select>

      <textarea name="notes" placeholder="הערות" value={formData.notes} onChange={handleChange} />
      <button type="submit">📌 פרסם קריאה</button>
    </form>
  );
};

export default CallForm;
