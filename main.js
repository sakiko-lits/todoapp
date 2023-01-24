// モードの切り替え
const modeBtn = document.querySelector(".header__btn");
const ul = document.querySelector('#disp-ul');
let darkMode = true;

const changeMode = () => {
  const modechange = document.querySelectorAll(".modechange");
  darkMode = !darkMode;
  for(let i = 0; i < modechange.length; i++) {
  modechange[i].classList.toggle("light-mode");
  }
};
modeBtn.addEventListener("click", changeMode);

// localstorageの処理
const storage = localStorage;
let list = []; // todoリストの全データを格納する配列
// ページを開いた時に、以前のデータを読み込む
document.addEventListener('DOMContentLoaded', () => {
  // ストレージデータの読み込み
  const json = storage.todoList;
  // ストレージデータが何もないときは、何もしない
  if (json == undefined) {
    return;
  }
  // 現在のデータを配列listに代入
  list = JSON.parse(json);
  for (const item of list) {
    addItem(item);
  }

  // 完了済みのタスクはチェックマーク＆横線
  const tasks = document.querySelectorAll(".task");
  for(let i = 0; i < tasks.length; i++){
    const task = tasks[i].textContent;
    const value = list.find(
      (item) => item.todo === task
    );
    if(value.isDone){
      tasks[i].classList.add('done');
      const input = tasks[i].querySelector('input');
      input.checked = true;
    }
  }
});

// 新しいタスクを追加
const todo = document.querySelector(".new__item");
todo.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    const item = {};
  // 入力値の確認（空だったらアラート）
  if (todo.value != '') {
    item.todo = todo.value;
  } else {
    window.alert('入力されていません。');
    return;
  }

  // 入力値の確認（重複していたらアラート）
  const isListed = list.find(
    (item) => item.todo === todo.value
  );
  if(isListed){
    window.alert('既に登録されているタスクです。');
    return;
  }

  item.isDone = false;
  item.isDeleted = false;
  addItem(item);
  list.push(item);
  storage.todoList = JSON.stringify(list);
  }
});

// addItemの処理
const addItem = (item) => {
  const itemNum = ul.childElementCount;

  // テキストボックスの中の文字を初期化
  todo.value = '';

  if(darkMode){
    // ulにliを追加
    const li = document.createElement('li');
    li.className = 'task modechange';
    ul.append(li);

    // liにlabelを追加
    const label = document.createElement('label');
    label.className = 'task__container';
    li.append(label);

    // labelにinputを追加
    const inputBtn = document.createElement('input');
    inputBtn.type = 'checkbox';
    label.append(inputBtn);

    // labelにspanを追加
    const spanBtn = document.createElement('span');
    spanBtn.className = 'task__checkmark modechange';
    label.append(spanBtn);

    // liにテキストを追加
    const itemText = document.createElement('p');
    itemText.className = 'task__item modechange';
    itemText.textContent = item.todo;
    li.append(itemText);

    // liに削除ボタンを追加
    const deleteBtn = document.createElement('span');
    deleteBtn.className = 'task__delete';
    li.append(deleteBtn);

    document.querySelector('.footer__count').innerHTML = itemNum+1 + " items left";
  }else{
    // ulにliを追加
    const li = document.createElement('li');
    li.className = 'task modechange light-mode';
    ul.append(li);

    // liにlabelを追加
    const label = document.createElement('label');
    label.className = 'task__container';
    li.append(label);

    // labelにinputを追加
    const inputBtn = document.createElement('input');
    inputBtn.type = 'checkbox';
    label.append(inputBtn);

    // labelにspanを追加
    const spanBtn = document.createElement('span');
    spanBtn.className = 'task__checkmark modechange light-mode';
    label.append(spanBtn);

    // liにテキストを追加
    const itemText = document.createElement('p');
    itemText.className = 'task__item modechange light-mode';
    itemText.textContent = item.todo;
    li.append(itemText);

    // liに削除ボタンを追加
    const deleteBtn = document.createElement('span');
    deleteBtn.className = 'task__delete';
    li.append(deleteBtn);

    document.querySelector('.footer__count').innerHTML = itemNum+1 + " items left";
  }
};

