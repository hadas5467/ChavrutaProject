-- DROP TABLE IF EXISTS CHAVRUTA;
-- DROP TABLE IF EXISTS JOIN_REQUESTS;
-- DROP TABLE IF EXISTS CallRecipients;
-- DROP TABLE IF EXISTS CALLS;
-- DROP TABLE IF EXISTS PASSWORDS;
-- DROP TABLE IF EXISTS USERS;


-- CREATE DATABASE IF NOT EXISTS chavruta_db;
-- USE chavruta_db;

-- CREATE TABLE USERS (
--     userId INT AUTO_INCREMENT PRIMARY KEY,
--     role ENUM('admin', 'user', 'moderator') DEFAULT 'user',
--     name VARCHAR(100) NOT NULL,
--     phone VARCHAR(20),
--     gmail VARCHAR(100) UNIQUE NOT NULL,
--     sex ENUM('male', 'female') NOT NULL,
--     age ENUM('18-25', '25-35', '35-45', '45-60', '60+'), 
--     sector ENUM('secular', 'traditional', 'religious', 'getting_stronger', 'baal_teshuva', 'haredi'), 
--     profile VARCHAR(255),   
--     contactMethod ENUM('email', 'whatsapp', 'sms', 'system'), 
--     city VARCHAR(100), 
--     country VARCHAR(100), 
--     languages VARCHAR(255), 
--     bio TEXT, 
--     createdAt DATETIME DEFAULT CURRENT_TIMESTAMP, 
--     lastLogin DATETIME DEFAULT NULL, 
--     experienceLevel ENUM('beginner', 'intermediate', 'advanced', 'expert') DEFAULT 'beginner', 
--     availability JSON, -- אובייקט JSON: ימים + שעות 
--     availabilityStatus ENUM('available_now', 'open_to_chavruta', 'open_to_lessons', 'not_available') DEFAULT 'available_now', 
--     tags VARCHAR(255) 
-- ); 

-- CREATE TABLE PASSWORDS ( 
--     userId INT PRIMARY KEY, 
--     passwordHash VARCHAR(255) NOT NULL, 
--     FOREIGN KEY (userId) REFERENCES USERS(userId) ON DELETE CASCADE 
-- ); 

-- CREATE TABLE CALLS ( 
--     callId INT AUTO_INCREMENT PRIMARY KEY, 
--     userId INT NOT NULL, 
--     targetUserId INT,
--     place VARCHAR(100),  -- מיקום פיזי (אם רלוונטי) 
--     learningFormat ENUM('zoom', 'phone', 'face_to_face', 'any'), 
--     time DATETIME, 
--     subject VARCHAR(100), 
--     ageRange ENUM('18-25', '25-35', '35-45', '45-60', '60+'), 
--     notes TEXT, 
--     preferredDuration ENUM('10-20_min', '30_min', '45_min', '1_hour', '1_hour+', 'flexible') NULL,
--     material VARCHAR(255),  -- תיאור חומר הלימוד 
--     createdAt DATETIME DEFAULT CURRENT_TIMESTAMP, 
--     isActive BOOLEAN DEFAULT TRUE, 
--     FOREIGN KEY (userId) REFERENCES USERS(userId) ON DELETE CASCADE 
-- ); 

-- CREATE TABLE JOIN_REQUESTS ( 
--     joinRequestId INT AUTO_INCREMENT PRIMARY KEY, 
--     callId INT NOT NULL, 
--     userId INT NOT NULL, 
--     targetUserId INT,
--     details TEXT, 
--     status ENUM('pending', 'approved', 'declined') DEFAULT 'pending', 
--     requestedAt DATETIME DEFAULT CURRENT_TIMESTAMP, 
--     FOREIGN KEY (callId) REFERENCES CALLS(callId) ON DELETE CASCADE, 
--     FOREIGN KEY (userId) REFERENCES USERS(userId) ON DELETE CASCADE 
-- ); 

