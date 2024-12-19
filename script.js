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
            localStorage.setItem('lastClaimed', ''); // Initialize last claimed date
        }
        document.getElementById('username').innerText = `@${localStorage.getItem('username')}`;
    } else {
        // Generate a random guest username if no Telegram username is available
        if (!localStorage.getItem('username')) {
            const guestUsername = generateRandomGuestUsername();
            localStorage.setItem('username', guestUsername);
            localStorage.setItem('score', '0.00'); // Default score for guests
            localStorage.setItem('lastClaimed', ''); // Initialize last claimed date
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
        localStorage.setItem('lastClaimed', ''); // Initialize last claimed date
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

    // Send the updated score to the backend using WebSocket
    const username = localStorage.getItem('username');

    // Create a WebSocket connection
    const ws = new WebSocket('ws://localhost:3000'); // Change this to your WebSocket server URL

    ws.onopen = () => {
        // Send score update when WebSocket connection is established
        ws.send(JSON.stringify({
            username: username,
            score: formattedScore
        }));
    };

    ws.onmessage = (event) => {
        // Handle any response from the server
        const response = JSON.parse(event.data);
        console.log('Server response:', response);
    };

    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
        console.log('WebSocket connection closed');
    };
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
    document.querySelector('.mining-button').textContent = 'MINING 0.001 $COZY per second';

    resumeMining(); // Start or resume mining
}

// Function to resume mining
function resumeMining() {
    if (localStorage.getItem('miningActive') === 'true') {
        let currentScore = parseFloat(localStorage.getItem('score')) || 0;
        const lastMiningTime = parseInt(localStorage.getItem('lastMiningTime')) || Date.now();
        const elapsedSeconds = Math.floor((Date.now() - lastMiningTime) / 1000);

        // Add mined score based on elapsed time
        currentScore += elapsedSeconds * 0.001; // 0.001 per second
        updateScore(currentScore);

        // Update the last mining time
        localStorage.setItem('lastMiningTime', Date.now());

        // Continue mining every second
        setInterval(() => {
            currentScore += 0.001; // Increment by 0.001 every second
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

// Daily Reward Functionality
function claimDailyReward() {
    const currentTime = new Date().getTime(); // Current UTC timestamp
    const lastClaimed = parseInt(localStorage.getItem('lastClaimed')) || 0; // Last claimed time

    // Check if 24 hours have passed since the last claim
    const timeDifference = currentTime - lastClaimed;
    const hoursInADay = 24 * 60 * 60 * 1000;

    if (timeDifference >= hoursInADay) {
        // The reward is always 100 coins
        const rewardCoins = 100;

        // Update the user's score
        let currentScore = parseFloat(localStorage.getItem('score')) || 0;
        currentScore += rewardCoins;
        updateScore(currentScore); // Update score both locally and on the backend

        // Update the last claimed time and lock the reward for 24 hours
        localStorage.setItem('lastClaimed', currentTime.toString());

        // Disable the button and start countdown
        document.querySelector('.daily-reward-button').disabled = true;
        startCountdown();
    } else {
        alert("You can claim your reward again in 24 hours.");
    }
}

// Countdown function to update the button with remaining time
function startCountdown() {
    const countdownElement = document.querySelector('.daily-reward-button');
    const lastClaimed = parseInt(localStorage.getItem('lastClaimed')) || 0;
    const hoursInADay = 24 * 60 * 60 * 1000;

    const interval = setInterval(() => {
        const currentTime = new Date().getTime();
        const timeDifference = currentTime - lastClaimed;
        const remainingTime = hoursInADay - timeDifference;

        if (remainingTime <= 0) {
            clearInterval(interval);
            countdownElement.disabled = false;
            countdownElement.innerText = 'DAILY REWARD'; // Reset the button text
        } else {
            const remainingHours = Math.floor(remainingTime / (1000 * 60 * 60));
            const remainingMinutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
            const remainingSeconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
            countdownElement.innerText = ` ${remainingHours}:${remainingMinutes}:${remainingSeconds}`;
        }
    }, 1000);
}

// Event listener for daily reward button
document.querySelector('.daily-reward-button').addEventListener('click', claimDailyReward);

// Initial setup when the page loads
window.onload = function() {
    getUsername(); // Fetch and display username
    getScore(); // Fetch and display score

    // Resume mining if it was active
    if (localStorage.getItem('miningActive') === 'true') {
        document.querySelector('.mining-button').disabled = true;
        document.querySelector('.mining-button').textContent = 'MINING 0.001 $COZY per second';
        resumeMining();
    }

    // Start countdown for the daily reward button if it is disabled
    if (localStorage.getItem('lastClaimed')) {
        startCountdown();
    }
};
