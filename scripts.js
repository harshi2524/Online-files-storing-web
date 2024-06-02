// Simulated user data
const users = [
    { username: 'Govardhan', password: 'pass1', details: 'User One' },
    { username: 'Charan', password: 'pass2', details: 'User Two' },
    { username: 'Ravi', password: 'pass3', details: 'User Three' }
];

// Logout function
function logout() {
    localStorage.removeItem('loggedInUser');
    window.location.href = 'index.html'; // Redirect to login page
}

// Display user details
function displayUserDetails() {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    if (user) {
        document.getElementById('greetingText').textContent = `Hi! ${user.username}`;
    } else {
        window.location.href = 'index.html';
    }
}

// Handle login
document.getElementById('loginForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        window.location.href = 'user-details.html';
    } else {
        document.getElementById('message').textContent = 'Invalid username or password';
    }
});

// Delete file
function deleteFile(filename) {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    if (user) {
        let userFiles = JSON.parse(localStorage.getItem(user.username + '_files')) || [];
        userFiles = userFiles.filter(file => file.name !== filename);
        localStorage.setItem(user.username + '_files', JSON.stringify(userFiles));
        displayFiles(userFiles);
    } else {
        window.location.href = 'index.html';
    }
}

// Display files
function displayFiles(files) {
    const fileList = document.getElementById('fileList');
    fileList.innerHTML = '';
    files.forEach(file => {
        const li = document.createElement('li');
        li.textContent = file.name;

        const downloadButton = document.createElement('button');
        downloadButton.innerHTML = '<i class="fas fa-download"></i>';
        downloadButton.addEventListener('click', () => {
            const link = document.createElement('a');
            link.href = file.data;
            link.download = file.name;
            link.click();
        });

        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteButton.addEventListener('click', () => {
            deleteFile(file.name);
        });

        li.appendChild(downloadButton);
        li.appendChild(deleteButton);
        fileList.appendChild(li);
    });
}

// Event listener for upload button
document.getElementById('uploadButton')?.addEventListener('click', function() {
    const fileInput = document.getElementById('fileInput');
    const files = fileInput.files;
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    if (user) {
        let userFiles = JSON.parse(localStorage.getItem(user.username + '_files')) || [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();
            reader.onload = function(e) {
                userFiles.push({ name: file.name, data: e.target.result });
                localStorage.setItem(user.username + '_files', JSON.stringify(userFiles));
                document.getElementById('uploadMessage').textContent = 'Files uploaded successfully!';
                displayFiles(userFiles);
            };
            reader.readAsDataURL(file);
        }
    } else {
        window.location.href = 'index.html';
    }
});

// Display files on page load
document.addEventListener('DOMContentLoaded', function() {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    if (user) {
        const userFiles = JSON.parse(localStorage.getItem(user.username + '_files')) || [];
        displayFiles(userFiles);
        if (document.getElementById('greetingText')) {
            displayUserDetails();
        }
    } else {
        window.location.href = 'index.html';
    }
});
