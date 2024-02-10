import 'bootstrap/dist/css/bootstrap.min.css';
import './mycss.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleCheck, faPen, faTrashCan
} from '@fortawesome/free-solid-svg-icons'
import React, { useState, useEffect } from 'react';

function App() {

  // Load tasks from local storage on initial render
  const [toDo, setToDo] = useState(() => {
    const savedTasks = localStorage.getItem('todoList');
    if (savedTasks) {
      return JSON.parse(savedTasks);
    } else {
      return [];
    }
  });

  // Temp States
  const [newTask, setNewTask] = useState('');
  const [priority, setPriority] = useState('medium'); // Default priority is set to medium
  const [updateData, setUpdateData] = useState('');
  const [filterPriority, setFilterPriority] = useState('all'); // State for filtering by priority

  // Save tasks to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('todoList', JSON.stringify(toDo));
  }, [toDo]);

  // Function to add new task
  const addTask = () => {
    if (newTask.trim() !== '') {
      const num = toDo.length + 1;
      const newEntry = { id: num, title: newTask, status: false, priority };
      setToDo([...toDo, newEntry]);
      setNewTask('');
      setPriority('medium'); // Reset priority after adding task
    }
  }

  // Function to delete task
  const deleteTask = (id) => {
    const newTasks = toDo.filter((task) => task.id !== id);
    setToDo(newTasks);
  }

  // Function to mark task as done or completed
  const markDone = (id) => {
    const newTasks = toDo.map((task) => {
      if (task.id === id) {
        return ({ ...task, status: !task.status })
      }
      return task;
    });
    setToDo(newTasks);
  }

  // Function to cancel update
  const cancelUpdate = () => {
    setUpdateData('');
  }

  // Function to change task for update
  const changeTask = (e) => {
    const newEntry = {
      id: updateData.id,
      title: e.target.value,
      status: updateData.status ? true : false,
      priority: updateData.priority
    }
    setUpdateData(newEntry);
  }

  // Function to update task 
  const updateTask = () => {
    const filterRecords = [...toDo].filter(task => task.id !== updateData.id);
    const updatedObject = [...filterRecords, updateData];
    setToDo(updatedObject);
    setUpdateData('');
  }

 


  // Function to handle priority filter change
  const handlePriorityFilterChange = (e) => {
    setFilterPriority(e.target.value);
  }

  // Filter tasks based on priority
  const filteredTasks = filterPriority === 'all' ? toDo : toDo.filter(task => task.priority === filterPriority);

  return (
    <>
      <div className="container App ms-4 align-middle">
        <h2 className='text-center'>To Do List App</h2>
        {/* Priority filter dropdown */}
        <div className="mb-3">
          <label htmlFor="priorityFilter" className="form-label">Filter by Priority:</label>
          <select id="priorityFilter" className="form-select" value={filterPriority} onChange={handlePriorityFilterChange}>
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div className="row my-3">
          <div className="col">
            <input
              value={updateData && updateData.title || newTask}
              onChange={(e) => updateData ? changeTask(e) : setNewTask(e.target.value)}
              className="form-control form-control-lg"
            />
          </div>
          <div className="col-auto">
            {/* Priority radio buttons */}
            <div className="form-check form-check-inline">
              <input
                type="radio"
                className="form-check-input"
                id="low"
                value="low"
                checked={priority === 'low'}
                onChange={() => setPriority('low')}
              />
              <label className="form-check-label" htmlFor="low">Low</label>
            </div>
            <div className="form-check form-check-inline">
              <input
                type="radio"
                className="form-check-input"
                id="medium"
                value="medium"
                checked={priority === 'medium'}
                onChange={() => setPriority('medium')}
              />
              <label className="form-check-label" htmlFor="medium">Medium</label>
            </div>
            <div className="form-check form-check-inline">
              <input
                type="radio"
                className="form-check-input"
                id="high"
                value="high"
                checked={priority === 'high'}
                onChange={() => setPriority('high')}
              />
              <label className="form-check-label" htmlFor="high">High</label>
            </div>
            <button
              className="btn btn-lg btn-success mr-20"
              onClick={updateData ? updateTask : addTask}
            >
              {updateData ? 'Update' : 'Add Task'}
            </button>
            {updateData && (
              <button
                className="btn btn-lg btn-warning"
                onClick={cancelUpdate}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
        {/* Rendering filtered tasks */}
        {filteredTasks && filteredTasks.length ? (
          filteredTasks.map((task, index) => (
            <div className="row" key={task.id}>
              <div className={`col taskBg ${task.priority}-priority`}>
                <div className={task.status ? 'done' : ''}>
                  <span className="taskNumber ">{index + 1}</span>
                  <span className="taskText">{task.title}</span>
                </div>
                <div className="iconsWrap">
                  <span
                    onClick={() => markDone(task.id)}
                    title="Completed / Not Completed"
                  >
                    <FontAwesomeIcon icon={faCircleCheck} />
                  </span>
                  {task.status ? null : (
                    <span
                      title="Edit"
                      onClick={() => setUpdateData({ id: task.id, title: task.title, status: task.status, priority: task.priority })}
                    >
                      <FontAwesomeIcon icon={faPen} />
                    </span>
                  )}
                  <span
                    onClick={() => deleteTask(task.id)}
                    title="Delete"
                  >
                    <FontAwesomeIcon icon={faTrashCan} />
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className='text-center my-4'>No tasks chill...</p>
        )}

        
      </div>
    </>
  )
}

export default App;
