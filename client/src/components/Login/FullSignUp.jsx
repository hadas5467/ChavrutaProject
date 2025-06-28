import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Phone, Calendar, Mail, User, Globe, MapPin, Book, MessageSquare, Image as ImageIcon } from 'lucide-react';
import { addData } from '../apiService';
import { fullSignUpSchema } from '../../Schema/FullSignUp'; // הוסיפי למעלה
import { age, sector, contactMethod, experienceLevel, availabilityStatus, topicMap } from '../formatHelpers';
import '../../css/SignupFull.css';

const steps = ['פרטים', 'זמינות', 'תגיות', 'אישור'];
const days = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'שבת'];
const times = ['בוקר', 'צהריים', 'ערב', 'לילה'];
const defaultTags = Object.keys(topicMap);

const FullSignUp = () => {
    const [step, setStep] = useState(0);
    const navigate = useNavigate();
    const location = useLocation();

    const [formData, setFormData] = useState({
        name: location.state?.name || '',
        gmail: location.state?.gmail || '',
        password: location.state?.password || '',
        sex: location.state?.sex || '',
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
        availability: { mode: 'all', customDays: [], customTimes: [], customRange: null },
        tags: [],
        profile: null
    });

    const [customTag, setCustomTag] = useState('');

    useEffect(() => {
        if (!location.state) navigate('/signup');
    }, [location.state, navigate]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleAvailabilityChange = (key, value) => {
        setFormData(prev => ({
            ...prev,
            availability: {
                ...prev.availability,
                [key]: value
            }
        }));
    };

    const handleLanguagesChange = (e) => {
        const { value, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            languages: checked ? [...prev.languages, value] : prev.languages.filter(l => l !== value)
        }));
    };

    const handleNextStep = () => {
        let stepSchema;

        if (step === 0) {
            stepSchema = fullSignUpSchema.pick({
                phone: true,
                age: true,
                sector: true,
                contactMethod: true,
                city: true,
                country: true,
                languages: true,
                bio: true,
                experienceLevel: true,
            });
        }

        if (step === 1) {
            stepSchema = fullSignUpSchema.pick({
                availabilityStatus: true,
            });
        }

        if (step === 2) {
            stepSchema = fullSignUpSchema.pick({
                tags: true,
            });
        }

        if (stepSchema) {
            const result = stepSchema.safeParse(formData);
            if (!result.success) {
                const message = result.error.errors[0]?.message || 'יש למלא את כל הפרטים הנדרשים';
                alert(message);
                return;
            }
        }

        setStep(prev => prev + 1);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationResult = fullSignUpSchema.safeParse(formData);
        if (!validationResult.success) {
            const message = validationResult.error.errors[0]?.message || 'שגיאה בפרטים';
            alert(message);
            return;
        }




        try {
            const form = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (key === 'tags') {
                    form.append('tags', value.join(','));
                } else if (key === 'languages') {
                    form.append('languages', value.join(','));
                } else if (key === 'availability') {
                    form.append('availability', JSON.stringify(value));
                } else if (key === 'profile' && value && typeof value !== 'string') {
                    form.append('profile', value);
                } else if (key !== 'profile') {
                    form.append(key, value);
                }
            });
            const result = await addData('users/register', form, true);
            if (result?.user) {
                localStorage.setItem('currentUser', JSON.stringify(result.user));
                navigate('/home');
            }
        } catch (error) {
            // בדיקת שגיאת מייל קיים
            if (
                error?.response?.data?.message === "האימייל כבר רשום במערכת. אנא נסה אימייל אחר או התחבר." ||
                error?.message === "האימייל כבר רשום במערכת. אנא נסה אימייל אחר או התחבר."
            ) {
                navigate('/login');
            } else {
                alert("האימייל כבר רשום במערכת. אנא נסה אימייל אחר או התחבר.");
            }
        }
    };
    return (
        <form className="signup-form" onSubmit={handleSubmit}>
            <div className="stepper">
                {steps.map((label, idx) => (
                    <span key={idx} className={step === idx ? 'active' : ''}>{label}</span>
                ))}
            </div>

            {step === 0 && (
                <>
                    <InputField label="טלפון" name="phone" icon={<Phone />} value={formData.phone} onChange={e => handleChange('phone', e.target.value)} />
                    <SelectField label="גיל" name="age" value={formData.age} onChange={e => handleChange('age', e.target.value)} options={age} />
                    <SelectField label="מגזר" name="sector" value={formData.sector} onChange={e => handleChange('sector', e.target.value)} options={sector} />
                    <SelectField label="אמצעי קשר" name="contactMethod" value={formData.contactMethod} onChange={e => handleChange('contactMethod', e.target.value)} options={contactMethod} />
                    <InputField label="עיר" name="city" icon={<MapPin />} value={formData.city} onChange={e => handleChange('city', e.target.value)} />
                    <InputField label="מדינה" name="country" icon={<Globe />} value={formData.country} onChange={e => handleChange('country', e.target.value)} />
                    <div className="input-group">
                        <label className="label">שפות מדוברות</label>
                        <div className="language-checkboxes">
                            {['עברית', 'אנגלית', 'צרפתית', 'ספרדית', 'רוסית'].map(lang => (
                                <label key={lang} className="checkbox-label">
                                    <input type="checkbox" value={lang} onChange={handleLanguagesChange} checked={formData.languages.includes(lang)} />
                                    {lang}
                                </label>
                            ))}
                        </div>
                    </div>
                    <TextAreaField label="ביוגרפיה" name="bio" icon={<MessageSquare />} value={formData.bio} onChange={e => handleChange('bio', e.target.value)} />
                    <SelectField label="רמת ניסיון" name="experienceLevel" value={formData.experienceLevel} onChange={e => handleChange('experienceLevel', e.target.value)} options={experienceLevel} />
                    <div className="input-group">
                        <label className="label">העלאת תמונת פרופיל</label>
                        <input type="file" accept="image/*" onChange={e => handleChange('profile', e.target.files[0])} />
                        {formData.profile && typeof formData.profile !== 'string' && (
                            <img src={URL.createObjectURL(formData.profile)} alt="תמונה" style={{ maxWidth: 120, borderRadius: '50%' }} />
                        )}
                    </div>
                </>
            )}

            {step === 1 && (
                <>
                    <SelectField label="סטטוס זמינות" name="availabilityStatus" value={formData.availabilityStatus} onChange={e => handleChange('availabilityStatus', e.target.value)} options={availabilityStatus} />
                    <div className="input-group">
                        <label>זמינות:</label>
                        <label><input type="radio" checked={formData.availability.mode === 'all'} onChange={() => handleAvailabilityChange('mode', 'all')} /> כל הימים וכל השעות</label>
                        <label><input type="radio" checked={formData.availability.mode === 'custom'} onChange={() => handleAvailabilityChange('mode', 'custom')} /> התאמה אישית</label>
                        {formData.availability.mode === 'custom' && (
                            <>
                                <div>
                                    <span>ימים:</span>
                                    {days.map(day => (
                                        <label key={day}><input type="checkbox" checked={formData.availability.customDays.includes(day)} onChange={e => {
                                            const newDays = e.target.checked
                                                ? [...formData.availability.customDays, day]
                                                : formData.availability.customDays.filter(d => d !== day);
                                            handleAvailabilityChange('customDays', newDays);
                                        }} /> {day}</label>
                                    ))}
                                </div>
                                <div>
                                    <span>שעות:</span>
                                    {times.map(time => (
                                        <label key={time}><input type="checkbox" checked={formData.availability.customTimes.includes(time)} onChange={e => {
                                            const newTimes = e.target.checked
                                                ? [...formData.availability.customTimes, time]
                                                : formData.availability.customTimes.filter(t => t !== time);
                                            handleAvailabilityChange('customTimes', newTimes);
                                        }} /> {time}</label>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </>
            )}

            {step === 2 && (
                <div className="tags-section">
                    <label>תגיות:</label>
                    <div className="tags-list">
                        {defaultTags.map(tag => (
                            <button key={tag} type="button" className={formData.tags.includes(tag) ? 'selected' : ''} onClick={() => {
                                handleChange('tags', formData.tags.includes(tag) ? formData.tags.filter(t => t !== tag) : [...formData.tags, tag]);
                            }}>{topicMap[tag]}</button>
                        ))}
                    </div>
                    <input placeholder="תגית חדשה" value={customTag} onChange={e => setCustomTag(e.target.value)} onKeyDown={e => {
                        if (e.key === 'Enter' && customTag) {
                            handleChange('tags', [...formData.tags, customTag]);
                            setCustomTag('');
                        }
                    }} />
                </div>
            )}

            {step === 3 && (
                <div className="preview">
                    <h3>אישור נתונים</h3>
                    <p><b>שם:</b> {formData.name}</p>
                    <p><b>מייל:</b> {formData.gmail}</p>
                    <p><b>מגדר:</b> {formData.sex === 'male' ? 'זכר' : 'נקבה'}</p>
                    <p><b>מגזר:</b> {sector[formData.sector]}</p>
                    <p><b>תגיות:</b> {formData.tags.map(t => topicMap[t] || t).join(', ')}</p>
                    {formData.profile && typeof formData.profile !== 'string' && (
                        <img src={URL.createObjectURL(formData.profile)} alt="תמונה" style={{ maxWidth: 120, borderRadius: '50%' }} />
                    )}
                </div>
            )}

            <div className="signup-actions">
                {step > 0 && <button type="button" onClick={() => setStep(prev => prev - 1)}>הקודם</button>}
                {/* {step < steps.length - 1 && <button type="button" onClick={() => setStep(prev => prev + 1)}>הבא</button>} */}
                {step < steps.length - 1 && <button type="button" onClick={handleNextStep}>הבא</button>}
                {step === steps.length - 1 && <button type="submit">סיום</button>}
            </div>
        </form>
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
