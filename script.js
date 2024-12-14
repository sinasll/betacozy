// Function to generate a random guest username
function generateRandomGuestUsername() {
    const randomString = Math.random().toString(36).substring(2, 10); // Generate a random alphanumeric string
    return `guest${randomString}`; // Return the random guest username
}

// Initialize the Telegram Web App
if (window.Telegram && window.Telegram.WebApp) {
    Telegram.WebApp.ready(); // Initialize the WebApp

    // Get user information
    const user = Telegram.WebApp.initDataUnsafe.user;

    // Check if username exists
    if (user && user.username) {
        // Store the username only if it hasn't been stored already
        if (!localStorage.getItem('username')) {
            localStorage.setItem('username', user.username);
            localStorage.setItem('score', 0); // Initialize score to 0
        }
        document.getElementById('username').innerText = `@${localStorage.getItem('username')}`;
    } else {
        // Generate a random guest username if no Telegram username is available
        if (!localStorage.getItem('username')) {
            const guestUsername = generateRandomGuestUsername();
            localStorage.setItem('username', guestUsername);
            localStorage.setItem('score', 0); // Default score for guests
        }
        document.getElementById('username').innerText = `@${localStorage.getItem('username')}`;
    }
} else {
    // Fallback for non-WebApp environments
    console.log('Telegram WebApp is not available.');
    // If no username exists in localStorage, generate one and store it
    if (!localStorage.getItem('username')) {
        const guestUsername = generateRandomGuestUsername();
        localStorage.setItem('username', guestUsername); // Store guest username
        localStorage.setItem('score', 0); // Default score for guests
    }
    document.getElementById('username').innerText = `@${localStorage.getItem('username')}`;
}

// Function to get and display username from localStorage
function getUsername() {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
        document.getElementById('username').innerText = `@${storedUsername}`;
    } else {
        const guestUsername = generateRandomGuestUsername();
        localStorage.setItem('username', guestUsername); // Store guest username
        document.getElementById('username').innerText = `@${guestUsername}`;
    }
}

// Function to get and display score from localStorage
function getScore() {
    const storedScore = localStorage.getItem('score');
    if (storedScore) {
        document.getElementById('score').innerText = storedScore;
    } else {
        localStorage.setItem('score', 0); // Default score is 0
        document.getElementById('score').innerText = 0;
    }
}

// Function to update the score in localStorage and on the page
function updateScore(newScore) {
    localStorage.setItem('score', newScore);
    document.getElementById('score').innerText = newScore;
}

// Function to claim reward for completing a task
function claimReward(taskNumber) {
    const score = parseInt(localStorage.getItem('score')) || 0;
    const taskClaimButton = document.getElementById(`task${taskNumber}Claim`);

    // Reward the player with 10 points for each task completed
    const newScore = score + 10;

    // Update the score and localStorage
    updateScore(newScore);

    // Disable the claim button for this task after reward
    taskClaimButton.disabled = true;
    taskClaimButton.innerText = 'Reward Claimed';

    // Mark the task as completed in localStorage
    localStorage.setItem(`task${taskNumber}Completed`, true);
}

// Function to check and disable completed tasks
function checkCompletedTasks() {
    for (let i = 1; i <= 8; i++) {
        if (localStorage.getItem(`task${i}Completed`) === 'true') {
            const taskClaimButton = document.getElementById(`task${i}Claim`);
            taskClaimButton.disabled = true;
            taskClaimButton.innerText = 'Reward Claimed';
        }
    }
}

// Handling button actions

// Function for "MINING" button
function goHome() {
    window.location.href = "index.html";
}

function goLeaderboard() {
    window.location.href = "leaderboard.html";
}

function goFriends() {
    window.location.href = "friends.html";
}

// Initial setup when the page loads
window.onload = function () {
    getUsername(); // Fetch and display username
    getScore(); // Fetch and display score
    checkCompletedTasks(); // Check and disable completed tasks
};
