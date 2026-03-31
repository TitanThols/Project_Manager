import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import styles from './Dashboard.module.css'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { getAllProjects, createProject, deleteProject, addMember, getProjectMembers, removeMember } from '../services/projectService'
import { getAllTasks, createTask, updateTask, deleteTask } from '../services/taskService'
import { getAllUsers } from '../services/userService'
import { FolderKanban, CheckSquare, Users, Trash2, Plus, Search, X, Calendar, User, Briefcase } from 'lucide-react'

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
  const [showProjectDetail, setShowProjectDetail] = useState(false)
  const [taskName, setTaskName] = useState('')
  const [taskProject, setTaskProject] = useState('')
  const [taskPriority, setTaskPriority] = useState('medium')
  const [taskDueDate, setTaskDueDate] = useState('')
  const [taskAssignee, setTaskAssignee] = useState('')
  const [projectMembers, setProjectMembers] = useState([])
  const [projectName, setProjectName] = useState('')
  const [projectDescription, setProjectDescription] = useState('')
  const [selectedProject, setSelectedProject] = useState(null)
  const [selectedProjectMembers, setSelectedProjectMembers] = useState([])
  const [memberSearch, setMemberSearch] = useState('')
  const [memberSearchResults, setMemberSearchResults] = useState([])
  const [selectedRole, setSelectedRole] = useState('member')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterPriority, setFilterPriority] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

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

  async function handleTaskProjectChange(projectId) {
    setTaskProject(projectId)
    setTaskAssignee('')
    if (projectId) {
      try {
        const res = await getProjectMembers(projectId)
        setProjectMembers(res.data.members || [])
      } catch (err) {
        setProjectMembers([])
      }
    } else {
      setProjectMembers([])
    }
  }

  async function handleOpenProjectDetail(project) {
    setSelectedProject(project)
    try {
      const res = await getProjectMembers(project._id)
      setSelectedProjectMembers(res.data.members || [])
    } catch (err) {
      setSelectedProjectMembers([])
    }
    setShowProjectDetail(true)
  }

  async function handleMemberSearch(query) {
    setMemberSearch(query)
    if (query.length < 2) {
      setMemberSearchResults([])
      return
    }
    try {
      const res = await getAllUsers()
      const allUsers = res.data.users || []
      const filtered = allUsers.filter(u =>
        u.name.toLowerCase().includes(query.toLowerCase()) ||
        u.email.toLowerCase().includes(query.toLowerCase())
      )
      setMemberSearchResults(filtered)
    } catch (err) {
      setMemberSearchResults([])
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
      setProjectMembers([])
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

  async function handleAddMember(userId) {
    try {
      await addMember(selectedProject._id, userId, selectedRole)
      const res = await getProjectMembers(selectedProject._id)
      setSelectedProjectMembers(res.data.members || [])
      setMemberSearch('')
      setMemberSearchResults([])
    } catch (err) {
      setError('Failed to add member')
    }
  }

  async function handleRemoveMember(userId) {
    if (!window.confirm('Remove this member?')) return
    try {
      await removeMember(selectedProject._id, userId)
      const res = await getProjectMembers(selectedProject._id)
      setSelectedProjectMembers(res.data.members || [])
    } catch (err) {
      setError('Failed to remove member')
    }
  }

  function handleLogout() {
    logoutUser()
    navigate('/')
  }

  function isOverdue(dueDate) {
    if (!dueDate) return false
    return new Date(dueDate) < new Date()
  }

  const filteredTasks = tasks.filter(task => {
    if (filterStatus && task.status !== filterStatus) return false
    if (filterPriority && task.priority !== filterPriority) return false
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  function getTaskCount(projectId) {
    return tasks.filter(t => t.projectId?._id === projectId).length
  }

  if (loading) return <div className={styles.loading}>Loading...</div>

  return (
    <div className={styles.page}>
      <Navbar user={user} onLogout={handleLogout} />
      <main className={styles.main}>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div>
              <p className={styles.statLabel}>Total Projects</p>
              <h2 className={styles.statNumber}>{projects.length}</h2>
            </div>
            <div className={styles.statIcon}><FolderKanban size={28} /></div>
          </div>
          <div className={styles.statCard}>
            <div>
              <p className={styles.statLabel}>Total Tasks</p>
              <h2 className={styles.statNumber}>{tasks.length}</h2>
            </div>
            <div className={styles.statIcon}><CheckSquare size={28} /></div>
          </div>
          <div className={styles.statCard}>
            <div>
              <p className={styles.statLabel}>Completed Tasks</p>
              <h2 className={styles.statNumber}>
                {tasks.filter(t => t.status === 'completed').length}
              </h2>
            </div>
            <div className={styles.statIcon}><Users size={28} /></div>
          </div>
        </div>

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

        {activeTab === 'tasks' && (
          <div>
            <div className={styles.sectionHeader}>
              <div>
                <h2 className={styles.sectionTitle}>Tasks</h2>
                <p className={styles.sectionSub}>Manage and track all your tasks</p>
              </div>
              <div className={styles.btnWrapper}>
                <button className={styles.newBtn} onClick={() => setShowTaskModal(true)}>
                  <Plus size={16} /> New Task
                </button>
              </div>
            </div>
            <div className={styles.filters}>
              <div className={styles.searchWrapper}>
                <Search size={15} className={styles.searchIcon} />
                <input
                  className={styles.searchInput}
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
              <select
                className={styles.filterSelect}
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              <select
                className={styles.filterSelect}
                value={filterPriority}
                onChange={e => setFilterPriority(e.target.value)}
              >
                <option value="">All Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              {(filterStatus || filterPriority || searchQuery) && (
                <button
                  className={styles.clearBtn}
                  onClick={() => { setFilterStatus(''); setFilterPriority(''); setSearchQuery('') }}
                >
                  <X size={14} /> Clear
                </button>
              )}
            </div>
            <div className={styles.taskList}>
              {filteredTasks.length === 0 ? (
                <div className={styles.emptyState}>
                  <CheckSquare size={40} className={styles.emptyIcon} />
                  <p className={styles.emptyTitle}>No tasks found</p>
                  <p className={styles.emptySub}>Create a task to get started</p>
                </div>
              ) : (
                filteredTasks.map(task => (
                  <div
                    key={task._id}
                    className={`${styles.taskCard} ${isOverdue(task.dueDate) && task.status !== 'completed' ? styles.overdue : ''}`}
                  >
                    <div className={styles.taskLeft}>
                      <div className={styles.taskTitleRow}>
                        <h3 className={styles.taskTitle}>{task.title}</h3>
                        <span className={`${styles.priority} ${styles[task.priority]}`}>
                          {task.priority}
                        </span>
                        {isOverdue(task.dueDate) && task.status !== 'completed' && (
                          <span className={styles.overdueTag}>Overdue</span>
                        )}
                      </div>
                      <div className={styles.taskMeta}>
                        {task.projectId && (
                          <span className={styles.metaItem}>
                            <Briefcase size={13} /> {task.projectId.name}
                          </span>
                        )}
                        {task.assignedTo && (
                          <span className={styles.metaItem}>
                            <User size={13} /> {task.assignedTo.name}
                          </span>
                        )}
                        {task.dueDate && (
                          <span className={`${styles.metaItem} ${isOverdue(task.dueDate) && task.status !== 'completed' ? styles.overdueDate : ''}`}>
                            <Calendar size={13} /> {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        )}
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
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div>
            <div className={styles.sectionHeader}>
              <div>
                <h2 className={styles.sectionTitle}>Projects</h2>
                <p className={styles.sectionSub}>Manage all your projects</p>
              </div>
              <div className={styles.btnWrapper}>
                <button className={styles.newBtn} onClick={() => setShowProjectModal(true)}>
                  <Plus size={16} /> New Project
                </button>
              </div>
            </div>
            <div className={styles.taskList}>
              {projects.length === 0 ? (
                <div className={styles.emptyState}>
                  <FolderKanban size={40} className={styles.emptyIcon} />
                  <p className={styles.emptyTitle}>No projects yet</p>
                  <p className={styles.emptySub}>Create a project to get started</p>
                </div>
              ) : (
                projects.map(project => (
                  <div key={project._id} className={styles.taskCard}>
                    <div
                      className={styles.taskLeft}
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleOpenProjectDetail(project)}
                    >
                      <h3 className={styles.taskTitle}>{project.name}</h3>
                      <div className={styles.taskMeta}>
                        {project.description && (
                          <span className={styles.metaItem}>{project.description}</span>
                        )}
                        <span className={styles.metaItem}>
                          <User size={13} /> {project.createdBy?.name}
                        </span>
                        <span className={styles.metaItem}>
                          <CheckSquare size={13} /> {getTaskCount(project._id)} tasks
                        </span>
                      </div>
                    </div>
                    <div className={styles.taskActions}>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDeleteProject(project._id)}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>

      {showTaskModal && (
        <div className={styles.overlay} onClick={() => setShowTaskModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h2 className={styles.modalTitle}>Create New Task</h2>
                <p className={styles.modalSub}>Add a new task and assign it to a team member</p>
              </div>
              <button className={styles.closeBtn} onClick={() => setShowTaskModal(false)}>
                <X size={18} />
              </button>
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
                  onChange={e => handleTaskProjectChange(e.target.value)}
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
                  disabled={!taskProject}
                >
                  <option value="">
                    {taskProject ? 'Select member (optional)' : 'Select project first'}
                  </option>
                  {projectMembers.map(m => (
                    <option key={m.userId._id} value={m.userId._id}>
                      {m.userId.name} — {m.userId.email} ({m.role})
                    </option>
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

      {showProjectModal && (
        <div className={styles.overlay} onClick={() => setShowProjectModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h2 className={styles.modalTitle}>Create New Project</h2>
                <p className={styles.modalSub}>Add a new project to your workspace</p>
              </div>
              <button className={styles.closeBtn} onClick={() => setShowProjectModal(false)}>
                <X size={18} />
              </button>
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

      {showProjectDetail && selectedProject && (
        <div className={styles.overlay} onClick={() => setShowProjectDetail(false)}>
          <div className={styles.detailModal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h2 className={styles.modalTitle}>{selectedProject.name}</h2>
                <p className={styles.modalSub}>{selectedProject.description}</p>
              </div>
              <button className={styles.closeBtn} onClick={() => setShowProjectDetail(false)}>
                <X size={18} />
              </button>
            </div>
            <div className={styles.detailSection}>
              <h3 className={styles.detailSectionTitle}>Members</h3>
              <div className={styles.memberSearch}>
                <input
                  className={styles.input}
                  placeholder="Search by name or email..."
                  value={memberSearch}
                  onChange={e => handleMemberSearch(e.target.value)}
                />
                <select
                  className={styles.filterSelect}
                  value={selectedRole}
                  onChange={e => setSelectedRole(e.target.value)}
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              {memberSearchResults.length > 0 && (
                <div className={styles.searchResults}>
                  {memberSearchResults.map(u => (
                    <div key={u._id} className={styles.searchResultItem}>
                      <span>{u.name} — {u.email}</span>
                      <button
                        className={styles.addBtn}
                        onClick={() => handleAddMember(u._id)}
                      >
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className={styles.memberList}>
                {selectedProjectMembers.map(m => (
                  <div key={m._id} className={styles.memberItem}>
                    <div className={styles.memberAvatar}>
                      {m.userId.name.charAt(0).toUpperCase()}
                    </div>
                    <div className={styles.memberInfo}>
                      <span className={styles.memberName}>{m.userId.name}</span>
                      <span className={styles.memberEmail}>{m.userId.email}</span>
                    </div>
                    <span className={styles.memberRole}>{m.role}</span>
                    {m.role !== 'owner' && (
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleRemoveMember(m.userId._id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.detailSection}>
              <h3 className={styles.detailSectionTitle}>
                Tasks ({getTaskCount(selectedProject._id)})
              </h3>
              <div className={styles.taskList}>
                {tasks
                  .filter(t => t.projectId?._id === selectedProject._id)
                  .map(task => (
                    <div key={task._id} className={`${styles.taskCard} ${isOverdue(task.dueDate) && task.status !== 'completed' ? styles.overdue : ''}`}>
                      <div className={styles.taskLeft}>
                        <div className={styles.taskTitleRow}>
                          <h3 className={styles.taskTitle}>{task.title}</h3>
                          <span className={`${styles.priority} ${styles[task.priority]}`}>
                            {task.priority}
                          </span>
                          {isOverdue(task.dueDate) && task.status !== 'completed' && (
                            <span className={styles.overdueTag}>Overdue</span>
                          )}
                        </div>
                        <div className={styles.taskMeta}>
                          {task.assignedTo && (
                            <span className={styles.metaItem}>
                              <User size={13} /> {task.assignedTo.name}
                            </span>
                          )}
                          {task.dueDate && (
                            <span className={styles.metaItem}>
                              <Calendar size={13} /> {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className={styles[`status_${task.status?.replace('-', '_')}`]}>
                        {task.status}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}