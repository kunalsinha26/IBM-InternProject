document.addEventListener('DOMContentLoaded', function() {
    // Set current date
    const currentDateElement = document.getElementById('currentDate');
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    currentDateElement.textContent = now.toLocaleDateString('en-US', options);
    
    // Initialize calendar
    initializeCalendar();
    
    // Theme switcher
    setupThemeSwitcher();
    
    // Add chore functionality
    setupChoreAdder();
    
    // Weather forecast functionality
    setupWeatherForecast();
    
    // Checkbox functionality
    setupCheckboxes();
});

function initializeCalendar() {
    const calendarWidget = document.getElementById('calendarWidget');
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    
    // Get first day of month and total days in month
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Calendar header
    const monthNames = ["January", "February", "March", "April", "May", "June",
                       "July", "August", "September", "October", "November", "December"];
    const header = document.createElement('div');
    header.className = 'calendar-header';
    header.textContent = `${monthNames[month]} ${year}`;
    calendarWidget.appendChild(header);
    
    // Day names
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayNames.forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = day;
        calendarWidget.appendChild(dayElement);
    });
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'calendar-date';
        calendarWidget.appendChild(emptyCell);
    }
    
    // Dates of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dateElement = document.createElement('div');
        dateElement.className = 'calendar-date';
        dateElement.textContent = day;
        
        // Highlight today
        if (day === now.getDate() && month === now.getMonth() && year === now.getFullYear()) {
            dateElement.classList.add('today');
        }
        
        calendarWidget.appendChild(dateElement);
    }
}

function setupThemeSwitcher() {
    const themeOptions = document.querySelectorAll('.theme-option');
    
    themeOptions.forEach(option => {
        option.addEventListener('click', function() {
            const theme = this.getAttribute('data-theme');
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('selectedTheme', theme);
        });
    });
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }
}

function setupChoreAdder() {
    const addChoreBtn = document.getElementById('addChoreBtn');
    const newChoreInput = document.getElementById('newChore');
    
    addChoreBtn.addEventListener('click', function() {
        const choreText = newChoreInput.value.trim();
        if (choreText) {
            addNewChore(choreText);
            newChoreInput.value = '';
        }
    });
    
    newChoreInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const choreText = newChoreInput.value.trim();
            if (choreText) {
                addNewChore(choreText);
                newChoreInput.value = '';
            }
        }
    });
}

function addNewChore(choreText) {
    const choresList = document.querySelector('.chores-list');
    const choreId = 'chore' + (document.querySelectorAll('.chore-item').length + 1);
    
    const choreItem = document.createElement('div');
    choreItem.className = 'chore-item';
    
    const energyLevels = ['low-energy', 'medium-energy', 'high-energy'];
    const energyTexts = ['Low Energy', 'Medium Energy', 'High Energy'];
    const randomEnergy = Math.floor(Math.random() * energyLevels.length);
    
    choreItem.innerHTML = `
        <input type="checkbox" id="${choreId}">
        <label for="${choreId}">${choreText}</label>
        <span class="energy-badge ${energyLevels[randomEnergy]}">${energyTexts[randomEnergy]}</span>
    `;
    
    // Insert before the add-chore div
    choresList.insertBefore(choreItem, choresList.lastElementChild);
    
    // Set up checkbox for new chore
    const checkbox = document.getElementById(choreId);
    checkbox.addEventListener('change', function() {
        if (this.checked) {
            this.parentElement.style.opacity = '0.6';
            this.parentElement.style.textDecoration = 'line-through';
        } else {
            this.parentElement.style.opacity = '1';
            this.parentElement.style.textDecoration = 'none';
        }
    });
}

function setupWeatherForecast() {
    const getForecastBtn = document.getElementById('getForecastBtn');
    
    getForecastBtn.addEventListener('click', function() {
        const cityInput = document.getElementById('cityInput').value.trim();
        if (cityInput) {
            getWeatherData(cityInput);
        } else {
            alert('Please enter a city name');
        }
    });
}

// Mock weather data function - in a real app, you would call a weather API
function getWeatherData(city) {
    const forecastSummary = document.getElementById('forecastSummary');
    
    // Show loading state
    forecastSummary.innerHTML = '<div class="weather-placeholder"><i class="fas fa-spinner fa-spin"></i><p>Loading weather data...</p></div>';
    
    // Simulate API delay
    setTimeout(() => {
        // Mock data - in a real app, you would use actual API data
        const mockWeatherData = {
            city: city,
            temp: Math.floor(Math.random() * 15) + 15, // Random temp between 15-30°C
            condition: ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy'][Math.floor(Math.random() * 4)],
            humidity: Math.floor(Math.random() * 50) + 30,
            wind: (Math.random() * 15 + 5).toFixed(1),
            icon: ['sun', 'cloud', 'cloud-rain', 'cloud-sun'][Math.floor(Math.random() * 4)]
        };
        
        displayWeatherData(mockWeatherData);
    }, 1000);
}

function displayWeatherData(data) {
    const forecastSummary = document.getElementById('forecastSummary');
    
    forecastSummary.innerHTML = `
        <div class="weather-data">
            <div class="weather-main">
                <div>
                    <h3>${data.city}</h3>
                    <p>${data.condition}</p>
                </div>
                <div class="weather-temp">${data.temp}°C</div>
                <i class="fas fa-${data.icon} weather-icon"></i>
            </div>
            <div class="weather-details">
                <div class="weather-detail">
                    <i class="fas fa-tint"></i>
                    <span>Humidity: ${data.humidity}%</span>
                </div>
                <div class="weather-detail">
                    <i class="fas fa-wind"></i>
                    <span>Wind: ${data.wind} km/h</span>
                </div>
                <div class="weather-detail">
                    <i class="fas fa-calendar-alt"></i>
                    <span>${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
                </div>
                <div class="weather-detail">
                    <i class="fas fa-clock"></i>
                    <span>Updated: ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
            </div>
        </div>
    `;
    
    // Update optimal times based on weather
    updateOptimalTimes(data.condition, data.temp);
}

function updateOptimalTimes(condition, temp) {
    const morningSlot = document.querySelector('.morning p');
    const afternoonSlot = document.querySelector('.afternoon p');
    
    if (condition === 'Sunny' && temp > 25) {
        morningSlot.textContent = 'Cool temperatures, best for outdoor chores';
        afternoonSlot.textContent = 'Hot, better for indoor tasks with AC';
    } else if (condition === 'Rainy') {
        morningSlot.textContent = 'Light rain expected, good for indoor chores';
        afternoonSlot.textContent = 'Heavier rain predicted, avoid outdoor tasks';
    } else {
        morningSlot.textContent = 'Cool temperatures, high energy';
        afternoonSlot.textContent = 'Moderate temperatures, good light';
    }
}

function setupCheckboxes() {
    const checkboxes = document.querySelectorAll('.chore-item input[type="checkbox"]');
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                this.parentElement.style.opacity = '0.6';
                this.parentElement.style.textDecoration = 'line-through';
            } else {
                this.parentElement.style.opacity = '1';
                this.parentElement.style.textDecoration = 'none';
            }
        });
    });
}