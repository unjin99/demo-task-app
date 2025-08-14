import React, { useState } from 'react';
import { Plus, Edit3, Trash2, GripVertical, Check, X } from 'lucide-react';

function App() {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'サンプルタスク1', completed: false },
    { id: 2, text: 'サンプルタスク2', completed: true },
    { id: 3, text: 'サンプルタスク3', completed: false }
  ]);
  const [newTask, setNewTask] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [draggedItem, setDraggedItem] = useState(null);

  // ダッシュボード計算
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const pendingTasks = totalTasks - completedTasks;

  // タスク追加
  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, {
        id: Date.now(),
        text: newTask.trim(),
        completed: false
      }]);
      setNewTask('');
    }
  };

  // タスク削除
  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // タスク完了切り替え
  const toggleComplete = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  // インライン編集開始
  const startEdit = (id, text) => {
    setEditingId(id);
    setEditText(text);
  };

  // 編集保存
  const saveEdit = () => {
    setTasks(tasks.map(task =>
      task.id === editingId ? { ...task, text: editText.trim() } : task
    ));
    setEditingId(null);
    setEditText('');
  };

  // 編集キャンセル
  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  // ドラッグ&ドロップ処理
  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === dropIndex) return;

    const newTasks = [...tasks];
    const draggedTask = newTasks[draggedItem];
    newTasks.splice(draggedItem, 1);
    newTasks.splice(dropIndex, 0, draggedTask);
    
    setTasks(newTasks);
    setDraggedItem(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* 固定ヘッダー - ダッシュボード */}
      <header className="sticky top-0 z-50 bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-2xl font-bold text-gray-800">📋 タスク管理</h1>
            <div className="text-sm text-gray-600">
              進捗率: <span className="font-semibold text-indigo-600">{completionRate}%</span>
            </div>
          </div>
          
          {/* ダッシュボード指標 */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-blue-50 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">{totalTasks}</div>
              <div className="text-xs text-blue-500">総タスク</div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
              <div className="text-xs text-green-500">完了</div>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-orange-600">{pendingTasks}</div>
              <div className="text-xs text-orange-500">未完了</div>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-600">{completionRate}%</div>
              <div className="text-xs text-purple-500">達成率</div>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* タスク追加フォーム */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex gap-3">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
              placeholder="新しいタスクを入力..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            />
            <button
              onClick={addTask}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 font-medium"
            >
              <Plus size={20} />
              追加
            </button>
          </div>
        </div>

        {/* タスクリスト */}
        <div className="space-y-3">
          {tasks.map((task, index) => (
            <div
              key={task.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 transition-all duration-200 ${
                draggedItem === index ? 'opacity-50 transform rotate-2' : 'hover:shadow-md'
              } ${task.completed ? 'bg-gray-50' : ''}`}
            >
              <div className="flex items-center gap-3">
                {/* ドラッグハンドル */}
                <div className="cursor-move text-gray-400 hover:text-gray-600">
                  <GripVertical size={20} />
                </div>

                {/* 完了チェックボックス */}
                <button
                  onClick={() => toggleComplete(task.id)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    task.completed 
                      ? 'bg-green-500 border-green-500 text-white' 
                      : 'border-gray-300 hover:border-green-400'
                  }`}
                >
                  {task.completed && <Check size={14} />}
                </button>

                {/* タスクテキスト */}
                <div className="flex-1">
                  {editingId === task.id ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                        className="flex-1 px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        autoFocus
                      />
                      <button
                        onClick={saveEdit}
                        className="text-green-600 hover:bg-green-50 p-1 rounded"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="text-red-600 hover:bg-red-50 p-1 rounded"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <span
                      className={`${task.completed ? 'line-through text-gray-500' : 'text-gray-800'} text-lg`}
                    >
                      {task.text}
                    </span>
                  )}
                </div>

                {/* 操作ボタン */}
                {editingId !== task.id && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(task.id, task.text)}
                      className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 空状態 */}
        {tasks.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <div className="text-gray-500 text-lg">タスクがまだありません</div>
            <div className="text-gray-400 text-sm">上のフォームから新しいタスクを追加してみましょう</div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
