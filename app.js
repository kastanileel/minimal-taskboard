let tasks = [];
let fileHandle;

async function downloadTaskboardJSON() {
    const json = JSON.stringify({
        "tasks": tasks,
        "dates": dates
    }, null, 2);
    try {
        const writable = await fileHandle.createWritable();
        await writable.write(json);
        await writable.close();
        alert('Tasks saved successfully.');
    } catch (error) {
        try {
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'data.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            alert('You didn\'t select a data file. Saved the contents of the current taskboard to the download folder.')
        }
        catch(error){
            console.error('Error saving tasks:', error);
            alert('Couldn\'t save you taskboard. Sorry for that.')
        }
        
        console.error('Error saving tasks:', error);
    }
}

async function loadTaskboardJSON() {
    try {
        [fileHandle] = await window.showOpenFilePicker({
            types: [
                {
                    description: 'JSON Files',
                    accept: {
                        'application/json': ['.json']
                    }
                }
            ],
            excludeAcceptAllOption: true,
            multiple: false,
            startIn: "desktop"
        });
    
        const file = await fileHandle.getFile();
        const contents = await file.text();
        const parsedFile = JSON.parse(contents);
        parsedFile.tasks.forEach(element => {
            tasks.push(element)
            addTaskToColumn(element);
        });

        parsedFile.dates.forEach(element => {
            dates.push(element)
            addToCalendar(element)
        })

        
        
    } catch (error) {
        console.error('Error selecting file:', error);
    }
}

function showPopup() {
    document.getElementById('popup').style.display = 'block';
    document.getElementById('popupOverlay').style.display = 'block';
}

function hidePopup() {
    document.getElementById('popup').style.display = 'none';
    document.getElementById('popupOverlay').style.display = 'none';
}

async function submitTask() {
    const name = document.getElementById('taskName').value;
    const description = document.getElementById('taskDescription').value;

    // Example of calling the addNewTask function
    const newTask = ({
        'name': name,
        'description': description,
        'state': "todo"
    })
    
    await tasks.push(newTask)
    addTaskToColumn(newTask)

    hidePopup();
}

async function addTaskToColumn(task) {
    let column;
    switch(task.state) {
        case 'todo':
            column = document.getElementById("todo-column");
            break;
        case 'progress':
            column = document.getElementById("progress-column");
            break;
        case 'done':
            column = document.getElementById("done-column");
            break;
        default:
            console.error('Unknown task state:', task.state);
            return;
    }
    const taskElement = document.createElement("div");
    taskElement.className = "task";
    taskElement.id = `${tasks.indexOf(task)}`;
    taskElement.innerHTML = `
        <div class="task-header">
            <h3>${task.name}</h3>
            <button class="delete-task-button" onclick="deleteTask(${tasks.indexOf(task)})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
        <p>${task.description.replace(/\n/g, '<br>')}</p>
    `;

    // Set the task element as draggable
    taskElement.draggable = true;
    taskElement.ondragstart = function (event) {
        event.dataTransfer.setData("text/plain", event.target.id);
        event.dataTransfer.effectAllowed = "move";
    };
    column.appendChild(taskElement);
}

function deleteTask(taskId) {
    tasks.pop(taskId)
    const taskElement = document.getElementById(taskId);
    taskElement.parentNode.removeChild(taskElement);
    // Optionally, remove the task from the tasks array or perform other actions
}


function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var taskId = ev.dataTransfer.getData("text");
    var taskElement = document.getElementById(taskId);
    var targetColumn = ev.target.closest('.column');

    if (targetColumn && taskElement) {
        targetColumn.appendChild(taskElement);

        // Update the task state based on the new column
       
        let task = tasks[taskId];
        task.state = targetColumn.id.replace('-column', '');

        let today_date_string = new Date().toISOString().split('T')[0]

        if(!dates.some(element => element.date === today_date_string)) {
            let date_type = "done"
            if(task.state !== "done")
                date_type = "commit"
            const new_element = {"date": today_date_string, "type": date_type}
            dates.push(new_element)
            addToCalendar(new_element)
        }
        else {
            let idx = dates.findIndex(dateObj => dateObj.date === today_date_string);
            if(dates[idx].type == "commit" && task.state == "done" ){
                dates[idx].type = "done"
                addToCalendar(dates[idx])
            }
        }
    }
}

