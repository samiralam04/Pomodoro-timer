document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const themeToggle = document.getElementById('theme-toggle');
  const timerTabs = document.querySelectorAll('.timer-tab');
  const timeDisplay = document.getElementById('time-display');
  const timerState = document.getElementById('timer-state');
  const progressCircle = document.getElementById('progress-circle');
  const startStopBtn = document.getElementById('start-stop');
  const resetBtn = document.getElementById('reset');
  const notification = document.getElementById('notification');
  const waterReminder = document.getElementById('water-reminder');
  
  // Section toggles
  const toggleTasksBtn = document.getElementById('toggle-tasks');
  const togglePlannerBtn = document.getElementById('toggle-planner');
  const toggleHabitsBtn = document.getElementById('toggle-habits');
  const toggleSocialBtn = document.getElementById('toggle-social');
  
  // Task elements
  const taskList = document.getElementById('task-list');
  const newTaskInput = document.getElementById('new-task');
  const addTaskBtn = document.getElementById('add-task');
  const tasksContainer = document.getElementById('tasks');
  
  // Planner elements
  const plannerContainer = document.querySelector('.planner-container');
  const prevDayBtn = document.getElementById('prev-day');
  const nextDayBtn = document.getElementById('next-day');
  const plannerDate = document.getElementById('planner-date');
  const timeSlots = document.getElementById('time-slots');
  const addSessionBtn = document.getElementById('add-session');
  const sessionModal = document.getElementById('session-modal');
  const closeModal = document.querySelector('.close-modal');
  const saveSessionBtn = document.getElementById('save-session');
  const sessionTimeInput = document.getElementById('session-time');
  const sessionDurationInput = document.getElementById('session-duration');
  const sessionTaskInput = document.getElementById('session-task');
  
  // Habits elements
  const habitsContainer = document.querySelector('.habits-container');
  const habitsList = document.getElementById('habits-list');
  const newHabitInput = document.getElementById('new-habit');
  const addHabitBtn = document.getElementById('add-habit');
  
  // Analytics elements
  const analyticsTabs = document.querySelectorAll('.analytics-tab');
  const productivityChartCtx = document.getElementById('productivityChart').getContext('2d');
  let productivityChart;
  
  // Music player elements
  const musicButtons = document.querySelectorAll('.music-btn');
  const rainSound = document.getElementById('rain-sound');
  const forestSound = document.getElementById('forest-sound');
  const coffeeSound = document.getElementById('coffee-sound');
  const wavesSound = document.getElementById('waves-sound');
  const volumeSlider = document.getElementById('volume-slider');
  
  // Social elements
  const socialContainer = document.querySelector('.social-container');
  const shareMessage = document.getElementById('share-message');
  const shareButton = document.getElementById('share-button');
  const partnersList = document.getElementById('partners-list');
  const addPartnerBtn = document.getElementById('add-partner');
  const partnerModal = document.getElementById('partner-modal');
  const closePartnerModal = partnerModal.querySelector('.close-modal');
  const savePartnerBtn = document.getElementById('save-partner');
  const partnerNameInput = document.getElementById('partner-name');
  const partnerEmailInput = document.getElementById('partner-email');
  
  // Quote elements
  const quoteText = document.getElementById('quote-text');
  const quoteAuthor = document.getElementById('quote-author');
  
  // Audio Elements
  const alarmSound = document.getElementById('alarm-sound');
  const clickSound = document.getElementById('click-sound');
  const tickSound = document.getElementById('tick-sound');
  
  // Timer Settings
  const focusMinutesInput = document.getElementById('focus-minutes');
  const shortBreakMinutesInput = document.getElementById('short-break-minutes');
  const longBreakMinutesInput = document.getElementById('long-break-minutes');
  const longBreakIntervalInput = document.getElementById('long-break-interval');
  const autoStartCheckbox = document.getElementById('auto-start');
  const muteToggleCheckbox = document.getElementById('mute-toggle');
  
  // Stats Elements
  const sessionCount = document.getElementById('session-count');
  const focusedMinutes = document.getElementById('focused-minutes');
  const dailyStreak = document.getElementById('daily-streak');
  
  // Timer Variables
  let timer;
  let timeLeft = 25 * 60;
  let isRunning = false;
  let currentMode = 'pomodoro';
  let sessionsCompleted = 0;
  let totalMinutesFocused = 0;
  let streak = 0;
  let currentSound = null;
  
  // Achievements
  const achievements = [
    {
      id: 'first-session',
      name: 'First Step',
      description: 'Complete your first Pomodoro session',
      icon: 'fa-star',
      condition: (stats) => stats.sessions >= 1,
      unlocked: false
    },
    {
      id: 'marathon',
      name: 'Marathon',
      description: 'Complete 5 sessions in one day',
      icon: 'fa-running',
      condition: (stats) => stats.dailySessions >= 5,
      unlocked: false
    },
    {
      id: 'streak-3',
      name: '3-Day Streak',
      description: 'Maintain a 3-day streak',
      icon: 'fa-fire',
      condition: (stats) => stats.streak >= 3,
      unlocked: false
    },
    {
      id: 'streak-7',
      name: '7-Day Streak',
      description: 'Maintain a 7-day streak',
      icon: 'fa-burn',
      condition: (stats) => stats.streak >= 7,
      unlocked: false
    },
    {
      id: 'task-master',
      name: 'Task Master',
      description: 'Complete 10 tasks',
      icon: 'fa-tasks',
      condition: (stats) => stats.completedTasks >= 10,
      unlocked: false
    },
    {
      id: 'early-bird',
      name: 'Early Bird',
      description: 'Complete a session before 8 AM',
      icon: 'fa-sun',
      condition: (stats) => stats.earlySessions > 0,
      unlocked: false
    },
    {
      id: 'night-owl',
      name: 'Night Owl',
      description: 'Complete a session after 10 PM',
      icon: 'fa-moon',
      condition: (stats) => stats.lateSessions > 0,
      unlocked: false
    },
    {
      id: 'weekend-warrior',
      name: 'Weekend Warrior',
      description: 'Complete sessions on both weekend days',
      icon: 'fa-umbrella-beach',
      condition: (stats) => stats.weekendSessions >= 2,
      unlocked: false
    }
  ];
  
  let currentPlannerDate = new Date();
  currentPlannerDate.setHours(0, 0, 0, 0);

  // Initialize
  updateTimerDisplay();
  loadSettings();
  loadTasks();
  loadStats();
  loadAchievements();
  loadMusicSettings();
  getRandomQuote();
  setupWaterReminder();
  
  // Event Listeners
  themeToggle.addEventListener('click', toggleTheme);
  timerTabs.forEach(tab => tab.addEventListener('click', switchMode));
  startStopBtn.addEventListener('click', toggleTimer);
  resetBtn.addEventListener('click', resetTimer);
  
  // Section toggles
  toggleTasksBtn.addEventListener('click', toggleTaskList);
  togglePlannerBtn.addEventListener('click', togglePlanner);
  toggleHabitsBtn.addEventListener('click', toggleHabits);
  toggleSocialBtn.addEventListener('click', toggleSocial);
  
  // Task events
  addTaskBtn.addEventListener('click', addTask);
  newTaskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
  });
  
  // Planner events
  prevDayBtn.addEventListener('click', () => changePlannerDate(-1));
  nextDayBtn.addEventListener('click', () => changePlannerDate(1));
  addSessionBtn.addEventListener('click', openSessionModal);
  closeModal.addEventListener('click', closeSessionModal);
  saveSessionBtn.addEventListener('click', saveSession);
  
  // Habits events
  addHabitBtn.addEventListener('click', addHabit);
  newHabitInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addHabit();
  });
  
  // Analytics events
  analyticsTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      analyticsTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      updateAnalytics(tab.dataset.period);
    });
  });
  
  // Music player events
  musicButtons.forEach(btn => {
    btn.addEventListener('click', () => toggleSound(btn.dataset.sound));
  });
  volumeSlider.addEventListener('input', updateVolume);
  
  // Social events
  shareButton.addEventListener('click', shareProgress);
  addPartnerBtn.addEventListener('click', () => partnerModal.classList.add('show'));
  closePartnerModal.addEventListener('click', () => partnerModal.classList.remove('show'));
  savePartnerBtn.addEventListener('click', addAccountabilityPartner);
  
  // Water reminder
  waterReminder.addEventListener('click', () => {
    showNotification('💧 Remember to stay hydrated!', 'info');
    resetWaterReminder();
  });
  
  // Settings Inputs
  focusMinutesInput.addEventListener('change', saveSettings);
  shortBreakMinutesInput.addEventListener('change', saveSettings);
  longBreakMinutesInput.addEventListener('change', saveSettings);
  longBreakIntervalInput.addEventListener('change', saveSettings);
  autoStartCheckbox.addEventListener('change', saveSettings);
  muteToggleCheckbox.addEventListener('change', saveSettings);
  
  // Functions
  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    themeToggle.innerHTML = newTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    localStorage.setItem('theme', newTheme);
  }
  
  function switchMode(e) {
    const mode = e.currentTarget.dataset.mode;
    currentMode = mode;
    
    // Update active tab
    timerTabs.forEach(tab => tab.classList.remove('active'));
    e.currentTarget.classList.add('active');
    
    // Update timer state text
    let stateText = '';
    let icon = '';
    
    switch(mode) {
      case 'pomodoro':
        timeLeft = parseInt(focusMinutesInput.value) * 60;
        stateText = 'Focus Time';
        icon = '<i class="fas fa-brain"></i>';
        progressCircle.style.stroke = 'var(--primary-color)';
        break;
      case 'short-break':
        timeLeft = parseInt(shortBreakMinutesInput.value) * 60;
        stateText = 'Short Break';
        icon = '<i class="fas fa-coffee"></i>';
        progressCircle.style.stroke = 'var(--break-color)';
        break;
      case 'long-break':
        timeLeft = parseInt(longBreakMinutesInput.value) * 60;
        stateText = 'Long Break';
        icon = '<i class="fas fa-umbrella-beach"></i>';
        progressCircle.style.stroke = 'var(--accent-color)';
        break;
    }
    
    timerState.innerHTML = `${icon} <span>${stateText}</span>`;
    updateTimerDisplay();
    resetProgressCircle();
    
    // Stop timer if running
    if (isRunning) {
      toggleTimer();
    }
  }
  
  function toggleTimer() {
    if (!isRunning) {
      startTimer();
    } else {
      pauseTimer();
    }
  }
  
  function startTimer() {
    if (!isRunning) {
      isRunning = true;
      startStopBtn.innerHTML = '<i class="fas fa-pause"></i><span>Pause</span>';
      
      // Play tick sound if not muted
      if (!muteToggleCheckbox.checked) {
        tickSound.currentTime = 0;
        tickSound.play().catch(e => console.log('Audio play failed:', e));
      }
      
      timer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        
        if (timeLeft <= 0) {
          timerComplete();
        }
      }, 1000);
    }
  }
  
  function pauseTimer() {
    if (isRunning) {
      isRunning = false;
      startStopBtn.innerHTML = '<i class="fas fa-play"></i><span>Start</span>';
      clearInterval(timer);
      
      // Pause tick sound
      tickSound.pause();
    }
  }
  
  function resetTimer() {
    pauseTimer();
    
    switch(currentMode) {
      case 'pomodoro':
        timeLeft = parseInt(focusMinutesInput.value) * 60;
        break;
      case 'short-break':
        timeLeft = parseInt(shortBreakMinutesInput.value) * 60;
        break;
      case 'long-break':
        timeLeft = parseInt(longBreakMinutesInput.value) * 60;
        break;
    }
    
    updateTimerDisplay();
    resetProgressCircle();
    
    // Play click sound if not muted
    if (!muteToggleCheckbox.checked) {
      clickSound.currentTime = 0;
      clickSound.play().catch(e => console.log('Audio play failed:', e));
    }
  }
  
  function timerComplete() {
    clearInterval(timer);
    isRunning = false;
    startStopBtn.innerHTML = '<i class="fas fa-play"></i><span>Start</span>';
    
    // Play alarm sound if not muted
    if (!muteToggleCheckbox.checked) {
      alarmSound.currentTime = 0;
      alarmSound.play().catch(e => console.log('Audio play failed:', e));
    }
    
    // Show notification
    let message = '';
    if (currentMode === 'pomodoro') {
      sessionsCompleted++;
      totalMinutesFocused += parseInt(focusMinutesInput.value);
      updateStats();
      updateHistoricalData();
      message = 'Focus session complete! Time for a break.';
      
      // Check if it's time for a long break
      if (sessionsCompleted % parseInt(longBreakIntervalInput.value) === 0) {
        setTimeout(() => {
          document.querySelector('.timer-tab[data-mode="long-break"]').click();
          if (autoStartCheckbox.checked) {
            setTimeout(() => startStopBtn.click(), 1000);
          }
        }, 1000);
      } else {
        setTimeout(() => {
          document.querySelector('.timer-tab[data-mode="short-break"]').click();
          if (autoStartCheckbox.checked) {
            setTimeout(() => startStopBtn.click(), 1000);
          }
        }, 1000);
      }
    } else {
      message = 'Break time over! Ready to focus?';
      setTimeout(() => {
        document.querySelector('.timer-tab[data-mode="pomodoro"]').click();
        if (autoStartCheckbox.checked) {
          setTimeout(() => startStopBtn.click(), 1000);
        }
      }, 1000);
    }
    
    showNotification(message, 'success');
    
    // Check for completed tasks
    checkCompletedTasks();
    // Check for scheduled sessions
    checkScheduledSession();
    // Check achievements
    checkAchievements();
  }
  
  function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Update progress circle
    updateProgressCircle();
  }
  
  function updateProgressCircle() {
    let totalTime = 0;
    switch(currentMode) {
      case 'pomodoro':
        totalTime = parseInt(focusMinutesInput.value) * 60;
        break;
      case 'short-break':
        totalTime = parseInt(shortBreakMinutesInput.value) * 60;
        break;
      case 'long-break':
        totalTime = parseInt(longBreakMinutesInput.value) * 60;
        break;
    }
    
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (timeLeft / totalTime) * circumference;
    progressCircle.style.strokeDashoffset = offset;
  }
  
  function resetProgressCircle() {
    progressCircle.style.strokeDashoffset = 628;
  }
  
  function showNotification(message, type) {
    notification.className = `notification ${type} show`;
    notification.querySelector('.notification-message').textContent = message;
    
    setTimeout(() => {
      notification.classList.remove('show');
      notification.classList.add('hide');
      setTimeout(() => {
        notification.classList.remove('hide');
      }, 500);
    }, 3000);
  }
  
  function saveSettings() {
    const settings = {
      focusMinutes: focusMinutesInput.value,
      shortBreakMinutes: shortBreakMinutesInput.value,
      longBreakMinutes: longBreakMinutesInput.value,
      longBreakInterval: longBreakIntervalInput.value,
      autoStart: autoStartCheckbox.checked,
      mute: muteToggleCheckbox.checked
    };
    
    localStorage.setItem('timerSettings', JSON.stringify(settings));
    
    // Update timer if current mode matches the changed setting
    if (!isRunning) {
      switch(currentMode) {
        case 'pomodoro':
          timeLeft = parseInt(focusMinutesInput.value) * 60;
          break;
        case 'short-break':
          timeLeft = parseInt(shortBreakMinutesInput.value) * 60;
          break;
        case 'long-break':
          timeLeft = parseInt(longBreakMinutesInput.value) * 60;
          break;
      }
      updateTimerDisplay();
    }
  }
  
  function loadSettings() {
    const savedSettings = localStorage.getItem('timerSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      focusMinutesInput.value = settings.focusMinutes;
      shortBreakMinutesInput.value = settings.shortBreakMinutes;
      longBreakMinutesInput.value = settings.longBreakMinutes;
      longBreakIntervalInput.value = settings.longBreakInterval;
      autoStartCheckbox.checked = settings.autoStart;
      muteToggleCheckbox.checked = settings.mute;
      
      // Update timer based on loaded settings
      timeLeft = parseInt(focusMinutesInput.value) * 60;
      updateTimerDisplay();
    }
    
    // Load theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeToggle.innerHTML = savedTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
  }
  
  function toggleTaskList() {
    taskList.classList.toggle('show');
    toggleTasksBtn.innerHTML = taskList.classList.contains('show') 
      ? '<i class="fas fa-times"></i><span>Hide Task List</span>' 
      : '<i class="fas fa-tasks"></i><span>Show Task List</span>';
  }
  
  function addTask() {
    const taskText = newTaskInput.value.trim();
    if (taskText) {
      const taskId = Date.now();
      const taskItem = document.createElement('li');
      taskItem.className = 'task-item';
      taskItem.innerHTML = `
        <input type="checkbox" class="task-checkbox" id="task-${taskId}" data-id="${taskId}" />
        <label class="task-text" for="task-${taskId}">${taskText}</label>
        <button class="task-delete" data-id="${taskId}">
          <i class="fas fa-trash"></i>
        </button>
      `;
      tasksContainer.appendChild(taskItem);
      newTaskInput.value = '';
      
      // Add event listeners
      const checkbox = taskItem.querySelector('.task-checkbox');
      const deleteBtn = taskItem.querySelector('.task-delete');
      
      checkbox.addEventListener('change', toggleTaskComplete);
      deleteBtn.addEventListener('click', deleteTask);
      
      // Save tasks
      saveTasks();
    }
  }
  
  function toggleTaskComplete(e) {
    const taskId = e.target.dataset.id;
    const taskText = e.target.nextElementSibling;
    taskText.classList.toggle('completed');
    saveTasks();
  }
  
  function deleteTask(e) {
    const taskId = e.currentTarget.dataset.id;
    const taskItem = document.querySelector(`.task-checkbox[data-id="${taskId}"]`).parentNode;
    taskItem.remove();
    saveTasks();
  }
  
  function saveTasks() {
    const tasks = [];
    document.querySelectorAll('.task-item').forEach(item => {
      tasks.push({
        id: item.querySelector('.task-checkbox').dataset.id,
        text: item.querySelector('.task-text').textContent,
        completed: item.querySelector('.task-checkbox').checked
      });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
  
  function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      const tasks = JSON.parse(savedTasks);
      tasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.className = 'task-item';
        taskItem.innerHTML = `
          <input type="checkbox" class="task-checkbox" id="task-${task.id}" data-id="${task.id}" ${task.completed ? 'checked' : ''} />
          <label class="task-text ${task.completed ? 'completed' : ''}" for="task-${task.id}">${task.text}</label>
          <button class="task-delete" data-id="${task.id}">
            <i class="fas fa-trash"></i>
          </button>
        `;
        tasksContainer.appendChild(taskItem);
        
        // Add event listeners
        const checkbox = taskItem.querySelector('.task-checkbox');
        const deleteBtn = taskItem.querySelector('.task-delete');
        
        checkbox.addEventListener('change', toggleTaskComplete);
        deleteBtn.addEventListener('click', deleteTask);
      });
    }
  }
  
  function checkCompletedTasks() {
    const completedTasks = document.querySelectorAll('.task-checkbox:checked');
    if (completedTasks.length > 0) {
      showNotification(`🎉 Great job! You've completed ${completedTasks.length} task(s)!`, 'success');
    }
  }
  
  function updateStats() {
    sessionCount.textContent = sessionsCompleted;
    focusedMinutes.textContent = totalMinutesFocused;
    
    // Simple streak counter - in a real app, you'd track dates
    if (sessionsCompleted > 0) {
      streak = Math.floor(sessionsCompleted / 2);
      dailyStreak.textContent = streak;
    }
    
    saveStats();
  }
  
  function loadStats() {
    const savedStats = localStorage.getItem('timerStats');
    if (savedStats) {
      const stats = JSON.parse(savedStats);
      sessionsCompleted = stats.sessions || 0;
      totalMinutesFocused = stats.minutes || 0;
      streak = stats.streak || 0;
      
      sessionCount.textContent = sessionsCompleted;
      focusedMinutes.textContent = totalMinutesFocused;
      dailyStreak.textContent = streak;
    }
  }
  
  function saveStats() {
    const stats = {
      sessions: sessionsCompleted,
      minutes: totalMinutesFocused,
      streak: streak
    };
    localStorage.setItem('timerStats', JSON.stringify(stats));
  }
  
  function getRandomQuote() {
    const quotes = [
      {
        text: "The key is not to prioritize what's on your schedule, but to schedule your priorities.",
        author: "Stephen Covey"
      },
      {
        text: "Productivity is never an accident. It is always the result of a commitment to excellence, intelligent planning, and focused effort.",
        author: "Paul J. Meyer"
      },
      {
        text: "Concentrate all your thoughts upon the work at hand. The sun's rays do not burn until brought to a focus.",
        author: "Alexander Graham Bell"
      },
      {
        text: "You don't have to see the whole staircase, just take the first step.",
        author: "Martin Luther King Jr."
      },
      {
        text: "The secret of getting ahead is getting started.",
        author: "Mark Twain"
      },
      {
        text: "Focus on being productive instead of busy.",
        author: "Tim Ferriss"
      },
      {
        "text": "You will never find time for anything. If you want time, you must make it.",
        "author": "Charles Buxton"
      },
      {
        "text": "What gets scheduled gets done.",
        "author": "Michael Hyatt"
      },
      {
        "text": "Don’t be busy. Be productive.",
        "author": "Unknown"
      },
      {
        "text": "Ordinary people think merely of spending time; great people think of using it.",
        "author": "Arthur Schopenhauer"
      },
      {
        "text": "The bad news is time flies. The good news is you’re the pilot.",
        "author": "Michael Altshuler"
      },
      {
        "text": "Either you run the day, or the day runs you.",
        "author": "Jim Rohn"
      },
      {
        "text": "A goal without a plan is just a wish.",
        "author": "Antoine de Saint‑Exupéry"
      },
      {
        "text": "Focus on being productive instead of busy.",
        "author": "Tim Ferriss"
      },
      {
        "text": "The future depends on what you do today.",
        "author": "Mahatma Gandhi"
      },
      {
        "text": "Success is the sum of small efforts repeated day in and day out.",
        "author": "Robert Collier"
      }
    ];
    
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    quoteText.textContent = `"${randomQuote.text}"`;
    quoteAuthor.textContent = `— ${randomQuote.author}`;
    
    // Change quote every 30 seconds
    setInterval(getRandomQuote, 30000);
  }
  
  function setupWaterReminder() {
    // Show reminder every 20 minutes (for demo purposes - in real app would be longer)
    setTimeout(() => {
      waterReminder.classList.add('animate__pulse');
      showNotification('💧 Time to hydrate! Click the water drop.', 'info');
    }, 20 * 60 * 1000);
  }
  
  function resetWaterReminder() {
    waterReminder.classList.remove('animate__pulse');
    // Set next reminder
    setTimeout(() => {
      waterReminder.classList.add('animate__pulse');
      showNotification('💧 Time to hydrate! Click the water drop.', 'info');
    }, 20 * 60 * 1000);
  }
  
  /* Planner Functions */
  function togglePlanner() {
    plannerContainer.classList.toggle('show');
    togglePlannerBtn.innerHTML = plannerContainer.classList.contains('show') 
      ? '<i class="fas fa-times"></i><span>Hide Planner</span>' 
      : '<i class="fas fa-calendar-alt"></i><span>Show Planner</span>';
    
    if (plannerContainer.classList.contains('show')) {
      renderPlanner();
    }
  }
  
  function changePlannerDate(days) {
    currentPlannerDate.setDate(currentPlannerDate.getDate() + days);
    renderPlanner();
  }
  
  function renderPlanner() {
    // Format date display
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const diffDays = Math.round((currentPlannerDate - today) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      plannerDate.textContent = 'Today';
    } else if (diffDays === 1) {
      plannerDate.textContent = 'Tomorrow';
    } else if (diffDays === -1) {
      plannerDate.textContent = 'Yesterday';
    } else {
      plannerDate.textContent = currentPlannerDate.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    }
    
    // Disable next day button if it's more than 7 days in future
    nextDayBtn.disabled = diffDays > 7;
    
    // Load sessions for this date
    const dateKey = currentPlannerDate.toISOString().split('T')[0];
    const savedSessions = JSON.parse(localStorage.getItem('scheduledSessions')) || {};
    const daySessions = savedSessions[dateKey] || [];
    
    // Sort sessions by time
    daySessions.sort((a, b) => a.time.localeCompare(b.time));
    
    // Clear current slots
    timeSlots.innerHTML = '';
    
    if (daySessions.length === 0) {
      timeSlots.innerHTML = '<p class="empty-planner">No sessions scheduled for this day.</p>';
      return;
    }
    
    // Create time slots
    daySessions.forEach((session, index) => {
      const sessionTime = new Date(`${dateKey}T${session.time}`);
      const now = new Date();
      
      const timeSlot = document.createElement('div');
      timeSlot.className = 'time-slot';
      
      if (session.completed) {
        timeSlot.classList.add('completed');
      } else if (currentPlannerDate < today || (currentPlannerDate.getTime() === today.getTime() && sessionTime < now)) {
        timeSlot.classList.add('missed');
      }
      
      timeSlot.innerHTML = `
        <div class="time-slot-time">${formatTime(session.time)}</div>
        <div class="time-slot-duration">${session.duration} min</div>
        <div class="time-slot-task" title="${session.task || 'No task specified'}">${session.task || ''}</div>
        <div class="time-slot-actions">
          <button class="time-slot-action complete-btn" data-index="${index}">
            <i class="fas fa-check"></i>
          </button>
          <button class="time-slot-action delete-btn" data-index="${index}">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `;
      
      timeSlots.appendChild(timeSlot);
    });
    
    // Add event listeners to action buttons
    document.querySelectorAll('.complete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => toggleSessionComplete(e.target.closest('.complete-btn').dataset.index, dateKey));
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => deleteSession(e.target.closest('.delete-btn').dataset.index, dateKey));
    });
  }
  
  function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), date.setMinutes(parseInt(minutes)));
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }
  
  function openSessionModal() {
    sessionModal.classList.add('show');
  }
  
  function closeSessionModal() {
    sessionModal.classList.remove('show');
  }
  
  function saveSession() {
    const time = sessionTimeInput.value;
    const duration = parseInt(sessionDurationInput.value);
    const task = sessionTaskInput.value.trim();
    
    if (!time || isNaN(duration) || duration < 1) {
      showNotification('Please enter valid time and duration', 'error');
      return;
    }
    
    const dateKey = currentPlannerDate.toISOString().split('T')[0];
    const savedSessions = JSON.parse(localStorage.getItem('scheduledSessions')) || {};
    const daySessions = savedSessions[dateKey] || [];
    
    daySessions.push({
      time,
      duration,
      task,
      completed: false
    });
    
    savedSessions[dateKey] = daySessions;
    localStorage.setItem('scheduledSessions', JSON.stringify(savedSessions));
    
    closeSessionModal();
    renderPlanner();
    showNotification('Session scheduled successfully!', 'success');
    
    // Clear inputs
    sessionTimeInput.value = '';
    sessionDurationInput.value = '25';
    sessionTaskInput.value = '';
  }
  
  function toggleSessionComplete(index, dateKey) {
    const savedSessions = JSON.parse(localStorage.getItem('scheduledSessions')) || {};
    const daySessions = savedSessions[dateKey] || [];
    
    if (index >= 0 && index < daySessions.length) {
      daySessions[index].completed = !daySessions[index].completed;
      savedSessions[dateKey] = daySessions;
      localStorage.setItem('scheduledSessions', JSON.stringify(savedSessions));
      renderPlanner();
    }
  }
  
  function deleteSession(index, dateKey) {
    const savedSessions = JSON.parse(localStorage.getItem('scheduledSessions')) || {};
    const daySessions = savedSessions[dateKey] || [];
    
    if (index >= 0 && index < daySessions.length) {
      daySessions.splice(index, 1);
      savedSessions[dateKey] = daySessions;
      localStorage.setItem('scheduledSessions', JSON.stringify(savedSessions));
      renderPlanner();
    }
  }
  
  function checkScheduledSession() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dateKey = today.toISOString().split('T')[0];
    
    const savedSessions = JSON.parse(localStorage.getItem('scheduledSessions')) || {};
    const daySessions = savedSessions[dateKey] || [];
    
    // Find sessions within current hour
    const currentHour = now.getHours();
    const relevantSessions = daySessions.filter(session => {
      const sessionHour = parseInt(session.time.split(':')[0]);
      return !session.completed && sessionHour === currentHour;
    });
    
    if (relevantSessions.length > 0) {
      showNotification(`⏰ Don't forget your scheduled session at ${formatTime(relevantSessions[0].time)}!`, 'info');
    }
  }
  
  /* Habits Functions */
  function toggleHabits() {
    habitsContainer.classList.toggle('show');
    toggleHabitsBtn.innerHTML = habitsContainer.classList.contains('show') 
      ? '<i class="fas fa-times"></i><span>Hide Habits</span>' 
      : '<i class="fas fa-check-circle"></i><span>Show Habits</span>';
    
    if (habitsContainer.classList.contains('show')) {
      loadHabits();
    }
  }
  
  function loadHabits() {
    const today = new Date().toISOString().split('T')[0];
    const savedHabits = JSON.parse(localStorage.getItem('habits')) || {};
    
    // Initialize if no habits for today
    if (!savedHabits[today]) {
      savedHabits[today] = {
        habits: [],
        completed: []
      };
      localStorage.setItem('habits', JSON.stringify(savedHabits));
    }
    
    renderHabits(today, savedHabits[today]);
  }
  
  function renderHabits(date, dayHabits) {
    habitsList.innerHTML = '';
    
    if (dayHabits.habits.length === 0) {
      habitsList.innerHTML = '<p class="empty-habits">No habits added for today. Add your first habit!</p>';
      return;
    }
    
    dayHabits.habits.forEach((habit, index) => {
      const habitEl = document.createElement('div');
      habitEl.className = 'habit-item';
      habitEl.innerHTML = `
        <input type="checkbox" class="habit-checkbox" id="habit-${date}-${index}" 
          data-index="${index}" ${dayHabits.completed.includes(index) ? 'checked' : ''}>
        <label class="habit-text ${dayHabits.completed.includes(index) ? 'completed' : ''}" 
          for="habit-${date}-${index}">${habit}</label>
        <button class="habit-delete" data-index="${index}">
          <i class="fas fa-trash"></i>
        </button>
      `;
      habitsList.appendChild(habitEl);
      
      // Add event listeners
      const checkbox = habitEl.querySelector('.habit-checkbox');
      const deleteBtn = habitEl.querySelector('.habit-delete');
      
      checkbox.addEventListener('change', () => toggleHabitComplete(date, index));
      deleteBtn.addEventListener('click', () => deleteHabit(date, index));
    });
  }
  
  function addHabit() {
    const habitText = newHabitInput.value.trim();
    if (habitText) {
      const today = new Date().toISOString().split('T')[0];
      const savedHabits = JSON.parse(localStorage.getItem('habits')) || {};
      
      if (!savedHabits[today]) {
        savedHabits[today] = {
          habits: [],
          completed: []
        };
      }
      
      savedHabits[today].habits.push(habitText);
      localStorage.setItem('habits', JSON.stringify(savedHabits));
      
      newHabitInput.value = '';
      renderHabits(today, savedHabits[today]);
    }
  }
  
  function toggleHabitComplete(date, index) {
    const savedHabits = JSON.parse(localStorage.getItem('habits')) || {};
    const dayHabits = savedHabits[date] || { habits: [], completed: [] };
    
    const completedIndex = dayHabits.completed.indexOf(index);
    if (completedIndex === -1) {
      dayHabits.completed.push(index);
    } else {
      dayHabits.completed.splice(completedIndex, 1);
    }
    
    savedHabits[date] = dayHabits;
    localStorage.setItem('habits', JSON.stringify(savedHabits));
    renderHabits(date, dayHabits);
    
    // Check if all habits are completed
    if (dayHabits.completed.length === dayHabits.habits.length && dayHabits.habits.length > 0) {
      showNotification('🎉 All habits completed for today! Great job!', 'success');
    }
  }
  
  function deleteHabit(date, index) {
    const savedHabits = JSON.parse(localStorage.getItem('habits')) || {};
    const dayHabits = savedHabits[date] || { habits: [], completed: [] };
    
    // Remove from habits array
    dayHabits.habits.splice(index, 1);
    
    // Remove from completed array and adjust indices
    dayHabits.completed = dayHabits.completed
      .filter(i => i !== index)
      .map(i => i > index ? i - 1 : i);
    
    savedHabits[date] = dayHabits;
    localStorage.setItem('habits', JSON.stringify(savedHabits));
    renderHabits(date, dayHabits);
  }
  
  /* Analytics Functions */
  function loadHistoricalData() {
    return JSON.parse(localStorage.getItem('historicalData')) || {
      daily: {},
      weekly: {},
      monthly: {}
    };
  }
  
  function saveHistoricalData(data) {
    localStorage.setItem('historicalData', JSON.stringify(data));
  }
  
  function updateHistoricalData() {
    const now = new Date();
    const dateKey = now.toISOString().split('T')[0];
    const weekKey = `${now.getFullYear()}-W${Math.ceil(((now - new Date(now.getFullYear(), 0, 1)) / 86400000 + 1) / 7)}`;
    const monthKey = `${now.getFullYear()}-${now.getMonth() + 1}`;
    
    const historicalData = loadHistoricalData();
    
    // Update daily data
    if (!historicalData.daily[dateKey]) {
      historicalData.daily[dateKey] = {
        sessions: 0,
        minutes: 0,
        completed: 0
      };
    }
    historicalData.daily[dateKey].sessions += 1;
    historicalData.daily[dateKey].minutes += parseInt(focusMinutesInput.value);
    historicalData.daily[dateKey].completed += 1;
    
    // Update weekly data
    if (!historicalData.weekly[weekKey]) {
      historicalData.weekly[weekKey] = {
        sessions: 0,
        minutes: 0,
        completed: 0
      };
    }
    historicalData.weekly[weekKey].sessions += 1;
    historicalData.weekly[weekKey].minutes += parseInt(focusMinutesInput.value);
    historicalData.weekly[weekKey].completed += 1;
    
    // Update monthly data
    if (!historicalData.monthly[monthKey]) {
      historicalData.monthly[monthKey] = {
        sessions: 0,
        minutes: 0,
        completed: 0
      };
    }
    historicalData.monthly[monthKey].sessions += 1;
    historicalData.monthly[monthKey].minutes += parseInt(focusMinutesInput.value);
    historicalData.monthly[monthKey].completed += 1;
    
    saveHistoricalData(historicalData);
    updateAnalytics('daily');
  }
  
  function updateAnalytics(period) {
    const historicalData = loadHistoricalData();
    const data = historicalData[period];
    const labels = Object.keys(data).reverse().slice(0, 7);
    const sessionsData = labels.map(date => data[date].sessions);
    const minutesData = labels.map(date => data[date].minutes);
    
    // Update chart
    if (productivityChart) {
      productivityChart.destroy();
    }
    
    productivityChart = new Chart(productivityChartCtx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Sessions',
            data: sessionsData,
            backgroundColor: 'rgba(99, 102, 241, 0.7)',
            borderColor: 'rgba(99, 102, 241, 1)',
            borderWidth: 1
          },
          {
            label: 'Minutes',
            data: minutesData,
            backgroundColor: 'rgba(16, 185, 129, 0.7)',
            borderColor: 'rgba(16, 185, 129, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `${context.dataset.label}: ${context.raw}`;
              }
            }
          }
        }
      }
    });
    
    // Update stats
    const totalSessions = sessionsData.reduce((a, b) => a + b, 0);
    const totalMinutes = minutesData.reduce((a, b) => a + b, 0);
    const avgSessions = totalSessions / (sessionsData.length || 1);
    
    document.getElementById('avg-focus').textContent = `${Math.round(avgSessions * 10) / 10}/day`;
    
    // Find best day
    let maxSessions = 0;
    let bestDay = 'None';
    labels.forEach((date, index) => {
      if (sessionsData[index] > maxSessions) {
        maxSessions = sessionsData[index];
        bestDay = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
      }
    });
    document.getElementById('best-day').textContent = bestDay;
    
    // Calculate completion rate
    const totalPossible = labels.length * 4; // Assuming 4 sessions per day as target
    const completionRate = totalSessions / totalPossible * 100 || 0;
    document.getElementById('completion-rate').textContent = `${Math.round(completionRate)}%`;
    
    // Generate insights
    generateInsights(labels, sessionsData, minutesData);
  }
  
  function generateInsights(labels, sessionsData, minutesData) {
    const insightsContainer = document.getElementById('insights');
    const lastDaySessions = sessionsData[0] || 0;
    const avgSessions = sessionsData.reduce((a, b) => a + b, 0) / (sessionsData.length || 1);
    
    let insightsHTML = '';
    
    if (sessionsData.length === 0) {
      insightsHTML = '<p>Complete a few sessions to get personalized insights!</p>';
    } else {
      if (lastDaySessions > avgSessions * 1.2) {
        insightsHTML += `<p>🔥 <strong>Great job yesterday!</strong> You completed ${lastDaySessions} sessions, which is better than your average of ${Math.round(avgSessions * 10) / 10}.</p>`;
      } else if (lastDaySessions < avgSessions * 0.8) {
        insightsHTML += `<p>💡 <strong>You can do better!</strong> Yesterday you completed ${lastDaySessions} sessions, below your average of ${Math.round(avgSessions * 10) / 10}. Try starting with smaller tasks to build momentum.</p>`;
      } else {
        insightsHTML += `<p>👍 <strong>Consistent progress!</strong> You're maintaining your average of ${Math.round(avgSessions * 10) / 10} sessions per day.</p>`;
      }
      
      const bestDayIndex = sessionsData.indexOf(Math.max(...sessionsData));
      if (bestDayIndex >= 0) {
        insightsHTML += `<p>⭐ <strong>Your most productive day</strong> was ${labels[bestDayIndex]} with ${sessionsData[bestDayIndex]} sessions. Try scheduling important tasks for similar times.</p>`;
      }
      
      if (sessionsData.length > 3) {
        const lastThreeAvg = sessionsData.slice(0, 3).reduce((a, b) => a + b, 0) / 3;
        const prevAvg = sessionsData.slice(3).reduce((a, b) => a + b, 0) / (sessionsData.length - 3);
        
        if (lastThreeAvg > prevAvg * 1.3) {
          insightsHTML += `<p>🚀 <strong>You're on a roll!</strong> Your last 3 days have been ${Math.round((lastThreeAvg / prevAvg - 1) * 100)}% more productive than before. Keep it up!</p>`;
        } else if (lastThreeAvg < prevAvg * 0.7) {
          insightsHTML += `<p>🔄 <strong>Time to reset.</strong> Your productivity has dipped recently. Try changing your environment or breaking tasks into smaller steps.</p>`;
        }
      }
    }
    
    insightsContainer.innerHTML = insightsHTML;
  }
  
  /* Achievements Functions */
  function loadAchievements() {
    const savedAchievements = localStorage.getItem('achievements');
    if (savedAchievements) {
      const unlockedIds = JSON.parse(savedAchievements);
      achievements.forEach(ach => {
        ach.unlocked = unlockedIds.includes(ach.id);
      });
    }
    renderAchievements();
  }
  
  function saveAchievements() {
    const unlockedIds = achievements.filter(ach => ach.unlocked).map(ach => ach.id);
    localStorage.setItem('achievements', JSON.stringify(unlockedIds));
  }
  
  function renderAchievements() {
    const grid = document.getElementById('achievements-grid');
    grid.innerHTML = '';
    
    achievements.forEach(achievement => {
      const achievementEl = document.createElement('div');
      achievementEl.className = `achievement ${achievement.unlocked ? 'unlocked' : ''}`;
      achievementEl.innerHTML = `
        <i class="fas ${achievement.icon}"></i>
        <div class="achievement-name">${achievement.name}</div>
        <div class="achievement-desc">${achievement.unlocked ? achievement.description : '???'}</div>
      `;
      grid.appendChild(achievementEl);
    });
  }
  
  function checkAchievements() {
    const now = new Date();
    const stats = {
      sessions: sessionsCompleted,
      streak: streak,
      dailySessions: getTodaysSessions(),
      completedTasks: getCompletedTaskCount(),
      earlySessions: now.getHours() < 8 ? 1 : 0,
      lateSessions: now.getHours() >= 22 ? 1 : 0,
      weekendSessions: [0, 6].includes(now.getDay()) ? 1 : 0,
      completedHabits: getCompletedHabitsCount()
    };
    
    let newAchievements = [];
    
    achievements.forEach(achievement => {
      if (!achievement.unlocked && achievement.condition(stats)) {
        achievement.unlocked = true;
        newAchievements.push(achievement);
      }
    });
    
    if (newAchievements.length > 0) {
      saveAchievements();
      renderAchievements();
      showAchievementNotification(newAchievements);
    }
  }
  
  function getTodaysSessions() {
    const historicalData = loadHistoricalData();
    const today = new Date().toISOString().split('T')[0];
    return historicalData.daily[today]?.sessions || 0;
  }
  
  function getCompletedTaskCount() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    return tasks.filter(task => task.completed).length;
  }
  
  function getCompletedHabitsCount() {
    const today = new Date().toISOString().split('T')[0];
    const savedHabits = JSON.parse(localStorage.getItem('habits')) || {};
    const dayHabits = savedHabits[today] || { habits: [], completed: [] };
    return dayHabits.completed.length;
  }
  
  function showAchievementNotification(newAchievements) {
    let message = '';
    if (newAchievements.length === 1) {
      message = `🎉 Achievement Unlocked: ${newAchievements[0].name}!`;
    } else {
      message = `🎉 ${newAchievements.length} New Achievements Unlocked!`;
    }
    
    showNotification(message, 'success');
    
    // Show confetti effect
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }
  
  /* Music Player Functions */
  function toggleSound(soundType) {
    // Stop current sound
    if (currentSound) {
      currentSound.pause();
      document.querySelector(`.music-btn[data-sound="${currentSound.id.replace('-sound', '')}"]`).classList.remove('active');
    }
    
    // If clicking the same button, just stop the sound
    if (currentSound && currentSound.id === `${soundType}-sound`) {
      currentSound = null;
      return;
    }
    
    // Start new sound
    currentSound = document.getElementById(`${soundType}-sound`);
    currentSound.currentTime = 0;
    currentSound.volume = volumeSlider.value;
    currentSound.play().catch(e => console.log('Audio play failed:', e));
    
    // Update UI
    document.querySelector(`.music-btn[data-sound="${soundType}"]`).classList.add('active');
    
    // Save settings
    saveMusicSettings();
  }
  
  function updateVolume() {
    if (currentSound) {
      currentSound.volume = volumeSlider.value;
      saveMusicSettings();
    }
  }
  
  function saveMusicSettings() {
    const settings = {
      currentSound: currentSound ? currentSound.id.replace('-sound', '') : null,
      volume: volumeSlider.value
    };
    localStorage.setItem('musicSettings', JSON.stringify(settings));
  }
  
  function loadMusicSettings() {
    const savedSettings = localStorage.getItem('musicSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      volumeSlider.value = settings.volume;
      
      if (settings.currentSound) {
        setTimeout(() => {
          document.querySelector(`.music-btn[data-sound="${settings.currentSound}"]`).click();
        }, 500);
      }
    }
  }
  
  /* Social Functions */
  function toggleSocial() {
    socialContainer.classList.toggle('show');
    toggleSocialBtn.innerHTML = socialContainer.classList.contains('show') 
      ? '<i class="fas fa-times"></i><span>Hide Accountability</span>' 
      : '<i class="fas fa-users"></i><span>Show Accountability</span>';
    
    if (socialContainer.classList.contains('show')) {
      loadAccountabilityPartners();
    }
  }
  
  function loadAccountabilityPartners() {
    const partners = JSON.parse(localStorage.getItem('accountabilityPartners')) || [];
    renderPartnersList(partners);
  }
  
  function renderPartnersList(partners) {
    partnersList.innerHTML = '';
    
    if (partners.length === 0) {
      partnersList.innerHTML = '<p class="empty-partners">No accountability partners added yet.</p>';
      return;
    }
    
    partners.forEach((partner, index) => {
      const partnerEl = document.createElement('div');
      partnerEl.className = 'partner-item';
      partnerEl.innerHTML = `
        <div class="partner-info">
          <div class="partner-avatar">${partner.name.charAt(0).toUpperCase()}</div>
          <div>
            <div class="partner-name">${partner.name}</div>
            <div class="partner-email">${partner.email}</div>
          </div>
        </div>
        <div class="partner-actions">
          <button class="partner-action message-btn" data-index="${index}">
            <i class="fas fa-envelope"></i>
          </button>
          <button class="partner-action delete-btn" data-index="${index}">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `;
      partnersList.appendChild(partnerEl);
      
      // Add event listeners
      const messageBtn = partnerEl.querySelector('.message-btn');
      const deleteBtn = partnerEl.querySelector('.delete-btn');
      
      messageBtn.addEventListener('click', () => messagePartner(partner.email));
      deleteBtn.addEventListener('click', () => deletePartner(index));
    });
  }
  
  function addAccountabilityPartner() {
    const name = partnerNameInput.value.trim();
    const email = partnerEmailInput.value.trim();
    
    if (!name || !email) {
      showNotification('Please enter both name and email', 'error');
      return;
    }
    
    if (!validateEmail(email)) {
      showNotification('Please enter a valid email address', 'error');
      return;
    }
    
    const partners = JSON.parse(localStorage.getItem('accountabilityPartners')) || [];
    partners.push({ name, email });
    localStorage.setItem('accountabilityPartners', JSON.stringify(partners));
    
    partnerModal.classList.remove('show');
    renderPartnersList(partners);
    showNotification('Accountability partner added successfully!', 'success');
    
    // Clear inputs
    partnerNameInput.value = '';
    partnerEmailInput.value = '';
  }
  
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
  
  function deletePartner(index) {
    const partners = JSON.parse(localStorage.getItem('accountabilityPartners')) || [];
    partners.splice(index, 1);
    localStorage.setItem('accountabilityPartners', JSON.stringify(partners));
    renderPartnersList(partners);
  }
  
  function messagePartner(email) {
    const subject = 'My Productivity Progress';
    const body = shareMessage.value.trim() || 'I wanted to share my productivity progress with you!';
    window.open(`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  }
  
  function shareProgress() {
    const message = shareMessage.value.trim();
    if (!message) {
      showNotification('Please enter a message to share', 'error');
      return;
    }
    
    const partners = JSON.parse(localStorage.getItem('accountabilityPartners')) || [];
    if (partners.length === 0) {
      showNotification('Add accountability partners to share your progress', 'error');
      return;
    }
    
    // In a real app, you would send this to a backend service
    // For demo, we'll just show a success message
    showNotification('Progress shared with your accountability partners!', 'success');
    shareMessage.value = '';
    
    // Save shared progress
    const today = new Date().toISOString().split('T')[0];
    const sharedProgress = JSON.parse(localStorage.getItem('sharedProgress')) || {};
    sharedProgress[today] = sharedProgress[today] || [];
    sharedProgress[today].push({
      message,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('sharedProgress', JSON.stringify(sharedProgress));
  }
});