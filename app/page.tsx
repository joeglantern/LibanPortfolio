"use client"

import React from 'react'
import { useState, useEffect } from "react"
import { Plus, Trash2, CheckSquare, Search, Calendar, Star, Clock, Moon, Sun, Share2, SortAsc, User, Mail, Github, Linkedin, SortDesc, Instagram, Phone, BadgeCheck, ExternalLink, Laptop, Smartphone, MessageCircle, Music } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Checkbox } from "../components/ui/checkbox"
import { Progress } from "../components/ui/progress"
import Image from "next/image"

const colorClasses = [
  "bg-red-100",
  "bg-blue-100",
  "bg-green-100",
  "bg-yellow-100",
  "bg-purple-100",
  "bg-pink-100",
  "bg-indigo-100",
  "bg-teal-100",
]

const categories = [
  { name: "Work", color: "bg-blue-100" },
  { name: "Personal", color: "bg-green-100" },
  { name: "Shopping", color: "bg-yellow-100" },
  { name: "Health", color: "bg-red-100" },
  { name: "Education", color: "bg-purple-100" },
]

const priorities = [
  { name: "High", icon: "⚡", color: "text-red-500" },
  { name: "Medium", icon: "⭐", color: "text-yellow-500" },
  { name: "Low", icon: "🔵", color: "text-blue-500" },
]

interface Task {
  id: number
  text: string
  completed: boolean
  color: string
  category: string
  priority: string
  dueDate?: string
  notes?: string
  createdAt: string
  lastModified?: string
}

const otherApps = [
  {
    name: "Memory Game",
    icon: "🎮",
    color: "bg-green-500",
    url: "https://memorygame254.netlify.app/"
  },
  {
    name: "TPH ecommerce store",
    icon: <Image src="/Plughublogo.jpg" alt="TPH Store" width={24} height={24} className="w-6 h-6 object-contain" />,
    color: "bg-yellow-500",
    url: "https://silly-puppy-a7b058.netlify.app/"
  },
  {
    name: "Typni",
    icon: <Image src="/logo.png" alt="Typni" width={24} height={24} className="w-6 h-6 object-contain" />,
    color: "bg-pink-500",
    url: "https://typniniaje.netlify.app/"
  }
]

const dockApps = [
  {
    name: "Memory Game",
    icon: "🎮",
    color: "bg-green-500",
    url: "https://memorygame254.netlify.app/",
    description: "Test your memory with this fun game"
  },
  {
    name: "TPH ecommerce store",
    icon: <Image src="/Plughublogo.jpg" alt="TPH Store" width={32} height={32} className="w-8 h-8 object-contain" />,
    color: "bg-yellow-500",
    url: "https://silly-puppy-a7b058.netlify.app/",
    description: "Modern e-commerce platform"
  },
  {
    name: "Typni",
    icon: <Image src="/logo.png" alt="Typni" width={32} height={32} className="w-8 h-8 object-contain" />,
    color: "bg-pink-500",
    url: "https://typniniaje.netlify.app/",
    description: "Youth empowerment platform"
  }
]

