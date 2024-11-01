document.getElementById('taskForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    const titleInput = document.getElementById('text');
    const descriptionInput = document.getElementById('description');
    const imageInput = document.getElementById('image');
    const taskTitle = titleInput.value.trim();
    const taskDescription = descriptionInput.value.trim();
    const taskImage = imageInput.files[0];

    if (taskTitle === "" || taskDescription === "") {
        alert("Please fill in both title and description.");
        return;
    }

    const listItem = document.createElement('li');

    // Create image element if an image is uploaded
    if (taskImage) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imgElement = document.createElement('img');
            imgElement.src = e.target.result;
            imgElement.style.width = '50px'; // Set width for image
            listItem.appendChild(imgElement);
        };
        reader.readAsDataURL(taskImage);
    }

    listItem.innerHTML += `<strong>${taskTitle}</strong><br>${taskDescription}`;

    // Create delete button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.style.marginLeft = '10px';
    deleteButton.addEventListener('click', function() {
        taskList.removeChild(listItem);
        saveTasks(); // Update local storage after deletion
    });

    listItem.appendChild(deleteButton);

    document.getElementById('taskList').appendChild(listItem);
    saveTasks(); // Save tasks to local storage

    // Clear input fields
    titleInput.value = "";
    descriptionInput.value = "";
    imageInput.value = "";
});

// Preview image
document.getElementById('image').addEventListener('change', function() {
    const imagePreview = document.getElementById('image-preview');
    const file = this.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    } else {
        imagePreview.style.display = 'none';
    }
});

function saveTasks() {
    const tasks = [];
    const taskList = document.getElementById('taskList');
    
    for (let i = 0; i < taskList.children.length; i++) {
        const item = taskList.children[i];
        const title = item.querySelector('strong').textContent;
        const description = item.innerHTML.split('<br>')[1].split('<button')[0].trim();
        const imageSrc = item.querySelector('img') ? item.querySelector('img').src : null;
        tasks.push({ title, description, imageSrc });
    }

    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskList = document.getElementById('taskList');

    tasks.forEach(task => {
        const listItem = document.createElement('li');

        if (task.imageSrc) {
            const imgElement = document.createElement('img');
            imgElement.src = task.imageSrc;
            imgElement.style.width = '50px'; // Set width for image
            listItem.appendChild(imgElement);
        }

        listItem.innerHTML += `<strong>${task.title}</strong><br>${task.description}`;

        // Create delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.style.marginLeft = '10px';
        deleteButton.addEventListener('click', function() {
            taskList.removeChild(listItem);
            saveTasks(); // Update local storage after deletion
        });

        listItem.appendChild(deleteButton);
        taskList.appendChild(listItem);
    });
}

// Load tasks from local storage when the page loads
window.onload = loadTasks;