// 削除・完了処理
const container = document.querySelector("#disp-ul");
container.addEventListener("click", (e) => {
  // チェックマークを押したら完了に
  if (e.target.classList.contains("task__checkmark")) {
    const doneTodo = e.target.closest('li');
    doneTodo.classList.toggle('done');

    const doneTodoText = doneTodo.textContent;
    const doneValue = list.find(
      (item) => item.todo === doneTodoText
    );

    if(doneValue.isDone){
      doneValue.isDone = false;
    }else{
      doneValue.isDone = true;
    }
    storage.todoList = JSON.stringify(list);
  }

  // ×ボタンを押したら削除
  if (e.target.classList.contains("task__delete")) {
    // 表示を削除
    const delTodo = e.target.closest('li');
    ul.removeChild(delTodo);

    // Localstorageから削除
    const delTodoText = delTodo.textContent;
    const delValue = list.find(
      (item) => item.todo === delTodoText
    );
    delValue.isDeleted = true;
    const newlistItems = list.filter((item) => item.isDeleted === false);
    list = newlistItems;
    storage.todoList = JSON.stringify(list);

    const itemNum = ul.childElementCount;
    document.querySelector('.footer__count').innerHTML = itemNum + " items left";
  }
});

// カテゴリー別表示
const all = document.querySelector('.btn-all');
const active = document.querySelector('.btn-active');
const completed = document.querySelector('.btn-completed');

// 全てのタスク
all.addEventListener('click', function(){
  ul.textContent = '';
  for (const item of list) {
    if (item.isDeleted === false) {
      addItem(item);
    }
  }
  // 完了済みのタスクはチェックマーク＆横線
  const tasks = document.querySelectorAll(".task");
  for(let i = 0; i < tasks.length; i++){
    const task = tasks[i].textContent;
    const value = list.find(
      (item) => item.todo === task
    );
    if(value.isDone){
      tasks[i].classList.add('done');
      const input = tasks[i].querySelector('input');
      input.checked = true;
    }
  }
});

// 未完了のタスク
active.addEventListener('click', function(){
  ul.textContent = '';
  for (const item of list) {
    if (item.isDone === false) {
      addItem(item);
    }
  }
});

// 完了済みのタスク
completed.addEventListener('click', function(){
  ul.textContent = '';
  for (const item of list) {
    if (item.isDone === true) {
      addItem(item);
    }
  }
  // 完了済みのタスクはチェックマーク＆横線
  const tasks = document.querySelectorAll(".task");
  for(let i = 0; i < tasks.length; i++){
    const task = tasks[i].textContent;
    const value = list.find(
      (item) => item.todo === task
    );
    if(value.isDone){
      tasks[i].classList.add('done');
      const input = tasks[i].querySelector('input');
      input.checked = true;
    }
  }
});

// スマホ用
const allSP = document.querySelector('.btn-all-sp');
const activeSP = document.querySelector('.btn-active-sp');
const completedSP = document.querySelector('.btn-completed-sp');

allSP.addEventListener('click', function(){
  ul.textContent = '';
  for (const item of list) {
    if (item.isDeleted === false) {
      addItem(item);
    }
  }

  // 完了済みのタスクはチェックマーク＆横線
  const tasks = document.querySelectorAll(".task");
  for(let i = 0; i < tasks.length; i++){
    const task = tasks[i].textContent;
    const value = list.find(
      (item) => item.todo === task
    );
    if(value.isDone){
      tasks[i].classList.add('done');
      const input = tasks[i].querySelector('input');
      input.checked = true;
    }
  }
});

activeSP.addEventListener('click', function(){
  ul.textContent = '';
  for (const item of list) {
    if (item.isDone === false) {
      addItem(item);
    }
  }
});

completedSP.addEventListener('click', function(){
  ul.textContent = '';
  for (const item of list) {
    if (item.isDone === true) {
      addItem(item);
    }
  }

  // 完了済みのタスクはチェックマーク＆横線
  const tasks = document.querySelectorAll(".task");
  for(let i = 0; i < tasks.length; i++){
    const task = tasks[i].textContent;
    const value = list.find(
      (item) => item.todo === task
    );
    if(value.isDone){
      tasks[i].classList.add('done');
      const input = tasks[i].querySelector('input');
      input.checked = true;
    }
  }
});

// 完了タスクの削除
const clearComplete = document.querySelector('#clear_completed');
clearComplete.addEventListener('click', function(){
  ul.textContent = '';
  for (const item of list) {
    if (item.isDone === false) {
      addItem(item);
    }
  }

  const newlistItems2 = list.filter((item) => item.isDone === false);
  list = newlistItems2;
  storage.todoList = JSON.stringify(list);

  const itemNum = ul.childElementCount;
  document.querySelector('.footer__count').innerHTML = itemNum + " items left";
});

