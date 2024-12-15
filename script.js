// Function to generate a random guest username
function generateRandomGuestUsername() {
    const randomString = Math.random().toString(36).substring(2, 10);
    return `guest${randomString}`;
}

// Initialize the Telegram Web App
if (window.Telegram && window.Telegram.WebApp) {
    Telegram.WebApp.ready();

    const user = Telegram.WebApp.initDataUnsafe.user;

    if (user && user.username) {
        if (!localStorage.getItem('username')) {
            localStorage.setItem('username', user.username);
            fetchUserFromServer(user.username);
        }
    } else {
        if (!localStorage.getItem('username')) {
            const guestUsername = generateRandomGuestUsername();
            localStorage.setItem('username', guestUsername);
            createUserOnServer(guestUsername);
        }
    }
} else {
    console.log('Telegram WebApp is not available.');
    if (!localStorage.getItem('username')) {
        const guestUsername = generateRandomGuestUsername();
        localStorage.setItem('username', guestUsername);
        createUserOnServer(guestUsername);
    }
}

function fetchUserFromServer(username) {
    fetch(`/api/user/${username}`)
        .then(response => response.json())
        .then(data => {
            if (data && data.score !== undefined) {
                localStorage.setItem('user_id', data._id);
                localStorage.setItem('score', data.score);
                displayUserInfo();
            }
        })
        .catch(error => {
            console.error('Error fetching user:', error);
        });
}

function createUserOnServer(username) {
    fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
    })
        .then(response => response.json())
        .then(data => {
            if (data && data._id) {
                localStorage.setItem('user_id', data._id);
                localStorage.setItem('score', data.score || 0);
                displayUserInfo();
            }
        })
        .catch(error => {
            console.error('Error creating user:', error);
        });
}

function displayUserInfo() {
    const username = localStorage.getItem('username');
    const score = localStorage.getItem('score') || 0;

    document.getElementById('username').innerText = `@${username}`;
    document.getElementById('score').innerText = score;
}

// Function to update the user's score in localStorage and MongoDB
async function updateScoreInLocalStorage(newScore) {
    // Update the score in localStorage
    localStorage.setItem('score', newScore);
    document.getElementById('score').innerText = newScore;

    // Now send the updated score to the server (MongoDB)
    const userId = localStorage.getItem('user_id');
    if (userId) {
        try {
            const response = await fetch(`/api/user/${userId}/score`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ score: newScore }),
            });

            if (!response.ok) {
                throw new Error('Failed to update score on server');
            }

            // Optionally, you could handle the server response here
            const data = await response.json();
            console.log('Score updated in MongoDB:', data);
        } catch (error) {
            console.error('Error updating score on server:', error);
        }
    } else {
        console.error('User ID is not available.');
    }
}

// Function to claim reward and update the user's score
function claimReward(taskNumber) {
    const currentScore = parseInt(localStorage.getItem('score')) || 0;
    const taskButton = document.getElementById(`task${taskNumber}Claim`);
    const rewardAmount = 10; // Reward amount for each task

    // Update the score
    const newScore = currentScore + rewardAmount;
    updateScoreInLocalStorage(newScore);

    // Disable the task button and update its text
    taskButton.disabled = true;
    taskButton.innerText = 'Reward Claimed';
    localStorage.setItem(`task${taskNumber}Completed`, true);
}

window.onload = function () {
    displayUserInfo();
};

// Navigation buttons
function goHome() {
    window.location.href = "index.html";
}

function goLeaderboard() {
    window.location.href = "leaderboard.html";
}

function goFriends() {
    window.location.href = "friends.html";
}

// Initialize the page
window.onload = async function () {
    initializeUserData(); // Initialize username and score
    await syncWithServer(); // Sync with the server
    const storedScore = localStorage.getItem('score');
    document.getElementById('score').innerText = storedScore || 0;

    checkCompletedTasks(); // Check and disable completed tasks

    // If on the leaderboard page, fetch and display leaderboard data
    if (document.getElementById('leaderboard')) {
        fetchLeaderboard();
    }
};

// Sync the user data with the server and update localStorage
async function syncWithServer() {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
        console.error('No user ID found!');
        return;
    }

    try {
        const response = await fetch(`/api/user/${userId}`);
        const data = await response.json();
        if (data && data.score !== undefined) {
            localStorage.setItem('score', data.score);
            displayUserInfo();
        }
    } catch (error) {
        console.error('Error syncing with the server:', error);
    }
}

// Check and disable tasks that are already completed
function checkCompletedTasks() {
    for (let i = 1; i <= 5; i++) {
        if (localStorage.getItem(`task${i}Completed`)) {
            const taskButton = document.getElementById(`task${i}Claim`);
            taskButton.disabled = true;
            taskButton.innerText = 'Reward Claimed';
        }
    }
}

// Fetch leaderboard data and display it
function fetchLeaderboard() {
    fetch('/api/leaderboard')
        .then(response => response.json())
        .then(data => {
            const leaderboardElement = document.getElementById('leaderboard');
            data.forEach(user => {
                const userElement = document.createElement('div');
                userElement.className = 'leaderboard-item';
                userElement.innerText = `@${user.username}: ${user.score}`;
                leaderboardElement.appendChild(userElement);
            });
        })
        .catch(error => {
            console.error('Error fetching leaderboard:', error);
        });
}
