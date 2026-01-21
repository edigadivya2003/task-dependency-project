import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDeps, setSelectedDeps] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/tasks/');
      setTasks(res.data);
    } catch (err) { console.error(err); }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('http://127.0.0.1:8000/api/tasks/', {
        title,
        description,
        dependencies: selectedDeps
      });
      setTitle('');
      setDescription('');
      setSelectedDeps([]);
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.dependencies?.[0] || "Something went wrong");
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
      <h1>✅ Task Manager & Dependency Visualizer</h1>
      
      {/* FORM TO ADD TASKS */}
      <div style={{ background: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h3>Create New Task</h3>
        <form onSubmit={handleAddTask}>
          <input 
            style={{ display: 'block', margin: '10px 0', padding: '8px', width: '300px' }}
            placeholder="Task Title" value={title} onChange={(e) => setTitle(e.target.value)} required 
          />
          <textarea 
            style={{ display: 'block', margin: '10px 0', padding: '8px', width: '300px' }}
            placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} 
          />
          <label>Dependencies (Hold Ctrl to select multiple):</label>
          <select 
            multiple style={{ display: 'block', margin: '10px 0', width: '300px', height: '100px' }}
            onChange={(e) => setSelectedDeps(Array.from(e.target.selectedOptions, option => option.value))}
          >
            {tasks.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
          </select>
          <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Add Task</button>
        </form>
        {error && <p style={{ color: 'red', marginTop: '10px' }}><b>Error:</b> {error}</p>}
      </div>

      {/* VISUAL REPRESENTATION */}
      <h3>Task Dependency Graph (List View)</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {tasks.map(task => (
          <div key={task.id} style={{ background: '#fff', border: '1px solid #ddd', padding: '15px', borderRadius: '8px', width: '200px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
            <strong>{task.title}</strong>
            <p style={{ fontSize: '12px', color: '#666' }}>{task.description}</p>
            <div style={{ fontSize: '11px', marginTop: '10px', borderTop: '1px solid #eee', paddingTop: '5px' }}>
              <b>Depends on:</b>
              {task.dependencies.length > 0 ? (
                <ul style={{ paddingLeft: '15px' }}>
                  {task.dependencies.map(depId => {
                    const depTask = tasks.find(t => t.id === depId);
                    return <li key={depId}>{depTask?.title}</li>;
                  })}
                </ul>
              ) : " None"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;