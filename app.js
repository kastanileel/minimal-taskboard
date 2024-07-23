document.getElementById('modifyButton').addEventListener('click', function() {
    modifyJsonData();
});

function loadJsonData() {
    // Simulated JSON load (as we can't read local files directly)
    return {
        "key": "value"
    };
}

function modifyJsonData() {
    let jsonData = loadJsonData();
    // Modify the JSON data here
    jsonData.modified = true;
    jsonData.timestamp = new Date().toISOString();

    // Display the modified JSON in the webpage
    document.getElementById('jsonDataDisplay').textContent = JSON.stringify(jsonData, null, 2);
}

// Initially load and show JSON data
document.getElementById('jsonDataDisplay').textContent = JSON.stringify(loadJsonData(), null, 2);
