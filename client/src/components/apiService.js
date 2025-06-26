const BASE_URL = "http://localhost:4000/api";

export function confirmAction(message) {
    const userConfirmed = window.confirm(message);
    return userConfirmed; // מחזירה true אם המשתמש אישר, false אם ביטל
}

// שליפה מהשרת
export async function fetchData(apiPath) {
    try {
        const response = await fetch(`${BASE_URL}/${apiPath}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });
        if (!response.ok) {
            throw new Error(`שגיאה: ${response.status}`);
        }
        console.log("Response from server:", response);
        return await response.json();
    }
    catch (error) {
        alert(`שגיאה בשליפה : ${error.message}`);
    }
}

// הוספת נתונים לשרת
export async function addData(apiPath, dataToAdd, isFormData = false) {
    try {
        const options = {
            method: "POST",
            credentials: 'include',
        };

        if (isFormData) {
            options.body = dataToAdd; // FormData
            // לא להגדיר headers, הדפדפן יגדיר Content-Type מתאים
        } else {
            options.headers = { "Content-Type": "application/json" };
            options.body = JSON.stringify(dataToAdd);
        }

        const response = await fetch(`${BASE_URL}/${apiPath}`, options);

        if (!response.ok) {
            throw new Error(`שגיאה: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        alert(`שגיאה בהוספה: ${error.message}`);
    }
}


// מחיקה
export async function deleteData(apiPath, dataToSend = null) {
    try {
        const options = {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            credentials: 'include',
        };

        if (dataToSend) {
            options.body = JSON.stringify(dataToSend);
        }

        const response = await fetch(`${BASE_URL}/${apiPath}`, options);
        if (!response.ok) {
            throw new Error(`שגיאה: ${response.status}`);
        }
    } catch (error) {
        alert(`שגיאה במחיקה: ${error.message}`);
    }
}


// עדכון
export async function UpdateData(apiPath, dataToUpdate) {
    try {
      const response = await fetch(`${BASE_URL}/${apiPath}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToUpdate),
        credentials: 'include',
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Update failed:", errorText);
        throw new Error(`Server returned status ${response.status}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error("Error in UpdateData:", error.message);
      throw error;
    }
  }