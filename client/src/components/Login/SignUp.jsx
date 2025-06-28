import React, { useState, useEffect } from 'react';
import {Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { signUpSchema } from '../../Schema/signUpSchema';
import '../../css/Signup.css';

const SignUp = () => {
  useEffect(() => {
    localStorage.removeItem('currentUser');
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    gmail: '',
    password: '',
    sex: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = signUpSchema.safeParse(formData);
    if (!result.success) {
      const message = result.error.errors[0]?.message || 'שגיאה בפרטים';
      alert(message);
      return;
    }

    navigate('/fullSignUp', { state: formData });
  };

  return (
    <div className="signup-wrapper">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>הרשמה למערכת</h2>

        <InputField
          label="שם מלא"
          name="name"
          icon={<User />}
          type="text"
          value={formData.name}
          onChange={handleInputChange}
        />

        <InputField
          label="כתובת מייל"
          name="gmail"
          icon={<Mail />}
          type="email"
          value={formData.gmail}
          onChange={handleInputChange}
        />

        <InputField
          label="מין"
          name="sex"
          type="select"
          value={formData.sex}
          onChange={handleInputChange}
          options={[
            { value: '', label: 'בחר' },
            { value: 'male', label: 'זכר' },
            { value: 'female', label: 'נקבה' },
          ]}
        />

        <PasswordField
          value={formData.password}
          onChange={handleInputChange}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
        />

        <button type="submit" className="signup-button">
          המשך לשלב הבא
        </button>
      </form>
    </div>
  );
};

const InputField = ({ label, name, type, value, onChange, icon, options }) => (
  <div className="input-group">
    <label className="label">{label}</label>
    <div className="relative">
      {icon && <span className="icon-left">{icon}</span>}
      {type === 'select' ? (
        <select name={name} value={value} onChange={onChange} className="input" required>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className="input"
          required
        />
      )}
    </div>
  </div>
);

const PasswordField = ({ value, onChange, showPassword, setShowPassword }) => (
  <div className="input-group">
    <label className="label">סיסמה</label>
    <div className="relative">
      <Lock className="icon-left" />
      <input
        type={showPassword ? 'text' : 'password'}
        name="password"
        value={value}
        onChange={onChange}
        className="input password-input"
        required
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="toggle-password"
      >
        {showPassword ? <EyeOff /> : <Eye />}
      </button>
    </div>
     <div className="signup-text">
          <p>
            יש לך חשבון?{' '}
            <Link to="/login" className="signup-link">
              התחבר כאן
            </Link>
          </p>
        </div>
  </div>
);

export default SignUp;
