"use client"

import { useState } from "react"
import { Plus, Trash2, CheckSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"

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

interface Task {
  id: number
  text: string
  completed: boolean
  color: string
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState("")
  const [isAppOpen, setIsAppOpen] = useState(false)

  const addTask = () => {
    if (newTask.trim() !== "") {
      const color = colorClasses[tasks.length % colorClasses.length]
      setTasks([...tasks, { id: Date.now(), text: newTask, completed: false, color }])
      setNewTask("")
    }
  }

  const toggleTask = (id: number) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const completedTasks = tasks.filter((task) => task.completed).length
  const progress = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-400 to-blue-600">
      <div className="w-[375px] h-[812px] bg-[url('/placeholder.svg?height=812&width=375')] bg-cover bg-center rounded-[60px] overflow-hidden shadow-2xl border-[14px] border-black relative">
        <div className="absolute top-0 left-0 right-0 h-6 bg-black">
          <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-40 h-5 bg-black rounded-b-3xl"></div>
        </div>
        <div className="h-full overflow-y-auto pt-8 pb-20 px-4">
          {isAppOpen ? (
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg">
              <h1 className="text-2xl font-bold mb-4 text-gray-800">Task Tracker</h1>
              <div className="flex mb-4">
                <Input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="Enter a new task"
                  className="flex-grow mr-2 bg-white/50"
                />
                <Button onClick={addTask} className="bg-blue-500 hover:bg-blue-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
              <div className="space-y-2">
                {tasks.map((task) => (
                  <div key={task.id} className={`flex items-center p-2 rounded-md ${task.color}`}>
                    <Checkbox
                      id={`task-${task.id}`}
                      checked={task.completed}
                      onCheckedChange={() => toggleTask(task.id)}
                    />
                    <label
                      htmlFor={`task-${task.id}`}
                      className={`ml-2 flex-grow ${task.completed ? "line-through text-gray-500" : "text-gray-800"}`}
                    >
                      {task.text}
                    </label>
                    <Button variant="ghost" size="sm" onClick={() => deleteTask(task.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">
                  Progress: {completedTasks} / {tasks.length} tasks completed
                </p>
                <Progress value={progress} className="w-full" />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-4 p-4">
              <button
                onClick={() => setIsAppOpen(true)}
                className="flex flex-col items-center justify-center w-16 h-16 bg-blue-500 rounded-2xl shadow-lg"
              >
                <CheckSquare className="w-8 h-8 text-white" />
                <span className="text-xs text-white mt-1">Tasks</span>
              </button>
              {/* Add more app icons here for a fuller home screen look */}
            </div>
          )}
        </div>
        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gray-800 rounded-full"></div>
      </div>
    </div>
  )
}

