import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import styles from './Dashboard.module.css'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { getAllProjects, createProject, deleteProject, addMember } from '../services/projectService'
import { getAllTasks, createTask, updateTask, deleteTask } from '../services/taskService'
import { getAllUsers } from '../services/userService'

export default function Dashboard() {
  const { user, logoutUser } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('tasks')
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [showTaskModal, setShowTaskModal] = useState(false)
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [showMemberModal, setShowMemberModal] = useState(false)

  const [taskName, setTaskName] = useState('')
  const [taskProject, setTaskProject] = useState('')
  const [taskPriority, setTaskPriority] = useState('medium')
  const [taskDueDate, setTaskDueDate] = useState('')
  const [taskAssignee, setTaskAssignee] = useState('')

  const [projectName, setProjectName] = useState('')
  const [projectDescription, setProjectDescription] = useState('')

  const [selectedProject, setSelectedProject] = useState(null)
  const [selectedUser, setSelectedUser] = useState('')
  const [selectedRole, setSelectedRole] = useState('member')

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      setLoading(true)
      setError('')
      const [projectsRes, usersRes] = await Promise.all([
        getAllProjects(),
        getAllUsers()
      ])
      const fetchedProjects = projectsRes.data.projects || []
      setProjects(fetchedProjects)
      setUsers(usersRes.data.users || [])

      if (fetchedProjects.length > 0) {
        const taskPromises = fetchedProjects.map(p => getAllTasks(p._id))
        const taskResults = await Promise.all(taskPromises)
        const allTasks = taskResults.flatMap(res => res.data.tasks || [])
        setTasks(allTasks)
      } else {
        setTasks([])
      }
    } catch (err) {
      setError('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  async function handleCreateTask(e) {
    e.preventDefault()
    try {
      await createTask({
        title: taskName,
        projectId: taskProject,
        priority: taskPriority,
        dueDate: taskDueDate || undefined,
        assignedTo: taskAssignee || undefined
      })
      setShowTaskModal(false)
      setTaskName('')
      setTaskProject('')
      setTaskPriority('medium')
      setTaskDueDate('')
      setTaskAssignee('')
      fetchData()
    } catch (err) {
      setError('Failed to create task')
    }
  }

  async function handleCreateProject(e) {
    e.preventDefault()
    try {
      await createProject({ name: projectName, description: projectDescription })
      setShowProjectModal(false)
      setProjectName('')
      setProjectDescription('')
      fetchData()
    } catch (err) {
      setError('Failed to create project')
    }
  }

  async function handleDeleteTask(taskId) {
    if (!window.confirm('Delete this task?')) return
    try {
      await deleteTask(taskId)
      fetchData()
    } catch (err) {
      setError('Failed to delete task')
    }
  }

  async function handleDeleteProject(projectId) {
    if (!window.confirm('Delete this project? All tasks will be deleted too.')) return
    try {
      await deleteProject(projectId)
      fetchData()
    } catch (err) {
      setError('Failed to delete project')
    }
  }

  async function handleStatusChange(taskId, status) {
    try {
      await updateTask(taskId, { status })
      fetchData()
    } catch (err) {
      setError('Failed to update task')
    }
  }

  async function handleAddMember(e) {
    e.preventDefault()
    try {
      await addMember(selectedProject._id, selectedUser, selectedRole)
      setShowMemberModal(false)
      setSelectedUser('')
      setSelectedRole('member')
      fetchData()
    } catch (err) {
      setError('Failed to add member')
    }
  }

  function handleLogout() {
    logoutUser()
    navigate('/')
  }

  if (loading) return <div className={styles.loading}>Loading...</div>

  return (
    <div className={styles.page}>
      <Navbar user={user} onLogout={handleLogout} />

      <main className={styles.main}>
        {error && <p className={styles.error}>{error}</p>}

        {/* Stats */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div>
              <p className={styles.statLabel}>Total Projects</p>
              <h2 className={styles.statNumber}>{projects.length}</h2>
            </div>
            <div className={styles.statIcon}>📋</div>
          </div>
          <div className={styles.statCard}>
            <div>
              <p className={styles.statLabel}>Total Tasks</p>
              <h2 className={styles.statNumber}>{tasks.length}</h2>
            </div>
            <div className={styles.statIcon}>✅</div>
          </div>
          <div className={styles.statCard}>
            <div>
              <p className={styles.statLabel}>Completed Tasks</p>
              <h2 className={styles.statNumber}>
                {tasks.filter(t => t.status === 'completed').length}
              </h2>
            </div>
            <div className={styles.statIcon}>👥</div>
          </div>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button
            className={activeTab === 'tasks' ? styles.tabActive : styles.tab}
            onClick={() => setActiveTab('tasks')}
          >
            Tasks
          </button>
          <button
            className={activeTab === 'projects' ? styles.tabActive : styles.tab}
            onClick={() => setActiveTab('projects')}
          >
            Projects
          </button>
        </div>

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div>
            <div className={styles.sectionHeader}>
              <div>
                <h2 className={styles.sectionTitle}>Tasks</h2>
                <p className={styles.sectionSub}>Manage and track all your tasks</p>
              </div>
              <button className={styles.newBtn} onClick={() => setShowTaskModal(true)}>
                + New Task
              </button>
            </div>
            <div className={styles.taskList}>
              {tasks.length === 0 ? (
                <p className={styles.empty}>No tasks yet. Create one!</p>
              ) : (
                tasks.map(task => (
                  <div key={task._id} className={styles.taskCard}>
                    <div className={styles.taskLeft}>
                      <div className={styles.taskTitleRow}>
                        <h3 className={styles.taskTitle}>{task.title}</h3>
                        <span className={`${styles.priority} ${styles[task.priority]}`}>
                          {task.priority}
                        </span>
                      </div>
                      <div className={styles.taskMeta}>
                        {task.projectId && <span>📋 {task.projectId.name}</span>}
                        {task.assignedTo && <span>👤 {task.assignedTo.name}</span>}
                        {task.dueDate && <span>📅 {new Date(task.dueDate).toLocaleDateString()}</span>}
                      </div>
                    </div>
                    <div className={styles.taskActions}>
                      <select
                        className={styles.statusSelect}
                        value={task.status}
                        onChange={(e) => handleStatusChange(task._id, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDeleteTask(task._id)}
                      >
                        🗑
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div>
            <div className={styles.sectionHeader}>
              <div>
                <h2 className={styles.sectionTitle}>Projects</h2>
                <p className={styles.sectionSub}>Manage all your projects</p>
              </div>
              <button className={styles.newBtn} onClick={() => setShowProjectModal(true)}>
                + New Project
              </button>
            </div>
            <div className={styles.taskList}>
              {projects.length === 0 ? (
                <p className={styles.empty}>No projects yet. Create one!</p>
              ) : (
                projects.map(project => (
                  <div key={project._id} className={styles.taskCard}>
                    <div className={styles.taskLeft}>
                      <h3 className={styles.taskTitle}>{project.name}</h3>
                      <div className={styles.taskMeta}>
                        {project.description && <span>{project.description}</span>}
                        <span>👤 Created by {project.createdBy?.name}</span>
                      </div>
                    </div>
                    <div className={styles.taskActions}>
                      <button
                        className={styles.newBtn}
                        onClick={() => { setSelectedProject(project); setShowMemberModal(true) }}
                      >
                        + Add Member
                      </button>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDeleteProject(project._id)}
                      >
                        🗑
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>

      {/* Create Task Modal */}
      {showTaskModal && (
        <div className={styles.overlay} onClick={() => setShowTaskModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h2 className={styles.modalTitle}>Create New Task</h2>
                <p className={styles.modalSub}>Add a new task and assign it to a team member</p>
              </div>
              <button className={styles.closeBtn} onClick={() => setShowTaskModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCreateTask}>
              <div className={styles.field}>
                <label className={styles.label}>Task Name</label>
                <input
                  className={styles.input}
                  placeholder="Enter task name"
                  value={taskName}
                  onChange={e => setTaskName(e.target.value)}
                  required
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Project</label>
                <select
                  className={styles.input}
                  value={taskProject}
                  onChange={e => setTaskProject(e.target.value)}
                  required
                >
                  <option value="">Select project</option>
                  {projects.map(p => (
                    <option key={p._id} value={p._id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Assign To</label>
                <select
                  className={styles.input}
                  value={taskAssignee}
                  onChange={e => setTaskAssignee(e.target.value)}
                >
                  <option value="">Select user (optional)</option>
                  {users.map(u => (
                    <option key={u._id} value={u._id}>{u.name} — {u.email}</option>
                  ))}
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Priority</label>
                <select
                  className={styles.input}
                  value={taskPriority}
                  onChange={e => setTaskPriority(e.target.value)}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Due Date</label>
                <input
                  className={styles.input}
                  type="date"
                  value={taskDueDate}
                  onChange={e => setTaskDueDate(e.target.value)}
                />
              </div>
              <button type="submit" className={styles.submitBtn}>Create Task</button>
            </form>
          </div>
        </div>
      )}

      {/* Create Project Modal */}
      {showProjectModal && (
        <div className={styles.overlay} onClick={() => setShowProjectModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h2 className={styles.modalTitle}>Create New Project</h2>
                <p className={styles.modalSub}>Add a new project to your workspace</p>
              </div>
              <button className={styles.closeBtn} onClick={() => setShowProjectModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCreateProject}>
              <div className={styles.field}>
                <label className={styles.label}>Project Name</label>
                <input
                  className={styles.input}
                  placeholder="Enter project name"
                  value={projectName}
                  onChange={e => setProjectName(e.target.value)}
                  required
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Description</label>
                <input
                  className={styles.input}
                  placeholder="Enter project description"
                  value={projectDescription}
                  onChange={e => setProjectDescription(e.target.value)}
                />
              </div>
              <button type="submit" className={styles.submitBtn}>Create Project</button>
            </form>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showMemberModal && (
        <div className={styles.overlay} onClick={() => setShowMemberModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h2 className={styles.modalTitle}>Add Member</h2>
                <p className={styles.modalSub}>Add a member to {selectedProject?.name}</p>
              </div>
              <button className={styles.closeBtn} onClick={() => setShowMemberModal(false)}>✕</button>
            </div>
            <form onSubmit={handleAddMember}>
              <div className={styles.field}>
                <label className={styles.label}>Select User</label>
                <select
                  className={styles.input}
                  value={selectedUser}
                  onChange={e => setSelectedUser(e.target.value)}
                  required
                >
                  <option value="">Select a user</option>
                  {users.map(u => (
                    <option key={u._id} value={u._id}>{u.name} — {u.email}</option>
                  ))}
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Role</label>
                <select
                  className={styles.input}
                  value={selectedRole}
                  onChange={e => setSelectedRole(e.target.value)}
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button type="submit" className={styles.submitBtn}>Add Member</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}