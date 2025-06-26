import '../../css/UserProfile.css';
import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, Edit, Save, X, Globe, MapPin, FileImage } from 'lucide-react';
import { contactMethod, sector, age, languageMap, availabilityStatus } from '../formatHelpers';
import { fetchData, UpdateData } from '../apiService';

const ProfilePage = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        age: '',
        sector: '',
        preferredContact: '',
        languages: '',
        city: '',
        bio: '',
        profile: '',
        availability: '',
    });

    const [originalData, setOriginalData] = useState(null);

    useEffect(() => {
        const loadUserData = async () => {
            const userId = JSON.parse(localStorage.getItem('currentUser'))?.id;
            if (!userId) return;

            try {
                const user = await fetchData(`users/${userId}`);
                if (!user) return;

                const data = {
                    fullName: user.name || '',
                    email: user.gmail || '',
                    phoneNumber: user.phone || '',
                    age: user.age || '',
                    sector: user.sector || '',
                    preferredContact: user.contactMethod || '',
                    languages: user.languages || '',
                    city: user.city || '',
                    bio: user.bio || '',
                    profile: user.profile || '',
                    availability: JSON.stringify(user.availability || {})
                };
                setFormData(data);
                setOriginalData(data);
            } catch (error) {
                console.error('שגיאה בטעינת נתוני המשתמש:', error);
            }
        };

        loadUserData();
    }, []);

    const handleSave = async () => {
        try {
            const userId = JSON.parse(localStorage.getItem('currentUser'))?.id;
            if (!userId) return;

            await UpdateData(`users/${userId}`, {
                name: formData.fullName,
                gmail: formData.email,
                phone: formData.phoneNumber,
                age: formData.age,
                sector: formData.sector,
                contactMethod: formData.preferredContact,
                languages: formData.languages,
                city: formData.city,
                bio: formData.bio,
                profile: formData.profile,
                availability: JSON.parse(formData.availability || '{}')
            });

            setIsEditing(false);
        } catch (err) {
            console.error('שגיאה בעדכון המשתמש:', err);
        }
    };

    const handleCancel = () => {
        if (originalData) {
            setFormData(originalData);
        }
        setIsEditing(false);
    };

    const ageLabel = age[formData.age] || formData.age;
    const getSectorLabel = value => sector?.[value] || value;
    const getContactLabel = value => contactMethod?.[value] || value;

    const sectorOptions = Object.entries(sector).map(([value, label]) => ({ value, label }));
    const contactOptions = Object.entries(contactMethod).map(([value, label]) => ({ value, label }));
    const languageOptions = Object.entries(languageMap).map(([value, label]) => ({ value, label }));
    const availabilityOptions = Object.entries(availabilityStatus).map(([value, label]) => ({ value, label }));

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
                    {/* שדות רגילים */}
                    {[
                        { label: 'שם מלא', key: 'fullName', icon: <User />, type: 'text' },
                        { label: 'כתובת מייל', key: 'email', icon: <Mail />, type: 'email', editable: false },
                        { label: 'מספר טלפון', key: 'phoneNumber', icon: <Phone />, type: 'tel' },
                        { label: 'גיל', key: 'age', icon: <Calendar />, type: 'text', editable: true, options: age },
                        { label: 'שפות', key: 'languages', icon: <Globe />, type: 'select', editable: true, options: languageOptions },
                        { label: 'עיר', key: 'city', icon: <MapPin />, type: 'text' },
                        { label: 'תמונת פרופיל (URL)', key: 'profile', icon: <FileImage />, type: 'text' },
                        { label: 'זמינות', key: 'availability', icon: <Calendar />, type: 'select', editable: true, options: availabilityOptions }
                    ].map(({ label, key, icon, type, editable = true, options }) => (
                        <div key={key}>
                            <label className="field-label">{label}</label>
                            {isEditing && editable ? (
                                type === 'select' ? (
                                    <select
                                        value={formData[key]}
                                        onChange={e => setFormData({ ...formData, [key]: e.target.value })}
                                        className="input"
                                    >
                                        {options.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type={type}
                                        value={formData[key]}
                                        onChange={e => setFormData({ ...formData, [key]: e.target.value })}
                                        className="input"
                                    />
                                )
                            ) : (
                                <div className="input-display">
                                    {icon}
                                    <span>{formData[key]}</span>
                                </div>
                            )}
                        </div>
                    ))}

                    {/* ביוגרפיה */}
                    <div>
                        <label className="field-label">ביוגרפיה</label>
                        {isEditing ? (
                            <textarea
                                value={formData.bio}
                                onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                className="input"
                            />
                        ) : (
                            <div className="input-display">
                                <span>{formData.bio}</span>
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="field-label">תמונת פרופיל</label>
                        {formData.profile && (
                            <div className="profile-image-wrapper">
                                <img
                                    src={`http://localhost:4000/api/users/profile/${formData.profile}`}
                                    alt="תמונת פרופיל"
                                    style={{ maxWidth: 120, borderRadius: '50%' }}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = '/default-profile.png';
                                    }}
                                />
                            </div>
                        )}
                    </div>
                    {/* סקטור */}
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

                    {/* אמצעי תקשורת מועדף */}
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
