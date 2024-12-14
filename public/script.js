// Function to generate a random guest username
function generateRandomGuestUsername() {
    const randomString = Math.random().toString(36).substring(2, 10);  // Generate a random alphanumeric string
    return `guest${randomString}`;  // Return the random guest username
}

// Initialize the Telegram Web App
if (window.Telegram && window.Telegram.WebApp) {
    Telegram.WebApp.ready();  // Initialize the WebApp

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

let playerScore = localStorage.getItem('playerScore') || 0; // Fetch player score or initialize to 0

// Define all tasks with links and prizes
const tasks = {
    1: {
        link: "https://example.com/join-cozy-community", // Task 1 link
        prize: 100 // Task 1 prize in $COZY
    },
    2: {
        link: "https://example.com/follow-cozy-on-x", // Task 2 link
        prize: 100 // Task 2 prize in $COZY
    },
    3: {
        link: "https://example.com/follow-cozy-on-instagram", // Task 3 link
        prize: 100 // Task 3 prize in $COZY
    },
    4: {
        link: "https://example.com/subscribe-cozy-on-youtube", // Task 4 link
        prize: 100 // Task 4 prize in $COZY
    },
    5: {
        link: "https://example.com/watch-cozy-vibes", // Task 5 link
        prize: 50 // Task 5 prize in $COZY
    },
    6: {
        link: "https://example.com/listen-cozy-radio", // Task 6 link
        prize: 50 // Task 6 prize in $COZY
    },
    7: {
        link: "https://example.com/retweet-cozy-roadmap", // Task 7 link
        prize: 50 // Task 7 prize in $COZY
    },
    8: {
        link: "https://example.com/retweet-cozy-post", // Task 8 link
        prize: 50 // Task 8 prize in $COZY
    },
    // Add more tasks here as needed
};

// Function to handle task claim
function claimTask(taskId) {
    // Check if the taskId exists in the tasks object
    if (tasks[taskId]) {
        // Get task link and prize from the tasks object
        const taskLink = tasks[taskId].link;
        const taskPrize = tasks[taskId].prize;

        // Open the task link in a new tab and apply the reward after returning
        window.open(taskLink, '_blank'); // Open the task in a new tab

        // Save the task as completed (for later reward application)
        localStorage.setItem(`task${taskId}Completed`, true);

        // Notify the user to return to claim the reward
        alert("You have started the task! Return to the page to claim your reward.");
    } else {
        alert("Invalid task");
    }
}

// Function to check completed tasks and reward the player
function checkCompletedTasks() {
    for (let taskId in tasks) {
        if (localStorage.getItem(`task${taskId}Completed`) === 'true') {
            rewardPlayer(tasks[taskId].prize, taskId); // Reward the player
            localStorage.removeItem(`task${taskId}Completed`); // Remove task completion status
        }
    }
}

// Function to reward the player
function rewardPlayer(prizeAmount, taskId) {
    // Add the prize to the player's score
    playerScore += prizeAmount;

    // Save the updated score (e.g., send to server, or local storage for now)
    localStorage.setItem('playerScore', playerScore);

    // You can also update the UI to reflect the new score
    alert(`Task ${taskId} completed! You have been rewarded ${prizeAmount} $COZY! Your new score is: ${playerScore}`);
}

// Check for completed tasks when the page is loaded
window.onload = checkCompletedTasks;


// Initial setup when the page loads
window.onload = function() {
    getUsername(); // Fetch and display username
    getScore(); // Fetch and display score
} 