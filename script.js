// Function to generate a random guest username
function generateRandomGuestUsername() {
    const randomString = Math.random().toString(36).substring(2, 10); // Generate random alphanumeric string
    return `guest${randomString}`; // Return a guest username
}

// Sync local data with the server
async function syncWithServer() {
    const username = localStorage.getItem('username');

    if (!username) {
        console.log('No username found in localStorage.');
        return;
    }

    try {
        const response = await fetch(`/api/user/${username}`);
        if (response.ok) {
            const user = await response.json();
            localStorage.setItem('score', user.score); // Sync score from server
        } else {
            console.log('User not found on the server.');
        }
    } catch (error) {
        console.error('Error syncing with server:', error);
    }
}

// Update the score on the server and locally
async function updateScore(newScore) {
    const username = localStorage.getItem('username');
    const userId = localStorage.getItem('user_id');

    if (!username || !userId) {
        console.log('User data missing.');
        return;
    }

    try {
        const response = await fetch(`/api/user/${userId}/score`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ score: newScore }),
        });

        if (response.ok) {
            localStorage.setItem('score', newScore);
            document.getElementById('score').innerText = newScore;
        } else {
            console.error('Failed to update score on server:', await response.text());
        }
    } catch (error) {
        console.error('Error updating score to server:', error);
    }
}

// Initialize username and score
function initializeUserData() {
    const username = localStorage.getItem('username');
    if (!username) {
        const guestUsername = generateRandomGuestUsername();
        localStorage.setItem('username', guestUsername);
        localStorage.setItem('score', 0); // Default score for guests
        document.getElementById('username').innerText = `@${guestUsername}`;
    } else {
        document.getElementById('username').innerText = `@${username}`;
    }
}

// Claim reward for a task
function claimReward(taskNumber) {
    const currentScore = parseInt(localStorage.getItem('score'), 10) || 0;
    const newScore = currentScore + 10; // Example reward value

    updateScore(newScore); // Update score on both server and local
    localStorage.setItem(`task${taskNumber}Completed`, true);

    const taskButton = document.getElementById(`task${taskNumber}Claim`);
    if (taskButton) {
        taskButton.disabled = true;
        taskButton.innerText = 'Reward Claimed';
    }
}

// Check and disable completed tasks
function checkCompletedTasks() {
    const taskButtons = document.querySelectorAll('[id^="task"]');
    taskButtons.forEach((button) => {
        const taskNumber = button.id.replace('task', '').replace('Claim', '');
        const isTaskCompleted = localStorage.getItem(`task${taskNumber}Completed`);
        if (isTaskCompleted) {
            button.disabled = true;
            button.innerText = 'Reward Claimed';
        }
    });
}

// Fetch leaderboard data and render it
async function fetchLeaderboard() {
    try {
        const response = await fetch('/api/leaderboard');
        if (response.ok) {
            const leaderboard = await response.json();
            const leaderboardContainer = document.getElementById('leaderboard');
            leaderboardContainer.innerHTML = leaderboard
                .map((user, index) => `<li>${index + 1}. @${user.username} - ${user.score} points</li>`)
                .join('');
        } else {
            console.error('Failed to fetch leaderboard:', await response.text());
        }
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
    }
}

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
