const BASE_URL = "http://localhost:4000/api";

//הי ברכי מענין אם תראי את השינוים האלא:)
//הוספת נתונים לשרת
export async function addData(apiPath, dataToAdd) {
    try {
        const response = await fetch(`${BASE_URL}/${apiPath}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dataToAdd),
            credentials: 'include',
        });
        if (!response.ok) {
            throw new Error(`שגיאה: ${response.status}`);
        }
        return await response.json();
    }
    catch (error) {
        alert(`שגיאה בהוספה : ${error.message}`);
    }
}