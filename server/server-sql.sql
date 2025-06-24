-- DROP TABLE IF EXISTS CHAVRUTA;
-- DROP TABLE IF EXISTS JOIN_REQUESTS;
-- DROP TABLE IF EXISTS CALLS;
-- DROP TABLE IF EXISTS PASSWORDS;
-- DROP TABLE IF EXISTS USERS;

CREATE DATABASE IF NOT EXISTS chavruta_db;
USE chavruta_db;

CREATE TABLE USERS (
    userId INT AUTO_INCREMENT PRIMARY KEY,
    role ENUM('admin', 'user', 'moderator') DEFAULT 'user',
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    gmail VARCHAR(100) UNIQUE NOT NULL,
    age ENUM('18-25', '25-35', '35-45', '45-60', '60+'), 
    sector ENUM('secular', 'traditional', 'religious', 'getting_stronger', 'baal_teshuva', 'haredi'), 
    profile VARCHAR(255),   
    contactMethod ENUM('email', 'whatsapp', 'sms', 'system'), 
    city VARCHAR(100), 
    country VARCHAR(100), 
    languages VARCHAR(255), 
    bio TEXT, 
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP, 
    lastLogin DATETIME DEFAULT NULL, 
    experienceLevel ENUM('beginner', 'intermediate', 'advanced', 'expert') DEFAULT 'beginner', 
    availability JSON, -- אובייקט JSON: ימים + שעות 
    availabilityStatus ENUM('available_now', 'open_to_chavruta', 'open_to_lessons', 'not_available') DEFAULT 'available_now', 
    tags VARCHAR(255) 
); 

CREATE TABLE PASSWORDS ( 
    userId INT PRIMARY KEY, 
    passwordHash VARCHAR(255) NOT NULL, 
    FOREIGN KEY (userId) REFERENCES USERS(userId) ON DELETE CASCADE 
); 

CREATE TABLE CALLS ( 
    callId INT AUTO_INCREMENT PRIMARY KEY, 
    userId INT NOT NULL, 
    place VARCHAR(100),  -- מיקום פיזי (אם רלוונטי) 
    learningFormat ENUM('zoom', 'phone', 'face_to_face', 'any'), 
    time DATETIME, 
    subject VARCHAR(100), 
    ageRange ENUM('18-25', '25-35', '35-45', '45-60', '60+'), 
    notes TEXT, 
    preferredDuration ENUM('10-20_min', '30_min', '45_min', '1_hour', '1_hour+', 'flexible') NULL,
    material VARCHAR(255),  -- תיאור חומר הלימוד 
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP, 
    isActive BOOLEAN DEFAULT TRUE, 
    FOREIGN KEY (userId) REFERENCES USERS(userId) ON DELETE CASCADE 
); 

CREATE TABLE JOIN_REQUESTS ( 
    joinRequestId INT AUTO_INCREMENT PRIMARY KEY, 
    callId INT NOT NULL, 
    userId INT NOT NULL, 
    details TEXT, 
    status ENUM('pending', 'approved', 'declined') DEFAULT 'pending', 
    requestedAt DATETIME DEFAULT CURRENT_TIMESTAMP, 
    FOREIGN KEY (callId) REFERENCES CALLS(callId) ON DELETE CASCADE, 
    FOREIGN KEY (userId) REFERENCES USERS(userId) ON DELETE CASCADE 
); 

CREATE TABLE CHAVRUTA ( 
    chavrutaId INT AUTO_INCREMENT PRIMARY KEY, 
    user1 INT NOT NULL, 
    user2 INT NOT NULL, 
    callId INT, 
    startedAt DATETIME DEFAULT CURRENT_TIMESTAMP, 
    status ENUM('active', 'ended', 'paused') DEFAULT 'active', 
    notesUser1 TEXT, 
    notesUser2 TEXT, 
    FOREIGN KEY (user1) REFERENCES USERS(userId) ON DELETE CASCADE, 
    FOREIGN KEY (user2) REFERENCES USERS(userId) ON DELETE CASCADE, 
    FOREIGN KEY (callId) REFERENCES CALLS(callId) ON DELETE SET NULL 
); 

-- הכנסת משתמשים
INSERT INTO USERS (
    role, name, phone, gmail, age, sector, profile, contactMethod, city, country, languages, bio, experienceLevel, availability, availabilityStatus, tags
) VALUES 
('user', 'Yael Cohen', '0521234567', 'yael@example.com', '25-35', 'traditional', '/profiles/yael.jpg', 'whatsapp', 'Jerusalem', 'Israel', 'Hebrew,English', 'מחפשת חברותא ללימוד תנ\"ך', 'intermediate', 
 '{"Sunday": ["09:00-11:00"], "Tuesday": ["19:00-21:00"]}', 'open_to_chavruta', 'תנ\"ך, נשים, הלכה'),

('moderator', 'David Levi', '0507654321', 'davidl@example.com', '35-45', 'haredi', '/profiles/david.jpg', 'system', 'Bnei Brak', 'Israel', 'Hebrew', 'מלמד בכולל, פתוח להעברת שיעורים', 'expert',
 '{"Monday": ["20:00-22:00"], "Thursday": ["20:00-21:30"]}', 'open_to_lessons', 'הלכה, גמרא'),

('user', 'Sarah Ben Harush', NULL, 'sarahb@example.com', '18-25', 'baal_teshuva', NULL, 'email', 'Haifa', 'Israel', 'Hebrew,English,Spanish', 'מתחזקת ומחפשת שותפה ללמידה', 'beginner',
 '{"Friday": ["10:00-12:00"]}', 'available_now', 'תשובה, אמונה'),

('admin', 'Avi Gold', '0530000000', 'avig@example.com', '45-60', 'religious', '/profiles/avi.jpg', 'sms', 'Tel Aviv', 'Israel', 'Hebrew,English,French', 'מנהל האתר, זמין לפניות מנהליות בלבד', 'advanced',
 '{"Wednesday": ["18:00-20:00"]}', 'not_available', 'מנהל');

-- הכנסת סיסמאות
INSERT INTO PASSWORDS (userId, passwordHash)
VALUES
(1, '$2b$10$examplehash1'),
(2, '$2b$10$examplehash2'),
(3, '$2b$10$examplehash3'),
(4, '$2b$10$examplehash4');

-- הכנסת שיחות

INSERT INTO JOIN_REQUESTS (callId, userId, details, status)
VALUES
(1, 3, 'מאד רוצה להצטרף לתנ\"ך, נראית לי קבוצת למידה טובה', 'pending'),
(2, 1, 'מעוניינת ללמוד גמרא עם רב מנוסה', 'approved'),
(3, 2, 'רוצה לדבר עם הבת תשובה ולהדריך אותה', 'approved'),
(4, 3, 'מעוניינת בהדרכה על המערכת', 'declined');

-- חברותות קיימות
INSERT INTO CHAVRUTA (user1, user2, callId, status, notesUser1, notesUser2)
VALUES
(1, 3, 1, 'active', 'שיתוף טוב, נמשיך בע\"ז', 'תענוג ללמוד איתה!'),
(2, 1, 2, 'ended', 'סיימנו מחזור מסכת ברכות', 'למדתי המון'),
(3, 2, 3, 'paused', 'בהפסקה עקב חופשה', 'נמשיך בע\"ז בספטמבר'),
(4, 3, 4, 'active', 'הדרכה ראשונית הסתיימה', 'היה מאוד עוזר');

-- בדיקת טבלת חברותות
SELECT * FROM CHAVRUTA;
