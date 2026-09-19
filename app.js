// 待辦清單的儲存鍵值，讓資料可以保存在 localStorage 中。
const STORAGE_KEY = 'todo-list-items';
const THEME_STORAGE_KEY = 'todo-theme-preference';

// 取得 DOM 元素，方便後續綁定事件與更新畫面。
const todoForm = document.getElementById('todoForm');
const todoInput = document.getElementById('todoInput');
const todoList = document.getElementById('todoList');
const emptyState = document.getElementById('emptyState');
const remainingCount = document.getElementById('remainingCount');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');
const themeToggle = document.getElementById('themeToggle');
const themeToggleText = themeToggle.querySelector('.theme-toggle-text');
const themeToggleIcon = themeToggle.querySelector('.theme-toggle-icon');
const filterButtons = Array.from(document.querySelectorAll('.filter-btn'));

let currentFilter = 'all';

// 讀取 localStorage 中的待辦資料，若沒有資料則回傳空陣列。
function loadTodos() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('讀取待辦資料失敗:', error);
    return [];
  }
}

// 將待辦資料存回 localStorage，確保重新整理後資料還在。
function saveTodos(todos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

// 讀取使用者選擇的主題，若未曾手動切換則依照作業系統設定。
function getPreferredTheme() {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// 應用當前主題到根元素，並更新切換按鈕文字與圖示。
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  themeToggle.setAttribute('aria-pressed', String(theme === 'dark'));

  if (theme === 'dark') {
    themeToggleIcon.textContent = '☀️';
    themeToggleText.textContent = '淺色模式';
    themeToggle.setAttribute('aria-label', '切換為淺色模式');
  } else {
    themeToggleIcon.textContent = '🌙';
    themeToggleText.textContent = '深色模式';
    themeToggle.setAttribute('aria-label', '切換為深色模式');
  }
}

// 切換主題，並存入 localStorage 讓重新整理後維持使用者選擇。
function toggleTheme() {
  const nextTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  applyTheme(nextTheme);
}

// 依據目前篩選條件回傳對應待辦清單。
function getFilteredTodos(todos) {
  if (currentFilter === 'active') {
    return todos.filter((todo) => !todo.completed);
  }

  if (currentFilter === 'completed') {
    return todos.filter((todo) => todo.completed);
  }

  return todos;
}

// 取得篩選後為空時應顯示的提示文字。
function getEmptyMessage() {
  if (currentFilter === 'active') {
    return '目前沒有未完成的待辦事項。切回「全部」即可查看所有待辦。';
  }

  if (currentFilter === 'completed') {
    return '目前沒有已完成的待辦事項。若剛剛取消勾選，該項目只是被篩選條件過濾掉了，不是被刪除。';
  }

  return '還沒有任何待辦事項,新增一個吧!';
}

// 計算未完成項目數，並更新底部顯示文字。
function updateRemainingCount(todos) {
  const remaining = todos.filter((todo) => !todo.completed).length;
  remainingCount.textContent = `未完成: ${remaining} 項`;
}

function updateClearCompletedButton(todos) {
  const completedCount = todos.filter((todo) => todo.completed).length;
  const shouldShowButton = completedCount > 0;

  clearCompletedBtn.hidden = !shouldShowButton;
  clearCompletedBtn.disabled = !shouldShowButton;
}

function clearCompletedTodos() {
  const currentTodos = loadTodos();
  const hasCompleted = currentTodos.some((todo) => todo.completed);

  if (!hasCompleted) {
    return;
  }

  const confirmed = window.confirm('確認要刪除所有已完成的待辦事項嗎？');
  if (!confirmed) {
    return;
  }

  const remainingTodos = currentTodos.filter((todo) => !todo.completed);
  saveTodos(remainingTodos);
  renderTodos();
}

// 根據待辦清單內容，渲染列表與空白提示。
function renderTodos() {
  const todos = loadTodos();
  const filteredTodos = getFilteredTodos(todos);

  // 若篩選後的清單為空，顯示對應提示；否則隱藏提示。
  if (filteredTodos.length === 0) {
    emptyState.textContent = getEmptyMessage();
    emptyState.classList.add('visible');
  } else {
    emptyState.classList.remove('visible');
  }

  todoList.innerHTML = '';

  filteredTodos.forEach((todo) => {
    const li = document.createElement('li');
    li.className = `todo-item${todo.completed ? ' completed' : ''}`;
    li.dataset.id = String(todo.id);

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'todo-checkbox';
    checkbox.checked = todo.completed;
    checkbox.setAttribute('aria-label', `完成待辦: ${todo.text}`);

    const text = document.createElement('span');
    text.className = 'todo-text';
    text.textContent = todo.text;

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = '刪除';
    deleteBtn.setAttribute('aria-label', `刪除待辦: ${todo.text}`);

    // 勾選後切換完成狀態，並重新渲染更新樣式與計數。
    checkbox.addEventListener('change', () => {
      const currentTodos = loadTodos();
      const updatedTodos = currentTodos.map((item) => {
        if (item.id === todo.id) {
          return { ...item, completed: checkbox.checked };
        }
        return item;
      });

      saveTodos(updatedTodos);
      renderTodos();
    });

    // 刪除單筆待辦，移除後立即保存並重繪畫面。
    deleteBtn.addEventListener('click', () => {
      const currentTodos = loadTodos().filter((item) => item.id !== todo.id);
      saveTodos(currentTodos);
      renderTodos();
    });

    li.appendChild(checkbox);
    li.appendChild(text);
    li.appendChild(deleteBtn);
    todoList.appendChild(li);
  });

  updateRemainingCount(todos);
  updateClearCompletedButton(todos);
}

// 設定目前篩選條件，強調選中按鈕並重新渲染列表。
function setFilter(filterType) {
  currentFilter = filterType;

  filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === filterType;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });

  renderTodos();
}

// 新增待辦事項，空白內容不會被加入。
function addTodo(event) {
  event.preventDefault();

  const text = todoInput.value.trim();
  if (!text) {
    todoInput.focus();
    return;
  }

  const todos = loadTodos();
  const newTodo = {
    id: Date.now() + Math.random(),
    text,
    completed: false,
  };

  todos.push(newTodo);
  saveTodos(todos);
  todoInput.value = '';
  todoInput.focus();
  renderTodos();
}

// 綁定新增表單提交事件，讓使用者可以新增待辦。
 todoForm.addEventListener('submit', addTodo);

// 綁定主題切換按鈕，並依照作業系統初始設定套用。
 themeToggle.addEventListener('click', toggleTheme);
 applyTheme(getPreferredTheme());

clearCompletedBtn.addEventListener('click', clearCompletedTodos);

// 綁定篩選按鈕，讓使用者能切換顯示內容。
filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    setFilter(button.dataset.filter);
  });
});

// 初始載入時先渲染畫面，確保資料會顯示在頁面上。
renderTodos();