export default function Home() {
  const [deviceType, setDeviceType] = useState<'phone' | 'laptop'>('phone')
  const [showGuide, setShowGuide] = useState(true)
  const [tasks, setTasks] = useState<Task[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tasks')
      return saved ? JSON.parse(saved) : []
    }
    return []
  })
  const [newTask, setNewTask] = useState("")
  const [isAppOpen, setIsAppOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPriority, setSelectedPriority] = useState("Medium")
  const [dueDate, setDueDate] = useState("")
  const [notes, setNotes] = useState("")
  const [showCompleted, setShowCompleted] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'createdAt'>('createdAt')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [currentApp, setCurrentApp] = useState<'tasks' | 'profile'>('tasks')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }, [])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  const addTask = () => {
    if (newTask.trim() !== "") {
      const category = selectedCategory === "All" ? categories[0].name : selectedCategory
      const color = categories.find(c => c.name === category)?.color || colorClasses[0]
      setTasks([
        ...tasks,
        {
          id: Date.now(),
          text: newTask,
          completed: false,
          color,
          category,
          priority: selectedPriority,
          dueDate: dueDate || undefined,
          notes: notes || undefined,
          createdAt: new Date().toISOString(),
          lastModified: new Date().toISOString(),
        },
      ])
      setNewTask("")
      setDueDate("")
      setNotes("")
    }
  }

  const toggleTask = (id: number) => {
    setTasks(tasks.map((task) => 
      task.id === id 
        ? { ...task, completed: !task.completed, lastModified: new Date().toISOString() } 
        : task
    ))
  }

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const shareTask = async (task: Task) => {
    const taskText = `
Task: ${task.text}
Category: ${task.category}
Priority: ${task.priority}
${task.dueDate ? `Due Date: ${new Date(task.dueDate).toLocaleDateString()}` : ''}
${task.notes ? `Notes: ${task.notes}` : ''}
    `.trim()

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Task Details',
          text: taskText,
        })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      navigator.clipboard.writeText(taskText)
      alert('Task details copied to clipboard!')
    }
  }

  const sortTasks = (tasks: Task[]) => {
    return [...tasks].sort((a, b) => {
      if (sortBy === 'priority') {
        const priorityOrder = { High: 3, Medium: 2, Low: 1 }
        const diff = priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder]
        return sortDirection === 'desc' ? -diff : diff
      }
      if (sortBy === 'dueDate') {
        const dateA = a.dueDate ? new Date(a.dueDate).getTime() : 0
        const dateB = b.dueDate ? new Date(b.dueDate).getTime() : 0
        return sortDirection === 'desc' ? dateB - dateA : dateA - dateB
      }
      const timeA = new Date(a.createdAt).getTime()
      const timeB = new Date(b.createdAt).getTime()
      return sortDirection === 'desc' ? timeB - timeA : timeA - timeB
    })
  }

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.text.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || task.category === selectedCategory
    const matchesCompleted = showCompleted || !task.completed
    return matchesSearch && matchesCategory && matchesCompleted
  })

  const filteredAndSortedTasks = sortTasks(filteredTasks)
  const completedTasks = tasks.filter((task) => task.completed).length
  const progress = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0

  const getTaskStats = () => {
    const total = tasks.length
    const completed = completedTasks
    const pending = total - completed
    const highPriority = tasks.filter(t => t.priority === "High").length
    return { total, completed, pending, highPriority }
  }

  const stats = getTaskStats()

  const kenyaColors = {
    red: "from-red-600 to-red-700",
    green: "from-green-600 to-green-700",
    black: "from-gray-800 to-gray-900"
  }

  const toggleDevice = () => {
    setDeviceType(deviceType === 'phone' ? 'laptop' : 'phone')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative w-32 h-32 mx-auto mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-red-500 to-black rounded-full animate-spin-slow"></div>
            <div className="absolute inset-2 bg-black rounded-full"></div>
            <Image
              src="/joe2.jpg"
              alt="Liban Joe"
              width={128}
              height={128}
              className="absolute inset-2 rounded-full object-cover animate-pulse"
            />
          </div>
          <h1 className="text-3xl font-bold text-white animate-fade-up">Welcome to My Portfolio</h1>
          <p className="text-gray-400 max-w-md mx-auto animate-fade-up">
            I'm Joseph Liban M., a Full Stack Developer passionate about creating beautiful and functional web applications.
            Explore my projects and get in touch!
          </p>
          <div className="animate-bounce mt-8">
            <span className="text-white text-sm">Scroll to explore</span>
            <div className="mt-2">↓</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex items-center justify-center min-h-screen bg-gradient-to-b ${
      isDarkMode ? 'from-gray-800 to-gray-900' : 'from-green-600 to-red-600'
    } p-4`}>
      {showGuide && (
        <div className="fixed top-4 left-4 right-4 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg z-50 animate-fade-in">
          <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
            <span className="text-2xl">🇰🇪</span> Welcome to My Portfolio!
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            I'm excited to show you my work! Here's what you can explore:
            <br/>1. Switch between phone and MacBook view
            <br/>2. Try the dark/light mode
            <br/>3. Check out my Task Tracker app
            <br/>4. Visit my profile to see other projects
            <br/>5. Get in touch via WhatsApp, email, or phone
            <br/>6. Experience the Kenyan-themed design
          </p>
          <Button onClick={() => setShowGuide(false)} className="w-full">
            Let's Explore Together!
          </Button>
        </div>
      )}

      {/* Add floating Kenyan flag */}
      <div className="fixed top-4 left-4 animate-bounce z-50">
        <span className="text-4xl">🇰🇪</span>
      </div>

      {/* Update WhatsApp floating button */}
      <a
        href="https://wa.me/254758009278"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 p-3 rounded-full bg-[#25D366] hover:bg-[#128C7E] transition-all hover:scale-110 shadow-lg z-50 animate-bounce"
      >
        <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>

      <div className="fixed top-4 right-4 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleDevice}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
        >
          {deviceType === 'phone' ? (
            <><Laptop className="w-4 h-4 mr-2" /> Switch to Laptop</>
          ) : (
            <><Smartphone className="w-4 h-4 mr-2" /> Switch to Phone</>
          )}
        </Button>
      </div>

      <div className={`relative ${
        deviceType === 'phone' 
          ? 'w-[375px] h-[812px]' 
          : 'w-[1024px] h-[640px]'
      } transition-all duration-500 transform hover:scale-[1.02]`}>
        {deviceType === 'phone' ? (
          // Phone Frame
          <div className="absolute inset-0 bg-gradient-to-b from-gray-200 to-gray-300 rounded-[60px] shadow-2xl">
            <div className="absolute inset-[3px] bg-gray-800 rounded-[57px] overflow-hidden">
              {/* Dynamic Island */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[120px] h-[35px] bg-black rounded-b-[24px] z-20">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-[12px] h-[12px] rounded-full bg-gray-800">
                    <div className="absolute inset-[1px] rounded-full bg-gray-900"></div>
                  </div>
                  <div className="w-[8px] h-[8px] rounded-full bg-gray-700 ml-2"></div>
                </div>
              </div>
              
              {/* Main Screen */}
              <div className="absolute inset-[1px] bg-[url('/wallpaper.svg')] bg-cover bg-center rounded-[56px] overflow-hidden">
                {/* Add centered Kenyan flag */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-8xl opacity-20">🇰🇪</span>
                </div>
                <div className="h-full overflow-y-auto pt-12 pb-20 px-4 backdrop-blur-md backdrop-brightness-75">
                  {!isAppOpen ? (
                    <>
                      <div className="grid grid-cols-4 gap-4 p-4">
                        <button
                          onClick={() => {
                            setIsAppOpen(true)
                            setCurrentApp('tasks')
                          }}
                          className="flex flex-col items-center justify-center w-16 h-16 bg-blue-500 rounded-2xl shadow-lg hover:scale-105 transition-transform animate-fade-in"
                        >
                          <CheckSquare className="w-8 h-8 text-white" />
                          <span className="text-xs text-white mt-1">Tasks</span>
                        </button>

                        <button
                          onClick={() => {
                            setIsAppOpen(true)
                            setCurrentApp('profile')
                          }}
                          className="flex flex-col items-center justify-center w-16 h-16 rounded-2xl shadow-lg hover:scale-105 transition-transform animate-fade-in overflow-hidden relative"
                        >
                          <Image
                            src="/joe2.jpg"
                            alt="Profile"
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                          <span className="text-xs text-white absolute bottom-0 w-full bg-black/50 py-0.5">Profile</span>
                        </button>

                        {otherApps.map((app, index) => (
                          <a
                            key={app.name}
                            href={app.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex flex-col items-center justify-center w-16 h-16 ${app.color} rounded-2xl shadow-lg hover:scale-105 transition-transform animate-fade-in`}
                            style={{ animationDelay: `${index * 100}ms` }}
                          >
                            <span className="text-2xl">{app.icon}</span>
                            <span className="text-xs text-white mt-1">{app.name}</span>
                          </a>
                        ))}
                      </div>
                      
                      {/* Mobile Widgets - Inside frame */}
                      <div className="fixed bottom-24 left-4 right-4 space-y-3 max-h-[30vh] overflow-y-auto pb-4 px-2">
                        {dockApps.map((app) => (
                          <div key={app.name} className="bg-white/10 backdrop-blur-md rounded-xl p-3 shadow-lg hover:scale-105 transition-transform">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 ${app.color} rounded-lg flex items-center justify-center text-lg`}>
                                {app.icon}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="text-white text-sm font-semibold truncate">{app.name}</h3>
                                <p className="text-white/70 text-xs truncate">{app.description}</p>
                              </div>
                              <a
                                href={app.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white/80 hover:text-white flex-shrink-0"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Dock */}
                      <div className="absolute bottom-0 left-4 right-4 h-20 bg-white/10 backdrop-blur-md rounded-t-2xl flex items-center justify-around px-6">
                        {dockApps.map((app) => (
                          <a
                            key={app.name}
                            href={app.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center gap-1 hover:scale-110 transition-transform"
                          >
                            <div className={`w-12 h-12 ${app.color} rounded-xl flex items-center justify-center text-2xl shadow-lg`}>
                              {app.icon}
                            </div>
                            <span className="text-[10px] text-white font-medium">{app.name}</span>
                          </a>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className={`bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg ${isDarkMode ? 'dark:bg-gray-800/90 dark:text-white' : ''}`}>
                      {currentApp === 'tasks' ? (
                        <>
                          <div className="flex justify-between items-center mb-4">
                            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Task Tracker</h1>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={toggleDarkMode}
                                className="text-gray-600 dark:text-gray-300"
                              >
                                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsAppOpen(false)}
                                className="text-gray-600 dark:text-gray-300"
                              >
                                ←
                              </Button>
                            </div>
                          </div>

                          <div className="mb-4">
                            <div className="relative">
                              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                              <Input
                                type="text"
                                placeholder="Search tasks..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                              />
                            </div>
                          </div>

                          <div className="flex items-center gap-2 mb-4">
                            <select
                              value={sortBy}
                              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                              className="rounded-md border border-gray-300 p-2 dark:bg-gray-700 dark:border-gray-600"
                            >
                              <option value="createdAt">Date Created</option>
                              <option value="dueDate">Due Date</option>
                              <option value="priority">Priority</option>
                            </select>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                            >
                              {sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                            </Button>
                          </div>

                          <div className="space-y-3 mb-4">
                <Input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="Enter a new task"
                              className="bg-white/50"
                            />
                            
                            <div className="flex gap-2 overflow-x-auto pb-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedCategory("All")}
                                className={`${selectedCategory === "All" ? "bg-gray-200" : ""}`}
                              >
                                All
                              </Button>
                              {categories.map((category) => (
                                <Button
                                  key={category.name}
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setSelectedCategory(category.name)}
                                  className={`${category.color} ${
                                    selectedCategory === category.name ? "ring-2 ring-blue-500" : ""
                                  }`}
                                >
                                  {category.name}
                                </Button>
                              ))}
                            </div>

                            <div className="flex gap-2">
                              <div className="flex-1">
                                <select
                                  value={selectedPriority}
                                  onChange={(e) => setSelectedPriority(e.target.value)}
                                  className="w-full rounded-md border border-gray-300 p-2"
                                >
                                  {priorities.map((priority) => (
                                    <option key={priority.name} value={priority.name}>
                                      {priority.icon} {priority.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <Input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className="flex-1"
                              />
                            </div>

                            <textarea
                              value={notes}
                              onChange={(e) => setNotes(e.target.value)}
                              placeholder="Add notes (optional)"
                              className="w-full rounded-md border border-gray-300 p-2 h-20 resize-none"
                            />

                            <Button onClick={addTask} className="w-full bg-blue-500 hover:bg-blue-600">
                  <Plus className="h-4 w-4 mr-2" />
                              Add Task
                </Button>
              </div>

                          <div className="grid grid-cols-2 gap-2 mb-4">
                            <div className="bg-blue-50 p-3 rounded-lg dark:bg-blue-900/20">
                              <div className="text-sm text-gray-600 dark:text-gray-400">Total Tasks</div>
                              <div className="text-xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</div>
                            </div>
                            <div className="bg-green-50 p-3 rounded-lg dark:bg-green-900/20">
                              <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
                              <div className="text-xl font-bold text-green-600 dark:text-green-400">{stats.completed}</div>
                            </div>
                            <div className="bg-yellow-50 p-3 rounded-lg dark:bg-yellow-900/20">
                              <div className="text-sm text-gray-600 dark:text-gray-400">Pending</div>
                              <div className="text-xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</div>
                            </div>
                            <div className="bg-red-50 p-3 rounded-lg dark:bg-red-900/20">
                              <div className="text-sm text-gray-600 dark:text-gray-400">High Priority</div>
                              <div className="text-xl font-bold text-red-600 dark:text-red-400">{stats.highPriority}</div>
                            </div>
                          </div>

              <div className="space-y-2">
                            {filteredAndSortedTasks.map((task) => (
                              <div
                                key={task.id}
                                className={`flex items-center p-3 rounded-md ${task.color} transition-all hover:shadow-md ${
                                  isDarkMode ? 'dark:bg-gray-700/50' : ''
                                }`}
                              >
                    <Checkbox
                      id={`task-${task.id}`}
                      checked={task.completed}
                      onCheckedChange={() => toggleTask(task.id)}
                    />
                                <div className="ml-2 flex-grow">
                    <label
                      htmlFor={`task-${task.id}`}
                                    className={`flex flex-col ${task.completed ? "line-through text-gray-500" : "text-gray-800 dark:text-white"}`}
                                  >
                                    <span className="font-medium">{task.text}</span>
                                    <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                                      <span className={`px-2 py-0.5 rounded-full ${task.color}`}>
                                        {task.category}
                                      </span>
                                      {task.dueDate && (
                                        <span className="flex items-center">
                                          <Calendar className="h-3 w-3 mr-1" />
                                          {new Date(task.dueDate).toLocaleDateString()}
                                        </span>
                                      )}
                                      <span className={priorities.find(p => p.name === task.priority)?.color}>
                                        {priorities.find(p => p.name === task.priority)?.icon}
                                      </span>
                                    </div>
                                    {task.notes && (
                                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">{task.notes}</span>
                                    )}
                    </label>
                                </div>
                                <div className="flex gap-1">
                                  <Button variant="ghost" size="sm" onClick={() => shareTask(task)}>
                                    <Share2 className="h-4 w-4" />
                                  </Button>
                    <Button variant="ghost" size="sm" onClick={() => deleteTask(task.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                                </div>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
                              <span>Progress: {completedTasks} / {tasks.length} tasks completed</span>
                              <span>{Math.round(progress)}%</span>
                            </div>
                            <Progress value={progress} className="w-full" />
                          </div>
                        </>
                      ) : (
                        <div className="text-center animate-fade-up">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsAppOpen(false)}
                            className="absolute top-4 right-4"
                          >
                            ←
                          </Button>
                          <div className="mb-6">
                            <div className="relative w-24 h-24 mx-auto mb-4">
                              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-full animate-spin-slow"></div>
                              <div className="absolute inset-1 bg-white dark:bg-gray-800 rounded-full"></div>
                              <Image
                                src="/joe2.jpg"
                                alt="Liban Joe"
                                width={96}
                                height={96}
                                className="absolute inset-1 rounded-full object-cover"
                              />
                            </div>
                            <div className="flex items-center justify-center gap-2">
                              <h2 className="text-2xl font-bold mb-2 dark:text-white">Joseph Liban M.</h2>
                              <BadgeCheck className="w-5 h-5 text-blue-500" />
                            </div>
                            <p className="text-gray-600 dark:text-gray-300">Full Stack Developer</p>
                          </div>

                          <div className="space-y-4">
                            <p className="text-gray-700 dark:text-gray-300">
                              Passionate developer creating intuitive and efficient web applications.
                            </p>

                            <div className="flex flex-wrap justify-center gap-3">
                              <a
                                href="mailto:libanjoe7@gmail.com"
                                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors hover:scale-110"
                              >
                                <Mail className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                              </a>
                              <a
                                href="https://github.com/joeglantern/Task-Tracker"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors hover:scale-110"
                              >
                                <Github className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                              </a>
                              <a
                                href="https://www.instagram.com/joe_.glantern/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors hover:scale-110"
                              >
                                <Instagram className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                              </a>
                              <a
                                href="https://wa.me/254758009278"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-full bg-[#25D366] hover:bg-[#128C7E] transition-colors hover:scale-110"
                              >
                                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                </svg>
                              </a>
                              <a
                                href="https://www.tiktok.com/@joe_lib_an"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-full bg-black hover:bg-gray-800 transition-colors hover:scale-110"
                              >
                                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                                </svg>
                              </a>
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center justify-center gap-2">
                                <Phone className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                <a href="tel:+254734414914" className="text-gray-700 dark:text-gray-300 hover:underline">
                                  +254 734 414 914
                                </a>
                              </div>
                              <div className="flex items-center justify-center gap-2">
                                <Phone className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                <a href="tel:+254758009278" className="text-gray-700 dark:text-gray-300 hover:underline">
                                  +254 758 009 278
                                </a>
                              </div>
                            </div>

                            <div className="mt-6 space-y-3">
                              <h3 className="font-semibold dark:text-white flex items-center justify-center gap-2">
                                Skills
                                <span className="text-sm text-blue-500">Verified</span>
                              </h3>
                              <div className="flex flex-wrap gap-2 justify-center">
                                {["React", "Next.js", "TypeScript", "Node.js", "Tailwind CSS"].map((skill) => (
                                  <span
                                    key={skill}
                                    className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100 rounded-full text-sm hover:scale-105 transition-transform"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="mt-6">
                              <h3 className="font-semibold dark:text-white mb-3">My Projects</h3>
                              <div className="grid grid-cols-2 gap-3">
                                {otherApps.map((app) => (
                                  <a
                                    key={app.name}
                                    href={app.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all hover:scale-105 flex items-center gap-2"
                                  >
                                    <span className="text-xl">{app.icon}</span>
                                    <span className="text-sm text-gray-700 dark:text-gray-300">{app.name}</span>
                                    <ExternalLink className="w-4 h-4 ml-auto text-gray-500" />
                                  </a>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              </div>
            </div>
          ) : (
          // MacBook Frame
          <div className="absolute inset-0 bg-gradient-to-b from-gray-200 to-gray-300 rounded-lg shadow-2xl">
            <div className="absolute inset-[3px] bg-gray-800 rounded-lg overflow-hidden">
              <div className="absolute inset-[1px] bg-black rounded-t-lg">
                {/* Camera */}
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full bg-gray-800">
                  <div className="absolute inset-[0.5px] rounded-full bg-gray-900"></div>
                </div>
                {/* Screen Content */}
                <div className="absolute inset-[4px] rounded-lg overflow-hidden bg-[url('/wallpaper.svg')] bg-cover bg-center">
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-8xl opacity-20">🇰🇪</span>
                  </div>
                  <div className="relative h-full overflow-y-auto p-6 backdrop-blur-md backdrop-brightness-75">
                    {!isAppOpen ? (
                      <>
                        <div className="grid grid-cols-6 gap-6 p-6">
              <button
                            onClick={() => {
                              setIsAppOpen(true)
                              setCurrentApp('tasks')
                            }}
                            className="flex flex-col items-center justify-center w-16 h-16 bg-blue-500 rounded-2xl shadow-lg hover:scale-105 transition-transform animate-fade-in"
              >
                <CheckSquare className="w-8 h-8 text-white" />
                <span className="text-xs text-white mt-1">Tasks</span>
              </button>

                          <button
                            onClick={() => {
                              setIsAppOpen(true)
                              setCurrentApp('profile')
                            }}
                            className="flex flex-col items-center justify-center w-16 h-16 rounded-2xl shadow-lg hover:scale-105 transition-transform animate-fade-in overflow-hidden relative"
                          >
                            <Image
                              src="/joe2.jpg"
                              alt="Profile"
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                            <span className="text-xs text-white absolute bottom-0 w-full bg-black/50 py-0.5">Profile</span>
                          </button>

                          {otherApps.map((app, index) => (
                            <a
                              key={app.name}
                              href={app.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`flex flex-col items-center justify-center w-16 h-16 ${app.color} rounded-2xl shadow-lg hover:scale-105 transition-transform animate-fade-in`}
                              style={{ animationDelay: `${index * 100}ms` }}
                            >
                              <span className="text-2xl">{app.icon}</span>
                              <span className="text-xs text-white mt-1">{app.name}</span>
                            </a>
                          ))}
                        </div>

                        {/* Laptop Widgets - Inside screen content */}
                        <div className="fixed right-8 top-8 space-y-3 w-64 max-h-[60vh] overflow-y-auto">
                          {dockApps.map((app) => (
                            <div key={app.name} className="bg-white/10 backdrop-blur-md rounded-xl p-3 shadow-lg hover:scale-105 transition-transform">
                              <div className="flex items-center gap-3 mb-2">
                                <div className={`w-10 h-10 ${app.color} rounded-lg flex items-center justify-center text-xl`}>
                                  {app.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="text-white font-semibold truncate">{app.name}</h3>
                                  <p className="text-white/70 text-xs truncate">{app.description}</p>
                                </div>
                              </div>
                              <a
                                href={app.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-white/80 hover:text-white flex items-center gap-1"
                              >
                                Visit <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          ))}
                        </div>

                        {/* Laptop Dock - Inside screen content */}
                        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center gap-4 px-6">
                          {dockApps.map((app) => (
                            <a
                              key={app.name}
                              href={app.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex flex-col items-center gap-1 hover:scale-110 transition-transform group"
                            >
                              <div className={`w-10 h-10 ${app.color} rounded-xl flex items-center justify-center text-xl shadow-lg group-hover:shadow-xl`}>
                                {app.icon}
                              </div>
                              <span className="text-[10px] text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity">{app.name}</span>
                            </a>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className={`bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg ${isDarkMode ? 'dark:bg-gray-800/90 dark:text-white' : ''}`}>
                        {currentApp === 'tasks' ? (
                          <>
                            <div className="flex justify-between items-center mb-4">
                              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Task Tracker</h1>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={toggleDarkMode}
                                  className="text-gray-600 dark:text-gray-300"
                                >
                                  {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setIsAppOpen(false)}
                                  className="text-gray-600 dark:text-gray-300"
                                >
                                  ←
                                </Button>
                              </div>
                            </div>

                            <div className="mb-4">
                              <div className="relative">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                <Input
                                  type="text"
                                  placeholder="Search tasks..."
                                  value={searchQuery}
                                  onChange={(e) => setSearchQuery(e.target.value)}
                                  className="pl-10"
                                />
                              </div>
                            </div>

                            <div className="flex items-center gap-2 mb-4">
                              <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                                className="rounded-md border border-gray-300 p-2 dark:bg-gray-700 dark:border-gray-600"
                              >
                                <option value="createdAt">Date Created</option>
                                <option value="dueDate">Due Date</option>
                                <option value="priority">Priority</option>
                              </select>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                              >
                                {sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                              </Button>
                            </div>

                            <div className="space-y-3 mb-4">
                              <Input
                                type="text"
                                value={newTask}
                                onChange={(e) => setNewTask(e.target.value)}
                                placeholder="Enter a new task"
                                className="bg-white/50"
                              />
                              
                              <div className="flex gap-2 overflow-x-auto pb-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setSelectedCategory("All")}
                                  className={`${selectedCategory === "All" ? "bg-gray-200" : ""}`}
                                >
                                  All
                                </Button>
                                {categories.map((category) => (
                                  <Button
                                    key={category.name}
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSelectedCategory(category.name)}
                                    className={`${category.color} ${
                                      selectedCategory === category.name ? "ring-2 ring-blue-500" : ""
                                    }`}
                                  >
                                    {category.name}
                                  </Button>
                                ))}
                              </div>

                              <div className="flex gap-2">
                                <div className="flex-1">
                                  <select
                                    value={selectedPriority}
                                    onChange={(e) => setSelectedPriority(e.target.value)}
                                    className="w-full rounded-md border border-gray-300 p-2"
                                  >
                                    {priorities.map((priority) => (
                                      <option key={priority.name} value={priority.name}>
                                        {priority.icon} {priority.name}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                <Input
                                  type="date"
                                  value={dueDate}
                                  onChange={(e) => setDueDate(e.target.value)}
                                  className="flex-1"
                                />
                              </div>

                              <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Add notes (optional)"
                                className="w-full rounded-md border border-gray-300 p-2 h-20 resize-none"
                              />

                              <Button onClick={addTask} className="w-full bg-blue-500 hover:bg-blue-600">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Task
                              </Button>
                            </div>

                            <div className="grid grid-cols-2 gap-2 mb-4">
                              <div className="bg-blue-50 p-3 rounded-lg dark:bg-blue-900/20">
                                <div className="text-sm text-gray-600 dark:text-gray-400">Total Tasks</div>
                                <div className="text-xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</div>
                              </div>
                              <div className="bg-green-50 p-3 rounded-lg dark:bg-green-900/20">
                                <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
                                <div className="text-xl font-bold text-green-600 dark:text-green-400">{stats.completed}</div>
                              </div>
                              <div className="bg-yellow-50 p-3 rounded-lg dark:bg-yellow-900/20">
                                <div className="text-sm text-gray-600 dark:text-gray-400">Pending</div>
                                <div className="text-xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</div>
                              </div>
                              <div className="bg-red-50 p-3 rounded-lg dark:bg-red-900/20">
                                <div className="text-sm text-gray-600 dark:text-gray-400">High Priority</div>
                                <div className="text-xl font-bold text-red-600 dark:text-red-400">{stats.highPriority}</div>
                              </div>
                            </div>

                            <div className="space-y-2">
                              {filteredAndSortedTasks.map((task) => (
                                <div
                                  key={task.id}
                                  className={`flex items-center p-3 rounded-md ${task.color} transition-all hover:shadow-md ${
                                    isDarkMode ? 'dark:bg-gray-700/50' : ''
                                  }`}
                                >
                                  <Checkbox
                                    id={`task-${task.id}`}
                                    checked={task.completed}
                                    onCheckedChange={() => toggleTask(task.id)}
                                  />
                                  <div className="ml-2 flex-grow">
                                    <label
                                      htmlFor={`task-${task.id}`}
                                      className={`flex flex-col ${task.completed ? "line-through text-gray-500" : "text-gray-800 dark:text-white"}`}
                                    >
                                      <span className="font-medium">{task.text}</span>
                                      <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                                        <span className={`px-2 py-0.5 rounded-full ${task.color}`}>
                                          {task.category}
                                        </span>
                                        {task.dueDate && (
                                          <span className="flex items-center">
                                            <Calendar className="h-3 w-3 mr-1" />
                                            {new Date(task.dueDate).toLocaleDateString()}
                                          </span>
                                        )}
                                        <span className={priorities.find(p => p.name === task.priority)?.color}>
                                          {priorities.find(p => p.name === task.priority)?.icon}
                                        </span>
                                      </div>
                                      {task.notes && (
                                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">{task.notes}</span>
                                      )}
                                    </label>
                                  </div>
                                  <div className="flex gap-1">
                                    <Button variant="ghost" size="sm" onClick={() => shareTask(task)}>
                                      <Share2 className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => deleteTask(task.id)}>
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="mt-4">
                              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
                                <span>Progress: {completedTasks} / {tasks.length} tasks completed</span>
                                <span>{Math.round(progress)}%</span>
                              </div>
                              <Progress value={progress} className="w-full" />
                            </div>
                          </>
                        ) : (
                          <div className="text-center animate-fade-up">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setIsAppOpen(false)}
                              className="absolute top-4 right-4"
                            >
                              ←
                            </Button>
                            <div className="mb-6">
                              <div className="relative w-24 h-24 mx-auto mb-4">
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-full animate-spin-slow"></div>
                                <div className="absolute inset-1 bg-white dark:bg-gray-800 rounded-full"></div>
                                <Image
                                  src="/joe2.jpg"
                                  alt="Liban Joe"
                                  width={96}
                                  height={96}
                                  className="absolute inset-1 rounded-full object-cover"
                                />
                              </div>
                              <div className="flex items-center justify-center gap-2">
                                <h2 className="text-2xl font-bold mb-2 dark:text-white">Joseph Liban M.</h2>
                                <BadgeCheck className="w-5 h-5 text-blue-500" />
                              </div>
                              <p className="text-gray-600 dark:text-gray-300">Full Stack Developer</p>
                            </div>

                            <div className="space-y-4">
                              <p className="text-gray-700 dark:text-gray-300">
                                Passionate developer creating intuitive and efficient web applications.
                              </p>

                              <div className="flex flex-wrap justify-center gap-3">
                                <a
                                  href="mailto:libanjoe7@gmail.com"
                                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors hover:scale-110"
                                >
                                  <Mail className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                                </a>
                                <a
                                  href="https://github.com/joeglantern/Task-Tracker"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors hover:scale-110"
                                >
                                  <Github className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                                </a>
                                <a
                                  href="https://www.instagram.com/joe_.glantern/"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors hover:scale-110"
                                >
                                  <Instagram className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                                </a>
                                <a
                                  href="https://wa.me/254758009278"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 rounded-full bg-[#25D366] hover:bg-[#128C7E] transition-colors hover:scale-110"
                                >
                                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                  </svg>
                                </a>
                                <a
                                  href="https://www.tiktok.com/@joe_lib_an"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 rounded-full bg-black hover:bg-gray-800 transition-colors hover:scale-110"
                                >
                                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                                  </svg>
                                </a>
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center justify-center gap-2">
                                  <Phone className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                  <a href="tel:+254734414914" className="text-gray-700 dark:text-gray-300 hover:underline">
                                    +254 734 414 914
                                  </a>
                                </div>
                                <div className="flex items-center justify-center gap-2">
                                  <Phone className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                  <a href="tel:+254758009278" className="text-gray-700 dark:text-gray-300 hover:underline">
                                    +254 758 009 278
                                  </a>
                                </div>
                              </div>

                              <div className="mt-6 space-y-3">
                                <h3 className="font-semibold dark:text-white flex items-center justify-center gap-2">
                                  Skills
                                  <span className="text-sm text-blue-500">Verified</span>
                                </h3>
                                <div className="flex flex-wrap gap-2 justify-center">
                                  {["React", "Next.js", "TypeScript", "Node.js", "Tailwind CSS"].map((skill) => (
                                    <span
                                      key={skill}
                                      className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100 rounded-full text-sm hover:scale-105 transition-transform"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              <div className="mt-6">
                                <h3 className="font-semibold dark:text-white mb-3">My Projects</h3>
                                <div className="grid grid-cols-2 gap-3">
                                  {otherApps.map((app) => (
                                    <a
                                      key={app.name}
                                      href={app.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all hover:scale-105 flex items-center gap-2"
                                    >
                                      <span className="text-xl">{app.icon}</span>
                                      <span className="text-sm text-gray-700 dark:text-gray-300">{app.name}</span>
                                      <ExternalLink className="w-4 h-4 ml-auto text-gray-500" />
                                    </a>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
            </div>
          )}
        </div>
                </div>
              </div>
            </div>
            {/* MacBook Base */}
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-b from-gray-300 to-gray-400 rounded-b-lg"></div>
          </div>
        )}
      </div>

      {/* Add dominant back button */}
      {isAppOpen && (
        <Button
          variant="ghost"
          size="lg"
          onClick={() => setIsAppOpen(false)}
          className="absolute top-4 left-4 text-white bg-black/20 hover:bg-black/40 backdrop-blur-sm z-50"
        >
          ← Back
        </Button>
      )}
    </div>
  )
}

