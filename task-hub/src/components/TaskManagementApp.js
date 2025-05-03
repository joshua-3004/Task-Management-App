// TaskManagementApp.js
import { useState, useEffect } from 'react';
import { PlusCircle, Check, Trash2, Edit, X, Clock } from 'lucide-react';
import './TaskManagement.css'; // Make sure to create this CSS file

export default function TaskManagementApp() {
  // Task status options
  const STATUS_OPTIONS = ['To Do', 'In Progress', 'Completed'];

  // States
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [
      { id: 1, title: 'Create a task list', description: 'Design and implement a task list UI', status: 'Completed', created: new Date().toISOString() },
      { id: 2, title: 'Add task management features', description: 'Implement adding, editing and deleting tasks', status: 'In Progress', created: new Date().toISOString() },
      { id: 3, title: 'Style the application', description: 'Make the app look nice with CSS', status: 'To Do', created: new Date().toISOString() }
    ];
  });
  
  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'To Do' });
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Add a new task
  const addTask = () => {
    if (newTask.title.trim() === '') return;

    const task = {
      id: Date.now(),
      title: newTask.title,
      description: newTask.description,
      status: newTask.status,
      created: new Date().toISOString()
    };

    setTasks([...tasks, task]);
    setNewTask({ title: '', description: '', status: 'To Do' });
  };

  // Delete a task
  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // Start editing a task
  const startEdit = (task) => {
    setEditingTask({ ...task });
  };

  // Save edited task
  const saveEdit = () => {
    if (!editingTask || editingTask.title.trim() === '') return;

    setTasks(tasks.map(task => 
      task.id === editingTask.id ? editingTask : task
    ));
    setEditingTask(null);
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingTask(null);
  };

  // Update task status
  const updateStatus = (id, newStatus) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, status: newStatus } : task
    ));
  };

  // Filter tasks based on current filter and search query
  const filteredTasks = tasks.filter(task => {
    const matchesFilter = filter === 'All' || task.status === filter;
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          task.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Format date to be more readable
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status class for styling
  const getStatusClass = (status) => {
    switch(status) {
      case 'Completed': return 'status-completed';
      case 'In Progress': return 'status-progress';
      default: return 'status-todo';
    }
  };

  return (
    <div className="task-app">
      <div className="container">
        <h1 className="app-title">Task Manager</h1>
        
        {/* Add New Task Form */}
        <div className="card">
          <h2 className="section-title">Add New Task</h2>
          <div className="form-group">
            <div className="form-field">
              <label>Task Title</label>
              <input
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                placeholder="Enter task title"
              />
            </div>
            <div className="form-field">
              <label>Description</label>
              <textarea
                value={newTask.description}
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                placeholder="Enter task description"
                rows="2"
              ></textarea>
            </div>
            <div className="form-field">
              <label>Status</label>
              <select
                value={newTask.status}
                onChange={(e) => setNewTask({...newTask, status: e.target.value})}
              >
                {STATUS_OPTIONS.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <button
              onClick={addTask}
              className="btn btn-primary"
            >
              <PlusCircle className="icon" />
              Add Task
            </button>
          </div>
        </div>
        
        {/* Task List Section */}
        <div className="card">
          <div className="list-header">
            <h2 className="section-title">My Tasks</h2>
            
            <div className="search-filter">
              {/* Search input */}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks..."
                className="search-input"
              />
              
              {/* Filter dropdown */}
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="filter-select"
              >
                <option value="All">All Tasks</option>
                {STATUS_OPTIONS.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Task count */}
          <p className="task-count">
            Showing {filteredTasks.length} of {tasks.length} tasks
          </p>
          
          {/* Tasks list */}
          {filteredTasks.length === 0 ? (
            <div className="no-tasks">
              No tasks found. Add a new task or adjust your filter.
            </div>
          ) : (
            <div className="task-list">
              {filteredTasks.map(task => (
                <div key={task.id} className="task-item">
                  {editingTask && editingTask.id === task.id ? (
                    // Editing mode
                    <div className="task-edit">
                      <input
                        type="text"
                        value={editingTask.title}
                        onChange={(e) => setEditingTask({...editingTask, title: e.target.value})}
                        className="edit-input"
                      />
                      <textarea
                        value={editingTask.description}
                        onChange={(e) => setEditingTask({...editingTask, description: e.target.value})}
                        className="edit-textarea"
                        rows="2"
                      ></textarea>
                      <select
                        value={editingTask.status}
                        onChange={(e) => setEditingTask({...editingTask, status: e.target.value})}
                        className="edit-select"
                      >
                        {STATUS_OPTIONS.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                      <div className="button-group">
                        <button
                          onClick={saveEdit}
                          className="btn btn-success"
                        >
                          <Check className="icon" />
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="btn btn-secondary"
                        >
                          <X className="icon" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Display mode
                    <div>
                      <div className="task-header">
                        <div>
                          <h3 className="task-title">{task.title}</h3>
                          <p className="task-description">{task.description}</p>
                        </div>
                        <div className="task-actions">
                          <button
                            onClick={() => startEdit(task)}
                            className="action-btn edit-btn"
                            title="Edit task"
                          >
                            <Edit className="icon" />
                          </button>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="action-btn delete-btn"
                            title="Delete task"
                          >
                            <Trash2 className="icon" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="task-footer">
                        <div className={`status-badge ${getStatusClass(task.status)}`}>
                          {task.status === 'Completed' ? (
                            <Check className="status-icon" />
                          ) : task.status === 'In Progress' ? (
                            <Clock className="status-icon" />
                          ) : (
                            <div className="status-dot"></div>
                          )}
                          {task.status}
                        </div>
                        
                        <div className="task-date">
                          <span>Created: {formatDate(task.created)}</span>
                        </div>
                        
                        {task.status !== 'Completed' && (
                          <button
                            onClick={() => updateStatus(task.id, 'Completed')}
                            className="complete-btn"
                          >
                            <Check className="icon" />
                            Mark Complete
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}