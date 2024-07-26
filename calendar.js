const DateType = Object.freeze({
    COMMITMENT: "commitment",
    DONE: "done",
});


dates = []


function generateCalendar() {
    const calendarElement = document.getElementById('calendar');
    const now = new Date();
    let yearAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 364);
    // Get the day of the week (0-6, where 0 is Sunday)
    const dayOfWeek = yearAgo.getDay();  
    // Adjust the start date to the beginning of the week (Sunday)
    yearAgo.setDate(yearAgo.getDate() - dayOfWeek);

    for (let day = 0; day < 7; day++) {
        for (let week = 0; week < 53; week++) {
            let currentDate = new Date()
            // Ensure the year, month, and day are all correctly set
            currentDate.setFullYear(yearAgo.getFullYear(), yearAgo.getMonth(), yearAgo.getDate() + (week * 7) + day);
           
            const dateString = currentDate.toISOString().split('T')[0];
            
            const dayElement = document.createElement('div');
            dayElement.classList.add('day');
            dayElement.id = dateString
           
            calendarElement.appendChild(dayElement);
        }
    }
}

function addToCalendar(element) {
    const dayElement = document.getElementById(element.date);
    dayElement.classList.add(`active-${element.type}`);
}

generateCalendar()
