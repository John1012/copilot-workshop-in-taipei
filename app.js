// 待辦清單的儲存鍵值，讓資料可以保存在 localStorage 中。
const STORAGE_KEY = 'todo-list-items';

// 取得 DOM 元素，方便後續綁定事件與更新畫面。
const todoForm = document.getElementById('todoForm');
const todoInput = document.getElementById('todoInput');
const todoList = document.getElementById('todoList');
const emptyState = document.getElementById('emptyState');
const remainingCount = document.getElementById('remainingCount');

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

// 計算未完成項目數，並更新底部顯示文字。
function updateRemainingCount(todos) {
  const remaining = todos.filter((todo) => !todo.completed).length;
  remainingCount.textContent = `未完成: ${remaining} 項`;
}

// 根據待辦清單內容，渲染列表與空白提示。
function renderTodos() {
  const todos = loadTodos();

  // 若清單為空，顯示提示文字；否則隱藏提示。
  if (todos.length === 0) {
    emptyState.classList.add('visible');
  } else {
    emptyState.classList.remove('visible');
  }

  todoList.innerHTML = '';

  todos.forEach((todo) => {
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

// 初始載入時先渲染畫面，確保資料會顯示在頁面上。
renderTodos();