-- CREATE TABLE CHAVRUTA ( 
--     chavrutaId INT AUTO_INCREMENT PRIMARY KEY, 
--     user1 INT NOT NULL, 
--     user2 INT NOT NULL, 
--     callId INT, 
--     startedAt DATETIME DEFAULT CURRENT_TIMESTAMP, 
--     status ENUM('active', 'ended', 'pending_start') DEFAULT 'active', 
--     notesUser1 TEXT, 
--     notesUser2 TEXT, 
--     FOREIGN KEY (user1) REFERENCES USERS(userId) ON DELETE CASCADE, 
--     FOREIGN KEY (user2) REFERENCES USERS(userId) ON DELETE CASCADE, 
--     FOREIGN KEY (callId) REFERENCES CALLS(callId) ON DELETE SET NULL 
-- ); 

-- CREATE TABLE CALL_RECIPIENTS  (
--     callId INT NOT NULL,
--     userId INT NOT NULL,
--     targetUserId INT NOT NULL,

--     PRIMARY KEY (callId, targetUserId),

--     FOREIGN KEY (callId) REFERENCES Calls(callId) ON DELETE CASCADE,
--     FOREIGN KEY (userId) REFERENCES Users(userId),
--     FOREIGN KEY (targetUserId) REFERENCES Users(userId)
-- );

-- -- הכנסת משתמשים
-- INSERT INTO USERS (
--   role, name, phone, gmail, sex, age, sector, profile, contactMethod,
--   city, country, languages, bio, experienceLevel, availability,
--   availabilityStatus, tags
-- ) VALUES
-- ('user', 'Tamar Levy', '0521111111', 'tamar@example.com', 'female', '25-35', 'religious',
--  '/profiles/tamar.jpg', 'whatsapp', 'Jerusalem', 'Israel', 'Hebrew,English',
--  'אוהבת ללמוד תנ\"ך לעומק', 'intermediate', '{"Sunday":["20:00-21:30"]}',
--  'open_to_chavruta', 'תנ\"ך, פרשת שבוע'),

-- ('moderator', 'Shlomi Cohen', '0502222222', 'shlomi@example.com', 'male', '35-45', 'haredi',
--  '/profiles/shlomi.jpg', 'system', 'Bnei Brak', 'Israel', 'Hebrew,Yiddish',
--  'מעביר שיעורים בגמרא והלכה', 'expert', '{"Monday":["19:00-21:00"]}',
--  'open_to_lessons', 'גמרא, הלכה'),

-- ('user', 'Maya Azulai', '0533333333', 'maya@example.com', 'female', '18-25', 'baal_teshuva',
--  '/profiles/maya.jpg', 'email', 'Haifa', 'Israel', 'Hebrew,English',
--  'מחפשת שותפה ללמידה באמונה', 'beginner', '{"Wednesday":["18:00-20:00"]}',
--  'available_now', 'אמונה, מוסר'),

-- ('admin', 'David Gold', '0544444444', 'admin@example.com', 'male', '45-60', 'religious',
--  '/profiles/david.jpg', 'sms', 'Tel Aviv', 'Israel', 'Hebrew,English',
--  'מנהל המערכת - לפניות טכניות', 'advanced', '{"Tuesday":["10:00-11:00"]}',
--  'not_available', 'ניהול, טכני');

-- -- הכנסת סיסמאות
-- INSERT INTO PASSWORDS (userId, passwordHash) VALUES
-- (1, 'hashedPass1'),
-- (2, 'hashedPass2'),
-- (3, 'hashedPass3'),
-- (4, 'hashedPass4');


-- -- הכנסת שיחות

-- INSERT INTO CALLS (
--   userId, place, learningFormat, time, subject, ageRange, notes,
--   preferredDuration, material
-- ) VALUES
-- (1, 'Zoom', 'zoom', '2025-07-01 20:00:00', 'תנ\"ך למתחילים', '25-35', 'לימוד פתוח', '1_hour', 'ספר שופטים'),
-- (2, 'כולל מרכזי', 'face_to_face', '2025-07-02 21:00:00', 'הלכה מתקדמת', '35-45', 'שיעור עמוק', '45_min', 'משנה ברורה'),
-- (3, NULL, 'phone', '2025-07-03 10:00:00', 'אמונה לנוער', '18-25', 'חיזוק באמונה', '30_min', 'שערי תשובה'),
-- (4, NULL, 'any', '2025-07-04 19:00:00', 'מבוא למערכת', '45-60', 'הסבר כללי', 'flexible', 'onboarding מצגת');


