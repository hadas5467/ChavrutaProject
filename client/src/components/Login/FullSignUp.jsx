import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Phone, Calendar, Mail, User, Globe, MapPin, Book, MessageSquare } from 'lucide-react';
import { addData } from '../apiService';
import { age, sector, contactMethod, experienceLevel, availabilityStatus } from '../formatHelpers';
import '../../css/SignupFull.css';

const FullSignUp = () => {
    const [formData, setFormData] = useState({
        phone: '',
        age: '',
        sector: '',
        contactMethod: '',
        city: '',
        country: '',
        languages: [],
        bio: '',
        experienceLevel: '',
        availabilityStatus: '',
        tags: '',
    });

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!location.state) navigate('/signup');
    }, [location.state, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleLanguagesChange = (e) => {
        const { value, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            languages: checked ? [...prev.languages, value] : prev.languages.filter((l) => l !== value)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const allData = { ...location.state, ...formData };
            const result=await addData('users/register', allData);

            //if (result?.message === 'User registered successfully') {
                navigate('/home');
            // } else {
            //     alert('הרישום נכשל. נסה שוב.');
           // }
        } catch (error) {
            alert('שגיאה בשליחה. נסה שוב.');
        }
    };

    return (
        <div className="signup-wrapper">
            <form className="signup-form" onSubmit={handleSubmit}>
                <h2>השלמת פרופיל</h2>

                <InputField label="טלפון" name="phone" icon={<Phone />} value={formData.phone} onChange={handleChange} />
                <SelectField label="גיל" name="age" value={formData.age} onChange={handleChange} options={age} />
                <SelectField label="מגזר" name="sector" value={formData.sector} onChange={handleChange} options={sector} />
                <SelectField label="אמצעי יצירת קשר" name="contactMethod" value={formData.contactMethod} onChange={handleChange} options={contactMethod} />
                <InputField label="עיר" name="city" icon={<MapPin />} value={formData.city} onChange={handleChange} />
                <InputField label="מדינה" name="country" icon={<Globe />} value={formData.country} onChange={handleChange} />

                <div className="input-group">
                    <label className="label">שפות מדוברות</label>
                    <div className="language-checkboxes">
                        {['עברית', 'אנגלית', 'צרפתית', 'ספרדית', 'רוסית'].map((lang) => (
                            <label key={lang} className="checkbox-label">
                                <input
                                    type="checkbox"
                                    value={lang}
                                    onChange={handleLanguagesChange}
                                    checked={formData.languages.includes(lang)}
                                />
                                {lang}
                            </label>
                        ))}
                    </div>
                </div>

                <TextAreaField label="ביוגרפיה" name="bio" icon={<MessageSquare />} value={formData.bio} onChange={handleChange} />
                <SelectField label="רמת ניסיון" name="experienceLevel" value={formData.experienceLevel} onChange={handleChange} options={experienceLevel} />
                <SelectField label="סטטוס זמינות" name="availabilityStatus" value={formData.availabilityStatus} onChange={handleChange} options={availabilityStatus} />
                <InputField label="תגיות (מופרדות בפסיקים)" name="tags" icon={<Book />} value={formData.tags} onChange={handleChange} />

                <button type="submit" className="signup-button">סיום הרשמה</button>
            </form>
        </div>
    );
};

const InputField = ({ label, name, value, onChange, icon }) => (
    <div className="input-group">
        <label className="label">{label}</label>
        <div className="relative">
            {icon && <span className="icon-left">{icon}</span>}
            <input type="text" name={name} value={value} onChange={onChange} className="input" required />
        </div>
    </div>
);

const SelectField = ({ label, name, value, onChange, options }) => (
    <div className="input-group">
        <label className="label">{label}</label>
        <select name={name} value={value} onChange={onChange} className="input" required>
            <option value="">בחר</option>
            {Object.entries(options).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
            ))}
        </select>
    </div>
);

const TextAreaField = ({ label, name, value, onChange, icon }) => (
    <div className="input-group">
        <label className="label">{label}</label>
        <div className="relative">
            {icon && <span className="icon-left">{icon}</span>}
            <textarea name={name} value={value} onChange={onChange} className="input" rows="3" required></textarea>
        </div>
    </div>
);

export default FullSignUp;
