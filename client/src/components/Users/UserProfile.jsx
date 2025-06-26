import '../../css/UserProfile.css';
import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, Edit, Save, X } from 'lucide-react';
import { contactMethod, sector, age } from '../formatHelpers';
import { fetchData } from '../apiService'; // ✅ ייבוא קריאת API

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    age: '',
    sector: '',
    preferredContact: ''
  });

  useEffect(() => {
    async function loadUserData() {
      const user = await fetchData('users/me');
      if (!user) return;
      setFormData({
        fullName: user.name || '',
        email: user.gmail || '',
        phoneNumber: user.phone || '',
        age: user.age || '',
        sector: user.sector || '',
        preferredContact: user.contactMethod || ''
      });
    }

    loadUserData();
  }, []);

  const handleSave = () => {
    console.log('Saving user data:', formData);
    setIsEditing(false);
    // כאן אפשר להוסיף UpdateData בעתיד
  };

  const handleCancel = async () => {
    const user = await fetchData('users/me');
    if (!user) return;
    setFormData({
      fullName: user.name || '',
      email: user.gmail || '',
      phoneNumber: user.phone || '',
      age: user.age || '',
      sector: user.sector || '',
      preferredContact: user.contactMethod || ''
    });
    setIsEditing(false);
  };

  const ageLabel = age[formData.age] || formData.age;
  const sectorOptions = Object.entries(sector).map(([value, label]) => ({ value, label }));
  const contactOptions = Object.entries(contactMethod).map(([value, label]) => ({ value, label }));
  const getSectorLabel = value => sector?.[value] || value;
  const getContactLabel = value => contactMethod?.[value] || value;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-header-left">
            <div className="profile-icon-wrapper">
              <User className="profile-icon" />
            </div>
            <div>
              <h1 className="profile-title">הפרופיל שלי</h1>
              <p className="profile-subtitle">נהל את פרטי החשבון שלך</p>
            </div>
          </div>
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className="edit-btn">
              <Edit className="icon" />
              עריכה
            </button>
          ) : (
            <div className="edit-actions">
              <button onClick={handleSave} className="save-btn">
                <Save className="icon" />
                שמור
              </button>
              <button onClick={handleCancel} className="cancel-btn">
                <X className="icon" />
                ביטול
              </button>
            </div>
          )}
        </div>

        <div className="form-grid">
          {[
            { label: 'שם מלא', key: 'fullName', icon: <User />, type: 'text' },
            { label: 'כתובת מייל', key: 'email', icon: <Mail />, type: 'email' },
            { label: 'מספר טלפון', key: 'phoneNumber', icon: <Phone />, type: 'tel' },
            { label: 'גיל', key: 'age', icon: <Calendar />, type: 'text' }
          ].map(({ label, key, icon, type }) => (
            <div key={key}>
              <label className="field-label">{label}</label>
              {isEditing ? (
                <input
                  type={type}
                  value={formData[key]}
                  onChange={e => setFormData({ ...formData, [key]: e.target.value })}
                  className="input"
                />
              ) : (
                <div className="input-display">
                  {icon}
                  <span>{key === 'age' ? ageLabel : formData[key]}</span>
                </div>
              )}
            </div>
          ))}

          <div>
            <label className="field-label">סקטור</label>
            {isEditing ? (
              <select
                value={formData.sector}
                onChange={e => setFormData({ ...formData, sector: e.target.value })}
                className="input"
              >
                {sectorOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <div className="input-display">
                <span>{getSectorLabel(formData.sector)}</span>
              </div>
            )}
          </div>

          <div>
            <label className="field-label">אמצעי התקשרות מועדף</label>
            {isEditing ? (
              <select
                value={formData.preferredContact}
                onChange={e => setFormData({ ...formData, preferredContact: e.target.value })}
                className="input"
              >
                {contactOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <div className="input-display">
                <span>{getContactLabel(formData.preferredContact)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
