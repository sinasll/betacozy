// Function to generate a random guest username
function generateRandomGuestUsername() {
    const randomString = Math.random().toString(36).substring(2, 10);  // Generate a random alphanumeric string
    return `guest${randomString}`;  // Return the random guest username
}

// Initialize the Telegram Web App if available
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
        // Display username
        document.getElementById('username').innerText = `@${localStorage.getItem('username')}`;
    } else {
        // Generate a random guest username if no Telegram username is available
        if (!localStorage.getItem('username')) {
            const guestUsername = generateRandomGuestUsername();
            localStorage.setItem('username', guestUsername);
            localStorage.setItem('score', 0); // Default score for guests
        }
        // Display guest username
        document.getElementById('username').innerText = `@${localStorage.getItem('username')}`;
    }
} else {
    // Fallback for non-WebApp environments (e.g., browser)
    console.log('Telegram WebApp is not available.');

    // If no username exists in localStorage, generate one and store it
    if (!localStorage.getItem('username')) {
        const guestUsername = generateRandomGuestUsername();
        localStorage.setItem('username', guestUsername); // Store guest username
        localStorage.setItem('score', 0); // Default score for guests
    }
    // Display username
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

// Handle navigation button actions

// Function for "MINING" button
function goHome() {
    window.location.href = "index.html";
}

// Function for "Leaderboard" button
function goLeaderboard() {
    window.location.href = "leaderboard.html";
}

// Function for "Friends" button
function goFriends() {
    window.location.href = "friends.html";
}

// Function to fetch and display the leaderboard
async function fetchLeaderboard() {
  try {
    const response = await fetch('http://localhost:3000/api/leaderboard'); // Update with your actual API URL
    if (response.ok) {
      const leaderboardData = await response.json();
      displayLeaderboard(leaderboardData);
    } else {
      console.log('Error fetching leaderboard');
    }
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
  }
}

// Function to display the leaderboard on the page
function displayLeaderboard(data) {
  const leaderboardElement = document.getElementById('leaderboard');
  leaderboardElement.innerHTML = ''; // Clear previous content

  // Slice the data to get the top 100 users
  const top100Data = data.slice(0, 100);

  // Create a list of leaderboard entries
  top100Data.forEach((user, index) => {
    const userDiv = document.createElement('div');
    userDiv.classList.add('leaderboard-entry');
    
    const rank = document.createElement('span');
    rank.innerText = `${index + 1}.`; // Rank starts at 1
    
    const username = document.createElement('span');
    username.innerText = `@${user.username}`;
    
    const score = document.createElement('span');
    score.innerText = `${user.score} points`;
    
    userDiv.appendChild(rank);
    userDiv.appendChild(username);
    userDiv.appendChild(score);

    leaderboardElement.appendChild(userDiv);
  });
}

// Function to update the score based on mining progress
function updateMiningScore() {
    const miningActive = localStorage.getItem('miningActive') === 'true';
    if (miningActive) {
        const storedScore = parseFloat(localStorage.getItem('score')) || 0;
        const lastMiningTime = parseInt(localStorage.getItem('lastMiningTime')) || Date.now();
        const elapsedSeconds = Math.floor((Date.now() - lastMiningTime) / 1000);

        // Calculate new score based on elapsed time (e.g., 0.001 points per second)
        const miningRate = 0.001; // Adjust the mining rate as needed
        const newScore = storedScore + elapsedSeconds * miningRate;

        // Display the updated score on the page without changing localStorage
        document.getElementById('score').innerText = newScore.toFixed(2);
    } else {
        // If mining is not active, just display the stored score
        const storedScore = localStorage.getItem('score') || 0;
        document.getElementById('score').innerText = storedScore;
    }
}

// Initial setup when the page loads
window.onload = function() {
    getUsername(); // Fetch and display username
    getScore(); // Fetch and display score
    fetchLeaderboard(); // Fetch and display leaderboard
    setInterval(updateMiningScore, 1000); // Update mining score every second
};
