// Configuration - Replace with your actual Lambda function URL
const LAMBDA_ENDPOINT = 'https://x8kxrmmlo3.execute-api.eu-north-1.amazonaws.com/prod/users';

// DOM elements
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const loadingIndicator = document.getElementById('loadingIndicator');
const resultsContainer = document.getElementById('resultsContainer');
const resultsContent = document.getElementById('resultsContent');
const errorContainer = document.getElementById('errorContainer');
const errorMessage = document.getElementById('errorMessage');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Enable Enter key submission
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchData();
        }
    });
    
    // Clear results when input changes
    searchInput.addEventListener('input', function() {
        hideAllContainers();
    });
});

// Main search function
async function searchData() {
    const userId = searchInput.value.trim();
    
    if (!userId) {
        showError('Please enter a User ID');
        return;
    }
    
    showLoading();
    
    try {
        const url = new URL(LAMBDA_ENDPOINT);
        url.searchParams.append('userId', userId);
        
        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        // ✅ Handle real HTTP status here
        if (response.status === 200) {
            const userData = await response.json();
            displayUserData(userData);
        } else if (response.status === 404) {
            const errorData = await response.json();
            showError(errorData.message || 'User not found');
        } else if (response.status === 500) {
            const errorData = await response.json();
            showError(errorData.message || 'Server error occurred');
        } else {
            throw new Error(`Unexpected status code: ${response.status}`);
        }
        
    } catch (error) {
        console.error('Error calling Lambda function:', error);
        showError(`Failed to fetch data: ${error.message}`);
    }
}


// Display user data
function displayUserData(userData) {
    hideAllContainers();
    
    // Clear previous results
    resultsContent.innerHTML = '';
    
    // Create user data display
    const userDiv = document.createElement('div');
    userDiv.className = 'result-item';
    
    let content = '<h4>User Information</h4>';
    
    // Display each field from the user data
    Object.keys(userData).forEach(key => {
        const value = userData[key];
        if (typeof value === 'object' && value !== null) {
            content += `<p><strong>${formatFieldName(key)}:</strong></p>`;
            content += `<pre>${JSON.stringify(value, null, 2)}</pre>`;
        } else {
            content += `<p><strong>${formatFieldName(key)}:</strong> ${value}</p>`;
        }
    });
    
    userDiv.innerHTML = content;
    resultsContent.appendChild(userDiv);
    
    resultsContainer.classList.remove('hidden');
    resetButton();
}

// Format field names for better display
function formatFieldName(fieldName) {
    return fieldName
        .replace(/([A-Z])/g, ' $1') // Add space before capital letters
        .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
        .replace(/Id/g, 'ID'); // Replace 'Id' with 'ID'
}

// Show loading state
function showLoading() {
    hideAllContainers();
    searchButton.disabled = true;
    searchButton.textContent = 'Searching...';
    loadingIndicator.classList.remove('hidden');
}

// Show error message
function showError(message) {
    hideAllContainers();
    errorMessage.textContent = message;
    errorContainer.classList.remove('hidden');
    resetButton();
}

// Hide all result containers
function hideAllContainers() {
    loadingIndicator.classList.add('hidden');
    resultsContainer.classList.add('hidden');
    errorContainer.classList.add('hidden');
}

// Reset button state
function resetButton() {
    searchButton.disabled = false;
    searchButton.textContent = 'Search';
}

// Utility function to format JSON for display
function formatJSON(obj) {
    return JSON.stringify(obj, null, 2);
}

// Expected Lambda function behavior:
/*
Your Lambda function expects:
- GET request with query parameter: ?userId=someUserId
- Returns user data from DynamoDB UserData table

Response formats:
Success (200):
{
    "statusCode": 200,
    "body": "{\"userId\": \"123\", \"name\": \"John Doe\", \"email\": \"john@example.com\"}",
    "headers": { "Content-Type": "application/json" }
}

Not Found (404):
{
    "statusCode": 404,
    "body": "{\"message\": \"No user data found\"}",
    "headers": { "Content-Type": "application/json" }
}

Server Error (500):
{
    "statusCode": 500,
    "body": "{\"message\": \"Failed to retrieve user data\"}",
    "headers": { "Content-Type": "application/json" }
}
*/