-- INSERT INTO JOIN_REQUESTS (callId, userId, details, status) VALUES
-- (1, 3, 'מעוניינת מאוד להצטרף', 'pending'),
-- (2, 1, 'רוצה ללמוד הלכה', 'approved'),
-- (3, 2, 'רוצה לחזק', 'approved'),
-- (4, 3, 'מבקשת הסבר ראשוני', 'declined');
 
-- -- חברותות קיימות
-- INSERT INTO CHAVRUTA (
--   user1, user2, callId, status, notesUser1, notesUser2
-- ) VALUES
-- (1, 3, 1, 'active', 'לומדות היטב', 'מאוד נהנית'),
-- (2, 1, 2, 'ended', 'סיימנו לימוד', 'היה מעשיר'),
-- (3, 2, 3, 'pending_start', '', ''),
-- (4, 3, 4, 'active', 'הצגה טכנית הושלמה', 'היה ברור');

-- INSERT INTO CALLS (
--   userId, place, learningFormat, time, subject, ageRange, notes,
--   preferredDuration, material
-- ) VALUES (
-- 10, 'רמות ב', 'zoom', '2025-07-05 20:30:00', 'לימודי מחשבה ומוסר', '18-25',
--   'לימוד פתוח לנשים בנושא מוסר ומחשבה יהודית', '1_hour', 'מסילת ישרים'
-- );


-- -- בדיקת טבלת חברותות
-- SELECT * FROM users;


DROP TABLE IF EXISTS CHAVRUTA;
DROP TABLE IF EXISTS JOIN_REQUESTS;
DROP TABLE IF EXISTS CALL_RECIPIENTS;
DROP TABLE IF EXISTS CALLS;
DROP TABLE IF EXISTS PASSWORDS;
DROP TABLE IF EXISTS USERS;

CREATE DATABASE IF NOT EXISTS chavruta_db;
USE chavruta_db;

CREATE TABLE USERS (
    userId INT AUTO_INCREMENT PRIMARY KEY,
    role ENUM('admin', 'user', 'moderator') DEFAULT 'user',
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    gmail VARCHAR(100) UNIQUE NOT NULL,
    sex ENUM('male', 'female') NOT NULL,
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
    availability JSON, 
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
    targetUserId INT,
    place VARCHAR(100),  
    learningFormat ENUM('zoom', 'phone', 'face_to_face', 'any'), 
    time DATETIME, 
    subject VARCHAR(100), 
    ageRange ENUM('18-25', '25-35', '35-45', '45-60', '60+'), 
    notes TEXT, 
    preferredDuration ENUM('10-20_min', '30_min', '45_min', '1_hour', '1_hour+', 'flexible') NULL,
    material VARCHAR(255),  
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP, 
    isActive BOOLEAN DEFAULT TRUE, 
    FOREIGN KEY (userId) REFERENCES USERS(userId) ON DELETE CASCADE 
); 

CREATE TABLE JOIN_REQUESTS ( 
    joinRequestId INT AUTO_INCREMENT PRIMARY KEY, 
    callId INT NOT NULL, 
    userId INT NOT NULL, 
    targetUserId INT,
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
    status ENUM('active', 'ended', 'pending_start') DEFAULT 'active', 
    notesUser1 TEXT, 
    notesUser2 TEXT, 
    FOREIGN KEY (user1) REFERENCES USERS(userId) ON DELETE CASCADE, 
    FOREIGN KEY (user2) REFERENCES USERS(userId) ON DELETE CASCADE, 
    FOREIGN KEY (callId) REFERENCES CALLS(callId) ON DELETE SET NULL 
); 

CREATE TABLE CALL_RECIPIENTS (
    callId INT NOT NULL,
    userId INT NOT NULL,
    targetUserId INT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (callId, targetUserId),
    FOREIGN KEY (callId) REFERENCES CALLS(callId) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES USERS(userId),
    FOREIGN KEY (targetUserId) REFERENCES USERS(userId)
);

