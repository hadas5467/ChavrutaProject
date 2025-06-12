<<<<<<< HEAD
-- DROP TABLE IF EXISTS CHAVRUTA;
-- DROP TABLE IF EXISTS JOIN_REQUESTS;
-- DROP TABLE IF EXISTS CALLS;
-- DROP TABLE IF EXISTS PASSWORDS;
-- DROP TABLE IF EXISTS USERS;


=======
>>>>>>> 60c617eda13affcb8bf817b08623574e46cbb66d
CREATE DATABASE IF NOT EXISTS chavruta_db;
USE chavruta_db;


CREATE TABLE USERS (
    userId INT AUTO_INCREMENT PRIMARY KEY,
    user VARCHAR(50) NOT NULL,
    role VARCHAR(20),
    name VARCHAR(100),
    phone VARCHAR(20),
    gmail VARCHAR(100) UNIQUE,
<<<<<<< HEAD
=======
    password VARCHAR(255) NOT NULL,
>>>>>>> 60c617eda13affcb8bf817b08623574e46cbb66d
    age INT,
    sex ENUM('זכר', 'נקבה'),
    sector ENUM('חילוני/ת', 'מסורתי/ת', 'דתי/ת', 'מתחזק/ת', 'בעל/ת תשובה', 'חרדי/ת'),
    profile VARCHAR(255),  
    contactMethod ENUM('מייל', 'וואצאפ', 'SMS')
);

<<<<<<< HEAD
CREATE TABLE PASSWORDS (
    userId INT PRIMARY KEY,
    passwordHash VARCHAR(255) NOT NULL,
    FOREIGN KEY (userId) REFERENCES USERS(userId) ON DELETE CASCADE
  );

=======
>>>>>>> 60c617eda13affcb8bf817b08623574e46cbb66d

CREATE TABLE CALLS (
    callId INT AUTO_INCREMENT PRIMARY KEY,
    userId INT,
    place VARCHAR(100),
    learningFormat ENUM('זום', 'טלפון', 'פרונטלי'),
    time DATETIME,
    subject VARCHAR(100),
    age INT,
    notes TEXT,
    material VARCHAR(255),
    
    FOREIGN KEY (userId) REFERENCES USERS(userId)
);


CREATE TABLE JOIN_REQUESTS (
    joinRequestId INT AUTO_INCREMENT PRIMARY KEY,
    callId INT,
    userId INT,
    details TEXT,

    FOREIGN KEY (callId) REFERENCES CALLS(callId),
    FOREIGN KEY (userId) REFERENCES USERS(userId)
);


CREATE TABLE CHAVRUTA (
    chavrutaId INT AUTO_INCREMENT PRIMARY KEY,
    user1 INT,
    user2 INT,
    callId INT,

    FOREIGN KEY (user1) REFERENCES USERS(userId),
    FOREIGN KEY (user2) REFERENCES USERS(userId),
    FOREIGN KEY (callId) REFERENCES CALLS(callId)
);
<<<<<<< HEAD
 

INSERT INTO USERS (user, role, name, phone, gmail, age, sex, sector, profile, contactMethod) VALUES
('david123', 'admin', 'דוד כהן', '0501234567', 'david@gmail.com', 28, 'זכר', 'דתי/ת', 'https://example.com/profiles/david.jpg', 'וואצאפ'),
('sara456', 'user', 'שרה לוי', '0527654321', 'sara@gmail.com',  24, 'נקבה', 'חרדי/ת', 'https://example.com/profiles/sara.jpg', 'מייל'),
('yonatan77', 'user', 'יונתן מזרחי', '0533334444', 'yonatan@gmail.com',  30, 'זכר', 'מסורתי/ת', 'https://example.com/profiles/yonatan.jpg', 'SMS'),
('hila88', 'user', 'הילה פרץ', '0544445555', 'hila@gmail.com',  26, 'נקבה', 'בעל/ת תשובה', 'https://example.com/profiles/hila.jpg', 'וואצאפ');

INSERT INTO PASSWORDS (userId, passwordHash) VALUES
(1, 'hashedpass1'),
(2, 'hashedpass2'),
(3, 'hashedpass3'),
(4, 'hashedpass4');
=======


INSERT INTO USERS (user, role, name, phone, gmail, password, age, sex, sector, profile, contactMethod) VALUES
('david123', 'admin', 'דוד כהן', '0501234567', 'david@gmail.com', 'hashedpass1', 28, 'זכר', 'דתי/ת', 'https://example.com/profiles/david.jpg', 'וואצאפ'),
('sara456', 'user', 'שרה לוי', '0527654321', 'sara@gmail.com', 'hashedpass2', 24, 'נקבה', 'חרדי/ת', 'https://example.com/profiles/sara.jpg', 'מייל'),
('yonatan77', 'user', 'יונתן מזרחי', '0533334444', 'yonatan@gmail.com', 'hashedpass3', 30, 'זכר', 'מסורתי/ת', 'https://example.com/profiles/yonatan.jpg', 'SMS'),
('hila88', 'user', 'הילה פרץ', '0544445555', 'hila@gmail.com', 'hashedpass4', 26, 'נקבה', 'בעל/ת תשובה', 'https://example.com/profiles/hila.jpg', 'וואצאפ');
>>>>>>> 60c617eda13affcb8bf817b08623574e46cbb66d


INSERT INTO CALLS (userId, place, learningFormat, time, subject, age, notes, material) VALUES
(1, 'ירושלים', 'פרונטלי', '2025-06-01 18:00:00', 'גמרא', 25, 'לימוד בעיון', 'מסכת בבא מציעא'),
(2, 'זום', 'זום', '2025-06-02 20:30:00', 'תנ"ך', 23, 'פירוש רש"י ומפרשים נוספים', 'ספר יהושע'),
(3, 'תל אביב', 'פרונטלי', '2025-06-03 19:00:00', 'מחשבת ישראל', 30, 'דגש על הרב קוק', 'אורות התשובה'),
(4, 'חיפה', 'טלפון', '2025-06-04 21:00:00', 'הלכה', 26, 'הכנה לשבת', 'שולחן ערוך סימן ר"ס');


INSERT INTO JOIN_REQUESTS (callId, userId, details) VALUES
(1, 3, 'מעוניין ללמוד גמרא בעיון, פנוי בערבים'),
(2, 4, 'מתעניינת בלימוד תנ"ך עם מישהי בקצב אישי'),
(3, 1, 'אשמח ללמוד על מחשבת ישראל מזווית מסורתית'),
(4, 2, 'מעוניינת בלימוד הלכה לפני שבת');


INSERT INTO CHAVRUTA (user1, user2, callId) VALUES
(1, 3, 1),
(2, 4, 2);
