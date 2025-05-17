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
    const toggleTasksBtn = document.getElementById('toggle-tasks');
    const taskList = document.getElementById('task-list');
    const newTaskInput = document.getElementById('new-task');
    const addTaskBtn = document.getElementById('add-task');
    const tasksContainer = document.getElementById('tasks');
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

    // Initialize
    updateTimerDisplay();
    loadSettings();
    loadTasks();
    loadStats();
    getRandomQuote();
    setupWaterReminder();

    // Event Listeners
    themeToggle.addEventListener('click', toggleTheme);
    timerTabs.forEach(tab => tab.addEventListener('click', switchMode));
    startStopBtn.addEventListener('click', toggleTimer);
    resetBtn.addEventListener('click', resetTimer);
    toggleTasksBtn.addEventListener('click', toggleTaskList);
    addTaskBtn.addEventListener('click', addTask);
    newTaskInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') addTask();
    });

    // Settings Inputs
    focusMinutesInput.addEventListener('change', saveSettings);
    shortBreakMinutesInput.addEventListener('change', saveSettings);
    longBreakMinutesInput.addEventListener('change', saveSettings);
    longBreakIntervalInput.addEventListener('change', saveSettings);
    autoStartCheckbox.addEventListener('change', saveSettings);
    muteToggleCheckbox.addEventListener('change', saveSettings);

    // Water Reminder
    waterReminder.addEventListener('click', () => {
      showNotification('💧 Remember to stay hydrated!', 'info');
      resetWaterReminder();
    });

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
  });