-- הכנסת משתמשים
INSERT INTO USERS (
  role, name, phone, gmail, sex, age, sector, profile, contactMethod,
  city, country, languages, bio, experienceLevel, availability,
  availabilityStatus, tags
) VALUES
('user', 'Tamar Levy', '0521111111', 'tamar@example.com', 'female', '25-35', 'religious',
 '/profiles/tamar.jpg', 'whatsapp', 'Jerusalem', 'Israel', 'Hebrew,English',
 'אוהבת ללמוד תנ\"ך לעומק', 'intermediate', '{"Sunday":["20:00-21:30"]}',
 'open_to_chavruta', 'תנ\"ך, פרשת שבוע'),

('moderator', 'Shlomi Cohen', '0502222222', 'shlomi@example.com', 'male', '35-45', 'haredi',
 '/profiles/shlomi.jpg', 'system', 'Bnei Brak', 'Israel', 'Hebrew,Yiddish',
 'מעביר שיעורים בגמרא והלכה', 'expert', '{"Monday":["19:00-21:00"]}',
 'open_to_lessons', 'גמרא, הלכה'),

('user', 'Maya Azulai', '0533333333', 'maya@example.com', 'female', '18-25', 'baal_teshuva',
 '/profiles/maya.jpg', 'email', 'Haifa', 'Israel', 'Hebrew,English',
 'מחפשת שותפה ללמידה באמונה', 'beginner', '{"Wednesday":["18:00-20:00"]}',
 'available_now', 'אמונה, מוסר'),

('admin', 'David Gold', '0544444444', 'admin@example.com', 'male', '45-60', 'religious',
 '/profiles/david.jpg', 'sms', 'Tel Aviv', 'Israel', 'Hebrew,English',
 'מנהל המערכת - לפניות טכניות', 'advanced', '{"Tuesday":["10:00-11:00"]}',
 'not_available', 'ניהול, טכני');

-- הכנסת סיסמאות
INSERT INTO PASSWORDS (userId, passwordHash) VALUES
(1, 'hashedPass1'),
(2, 'hashedPass2'),
(3, 'hashedPass3'),
(4, 'hashedPass4');

-- הכנסת שיחות
INSERT INTO CALLS (
  userId, targetUserId, place, learningFormat, time, subject, ageRange, notes,
  preferredDuration, material
) VALUES
(1, NULL, 'Zoom', 'zoom', '2025-07-01 20:00:00', 'תנ\"ך למתחילים', '25-35', 'לימוד פתוח', '1_hour', 'ספר שופטים'),
(2, NULL, 'כולל מרכזי', 'face_to_face', '2025-07-02 21:00:00', 'הלכה מתקדמת', '35-45', 'שיעור עמוק', '45_min', 'משנה ברורה'),
(3, NULL, NULL, 'phone', '2025-07-03 10:00:00', 'אמונה לנוער', '18-25', 'חיזוק באמונה', '30_min', 'שערי תשובה'),
(4, NULL, NULL, 'any', '2025-07-04 19:00:00', 'מבוא למערכת', '45-60', 'הסבר כללי', 'flexible', 'onboarding מצגת'),
(1, NULL, 'רמות ב', 'zoom', '2025-07-05 20:30:00', 'לימודי מחשבה ומוסר', '18-25', 'לימוד פתוח לנשים בנושא מוסר ומחשבה יהודית', '1_hour', 'מסילת ישרים');

-- בקשות הצטרפות
INSERT INTO JOIN_REQUESTS (callId, userId, targetUserId, details, status) VALUES
(1, 3, 1, 'מעוניינת מאוד להצטרף', 'pending'),
(2, 1, 2, 'רוצה ללמוד הלכה', 'approved'),
(3, 2, 3, 'רוצה לחזק', 'approved'),
(4, 3, 4, 'מבקשת הסבר ראשוני', 'declined');

-- חברותות
INSERT INTO CHAVRUTA (
  user1, user2, callId, status, notesUser1, notesUser2
) VALUES
(1, 3, 1, 'active', 'לומדות היטב', 'מאוד נהנית'),
(2, 1, 2, 'ended', 'סיימנו לימוד', 'היה מעשיר'),
(3, 2, 3, 'pending_start', '', ''),
(4, 3, 4, 'active', 'הצגה טכנית הושלמה', 'היה ברור');

-- בדיקה
SELECT * FROM USERS;
