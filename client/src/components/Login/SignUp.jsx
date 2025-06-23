// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// // import { useAuth } from '../context/AuthContext';
// import { UserPlus, User, Mail, Lock, Phone, Calendar, Eye, EyeOff } from 'lucide-react';
// import {
//     languageMap,
//     genderMap,
//     methodMap,
// } from '../formatHelpers'
// import '../../css/Signup.css'

// const SignUp = () => {
//     const [formData, setFormData] = useState({
//         fullName: '',
//         phoneNumber: '',
//         email: '',
//         password: '',
//         age: '',
//         sector: '',
//         preferredContact: '',
//         languages: [],
//     });

//     const [showPassword, setShowPassword] = useState(false);
//     const [error, setError] = useState('');
//     const [loading, setLoading] = useState(false);
//     //const { signup } = useAuth();
//     const navigate = useNavigate();

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prev) => ({
//             ...prev,
//             [name]: value,
//         }));
//     };

//     const handleLanguagesChange = (e) => {
//         const selectedOptions = Array.from(e.target.selectedOptions, (opt) => opt.value);
//         setFormData((prev) => ({
//             ...prev,
//             languages: selectedOptions,
//         }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setError('');
//         try {
//             //  await signup(formData);
//             navigate('/');
//         } catch (err) {
//             setError('שגיאה בהרשמה. אנא נסה שוב.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="signup-wrapper">
//             <div className="signup-container">
//                 <div className="signup-box">
//                     <div className="signup-header">
//                         <div className="signup-icon">
//                             <UserPlus className="icon" />
//                         </div>
//                         <h1 className="signup-title">הרשמה</h1>
//                         <p className="signup-subtitle">צור חשבון חדש</p>
//                     </div>

//                     {error && <div className="signup-error">{error}</div>}

//                     <form onSubmit={handleSubmit} className="signup-form">
//                         <InputField
//                             icon={<User />}
//                             id="fullName"
//                             name="fullName"
//                             label="שם מלא"
//                             type="text"
//                             value={formData.fullName}
//                             onChange={handleInputChange}
//                         />
//                         <InputField
//                             icon={<Phone />}
//                             id="phoneNumber"
//                             name="phoneNumber"
//                             label="מספר טלפון"
//                             type="tel"
//                             value={formData.phoneNumber}
//                             onChange={handleInputChange}
//                         />
//                         <InputField
//                             icon={<Mail />}
//                             id="email"
//                             name="email"
//                             label="כתובת מייל"
//                             type="email"
//                             value={formData.email}
//                             onChange={handleInputChange}
//                         />
//                         <PasswordField
//                             showPassword={showPassword}
//                             setShowPassword={setShowPassword}
//                             value={formData.password}
//                             onChange={handleInputChange}
//                         />
//                         <InputField
//                             icon={<Calendar />}
//                             id="age"
//                             name="age"
//                             label="גיל"
//                             type="number"
//                             value={formData.age}
//                             onChange={handleInputChange}
//                         />

//                         <SelectField
//                             id="sector"
//                             name="sector"
//                             label="סקטור"
//                             value={formData.sector}
//                             onChange={handleInputChange}
//                             options={genderMap}
//                         />

//                         <SelectField
//                             id="preferredContact"
//                             name="preferredContact"
//                             label="אמצעי התקשרות מועדף"
//                             value={formData.preferredContact}
//                             onChange={handleInputChange}
//                             options={methodMap}
//                         />

//                         {/* <div>
//             <label htmlFor="languages" className="label">
//               שפות
//             </label>
//             <select
//               id="languages"
//               name="languages"
//               multiple
//               value={formData.languages}
//               onChange={handleLanguagesChange}
//               className="input"
//             >
//               {Object.entries(languageMap).map(([key, label]) => (
//                 <option key={key} value={key}>
//                   {label}
//                 </option>
//               ))}
//             </select>
//           </div> */}
//                         <div>
//                             <label className="label">שפות</label>
//                             <div className="language-checkboxes">
//                                 {Object.entries(languageMap).map(([key, label]) => (
//                                     <label key={key} className="checkbox-label">
//                                         <input
//                                             type="checkbox"
//                                             value={key}
//                                             checked={formData.languages.includes(key)}
//                                             onChange={(e) => {
//                                                 const checked = e.target.checked;
//                                                 setFormData((prev) => {
//                                                     const languages = checked
//                                                         ? [...prev.languages, key]
//                                                         : prev.languages.filter((lang) => lang !== key);
//                                                     return { ...prev, languages };
//                                                 });
//                                             }}
//                                         />
//                                         {label}
//                                     </label>
//                                 ))}
//                             </div>
//                         </div>

//                         <button
//                             type="submit"
//                             disabled={loading}
//                             className="signup-button"
//                         >
//                             {loading ? (
//                                 <div className="spinner"></div>
//                             ) : (
//                                 <>
//                                     <UserPlus className="button-icon" />
//                                     הרשם
//                                 </>
//                             )}
//                         </button>
//                     </form>

//                     <div className="signup-footer">
//                         <p>
//                             כבר יש לך חשבון?{' '}
//                             <Link to="/login" className="login-link">
//                                 התחבר כאן
//                             </Link>
//                         </p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// const InputField = ({ icon, id, name, label, type, value, onChange }) => (
//     <div>
//         <label htmlFor={id} className="label">
//             {label}
//         </label>
//         <div className="relative">
//             <span className="icon-left">{icon}</span>
//             <input
//                 id={id}
//                 name={name}
//                 type={type}
//                 value={value}
//                 onChange={onChange}
//                 required
//                 className="input"
//             />
//         </div>
//     </div>
// );

// const PasswordField = ({
//     showPassword,
//     setShowPassword,
//     value,
//     onChange,
// }) => (
//     <div>
//         <label htmlFor="password" className="label">
//             סיסמה
//         </label>
//         <div className="relative">
//             <Lock className="icon-left" />
//             <input
//                 id="password"
//                 name="password"
//                 type={showPassword ? 'text' : 'password'}
//                 value={value}
//                 onChange={onChange}
//                 required
//                 className="input password-input"
//             />
//             <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="toggle-password"
//             >
//                 {showPassword ? <EyeOff /> : <Eye />}
//             </button>
//         </div>
//     </div>
// );

// const SelectField = ({ id, name, label, value, onChange, options }) => (
//     <div>
//         <label htmlFor={id} className="label">
//             {label}
//         </label>
//         <select
//             id={id}
//             name={name}
//             value={value}
//             onChange={onChange}
//             required
//             className="input"
//         >
//             <option value="">בחר</option>
//             {Object.entries(options).map(([key, label]) => (
//                 <option key={key} value={key}>
//                     {label}
//                 </option>
//             ))}
//         </select>
//     </div>
// );

// export default SignUp;


import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
import { addData } from '../apiService.js'
import { UserPlus, User, Mail, Lock, Phone, Calendar, Eye, EyeOff } from 'lucide-react';
import {
    languageMap,
    genderMap,
    methodMap,
} from '../formatHelpers'
import '../../css/Signup.css'

const SignUp = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
        email: '',
        password: '',
        age: '',
        sector: '',
        preferredContact: '',
        languages: [],
    });

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    //const { signup } = useAuth();
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleLanguagesChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions, (opt) => opt.value);
        setFormData((prev) => ({
            ...prev,
            languages: selectedOptions,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const result = await addData("users/register",formData);

            navigate('/');
        } catch (err) {
             console.error("Signup error:", err);
            setError('שגיאה בהרשמה. אנא נסה שוב.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-wrapper">
            <div className="signup-container">
                <div className="signup-box">
                    <div className="signup-header">
                        <div className="signup-icon">
                            <UserPlus className="icon" />
                        </div>
                        <h1 className="signup-title">הרשמה</h1>
                        <p className="signup-subtitle">צור חשבון חדש</p>
                    </div>

                    {error && <div className="signup-error">{error}</div>}

                    <form onSubmit={handleSubmit} className="signup-form">
                        <InputField
                            icon={<User />}
                            id="fullName"
                            name="fullName"
                            label="שם מלא"
                            type="text"
                            value={formData.fullName}
                            onChange={handleInputChange}
                        />
                        <InputField
                            icon={<Phone />}
                            id="phoneNumber"
                            name="phoneNumber"
                            label="מספר טלפון"
                            type="tel"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                        />
                        <InputField
                            icon={<Mail />}
                            id="email"
                            name="email"
                            label="כתובת מייל"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                        />
                        <PasswordField
                            showPassword={showPassword}
                            setShowPassword={setShowPassword}
                            value={formData.password}
                            onChange={handleInputChange}
                        />
                        <InputField
                            icon={<Calendar />}
                            id="age"
                            name="age"
                            label="גיל"
                            type="number"
                            value={formData.age}
                            onChange={handleInputChange}
                        />

                        <SelectField
                            id="sector"
                            name="sector"
                            label="סקטור"
                            value={formData.sector}
                            onChange={handleInputChange}
                            options={genderMap}
                        />

                        <SelectField
                            id="preferredContact"
                            name="preferredContact"
                            label="אמצעי התקשרות מועדף"
                            value={formData.preferredContact}
                            onChange={handleInputChange}
                            options={methodMap}
                        />

                        {/* <div>
            <label htmlFor="languages" className="label">
              שפות
            </label>
            <select
              id="languages"
              name="languages"
              multiple
              value={formData.languages}
              onChange={handleLanguagesChange}
              className="input"
            >
              {Object.entries(languageMap).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div> */}
                        <div>
                            <label className="label">שפות</label>
                            <div className="language-checkboxes">
                                {Object.entries(languageMap).map(([key, label]) => (
                                    <label key={key} className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            value={key}
                                            checked={formData.languages.includes(key)}
                                            onChange={(e) => {
                                                const checked = e.target.checked;
                                                setFormData((prev) => {
                                                    const languages = checked
                                                        ? [...prev.languages, key]
                                                        : prev.languages.filter((lang) => lang !== key);
                                                    return { ...prev, languages };
                                                });
                                            }}
                                        />
                                        {label}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="signup-button"
                        >
                            {loading ? (
                                <div className="spinner"></div>
                            ) : (
                                <>
                                    <UserPlus className="button-icon" />
                                    הרשם
                                </>
                            )}
                        </button>
                    </form>

                    <div className="signup-footer">
                        <p>
                            כבר יש לך חשבון?{' '}
                            <Link to="/login" className="login-link">
                                התחבר כאן
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const InputField = ({ icon, id, name, label, type, value, onChange }) => (
    <div>
        <label htmlFor={id} className="label">
            {label}
        </label>
        <div className="relative">
            <span className="icon-left">{icon}</span>
            <input
                id={id}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                required
                className="input"
            />
        </div>
    </div>
);

const PasswordField = ({
    showPassword,
    setShowPassword,
    value,
    onChange,
}) => (
    <div>
        <label htmlFor="password" className="label">
            סיסמה
        </label>
        <div className="relative">
            <Lock className="icon-left" />
            <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={value}
                onChange={onChange}
                required
                className="input password-input"
            />
            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="toggle-password"
            >
                {showPassword ? <EyeOff /> : <Eye />}
            </button>
        </div>
    </div>
);

const SelectField = ({ id, name, label, value, onChange, options }) => (
    <div>
        <label htmlFor={id} className="label">
            {label}
        </label>
        <select
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            required
            className="input"
        >
            <option value="">בחר</option>
            {Object.entries(options).map(([key, label]) => (
                <option key={key} value={key}>
                    {label}
                </option>
            ))}
        </select>
    </div>
);

export default SignUp;