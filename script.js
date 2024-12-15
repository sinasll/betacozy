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

async function updateScoreOnServer(newScore) {
    const userId = localStorage.getItem('user_id');

    if (!userId) {
        console.error('User ID not found in localStorage');
        return;
    }

    try {
        const response = await fetch(`/api/user/${userId}/score`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ score: newScore }),
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('score', data.user.score);
            document.getElementById('score').innerText = data.user.score;
        } else {
            console.error('Failed to update score:', await response.text());
        }
    } catch (error) {
        console.error('Error updating score on server:', error);
    }
}

function claimReward(taskNumber) {
    const currentScore = parseInt(localStorage.getItem('score')) || 0;
    const taskButton = document.getElementById(`task${taskNumber}Claim`);

    const newScore = currentScore + 10;
    updateScoreOnServer(newScore);

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
