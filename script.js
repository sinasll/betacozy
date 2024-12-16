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
            localStorage.setItem('score', '0.00'); // Initialize score to 0.00
        }
        document.getElementById('username').innerText = `@${localStorage.getItem('username')}`;
    } else {
        // Generate a random guest username if no Telegram username is available
        if (!localStorage.getItem('username')) {
            const guestUsername = generateRandomGuestUsername();
            localStorage.setItem('username', guestUsername);
            localStorage.setItem('score', '0.00'); // Default score for guests
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
        localStorage.setItem('score', '0.00'); // Default score for guests
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
        document.getElementById('score').innerText = parseFloat(storedScore).toFixed(2); // Always display two decimals
    } else {
        localStorage.setItem('score', '0.00'); // Default score is 0.00
        document.getElementById('score').innerText = '0.00';
    }
}

// Function to update the score in localStorage, on the page, and send it to MongoDB
function updateScore(newScore) {
    const formattedScore = parseFloat(newScore).toFixed(2); // Ensure two decimal places
    localStorage.setItem('score', formattedScore);
    document.getElementById('score').innerText = formattedScore;

    // Send the updated score to the backend
    const username = localStorage.getItem('username');
    
    // Sending a POST request to the backend to save the score in MongoDB
    fetch('http://localhost:3000/update-score', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            score: formattedScore
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Score updated successfully:', data);
    })
    .catch(error => {
        console.error('Error updating score:', error);
    });
}

// Function to handle mining logic
function startMining() {
    // Check if mining is already active
    if (localStorage.getItem('miningActive') === 'true') {
        resumeMining();
        return;
    }

    // Activate mining
    localStorage.setItem('miningActive', 'true');
    localStorage.setItem('lastMiningTime', Date.now()); // Save the timestamp of when mining starts

    document.querySelector('.mining-button').disabled = true;
    document.querySelector('.mining-button').textContent = 'MINING 0.01 $COZY per second';

    resumeMining(); // Start or resume mining
}

// Function to resume mining
function resumeMining() {
    if (localStorage.getItem('miningActive') === 'true') {
        let currentScore = parseFloat(localStorage.getItem('score')) || 0;
        const lastMiningTime = parseInt(localStorage.getItem('lastMiningTime')) || Date.now();
        const elapsedSeconds = Math.floor((Date.now() - lastMiningTime) / 1000);

        // Add mined score based on elapsed time
        currentScore += elapsedSeconds * 0.01; // 0.01 per second
        updateScore(currentScore);

        // Update the last mining time
        localStorage.setItem('lastMiningTime', Date.now());

        // Continue mining every second
        setInterval(() => {
            currentScore += 0.01; // Increment by 0.01 every second
            updateScore(currentScore);
        }, 1000);
    }
}

// Event listener for mining button
document.querySelector('.mining-button').addEventListener('click', startMining);

// Handling button actions

// Function for NAV buttons
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
window.onload = function() {
    getUsername(); // Fetch and display username
    getScore(); // Fetch and display score

    // Resume mining if it was active
    if (localStorage.getItem('miningActive') === 'true') {
        document.querySelector('.mining-button').disabled = true;
        document.querySelector('.mining-button').textContent = 'MINING 0.01 $COZY per second';
        resumeMining();
    }
};
