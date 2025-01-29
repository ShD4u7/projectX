import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { translations } from "../utils/translations"
import { Search, Filter, Check, X, ArrowUpDown, Loader2, FileText, Paperclip } from "lucide-react"

interface Task {
  id: string
  title: string
  description: string
  studentName: string
  submissionDate: string
  status: "pending" | "approved" | "rejected"
  score: number
  maxScore: number
  attachments: string[]
}

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Анализ клиентской базы",
    description: "Проведите анализ клиентской базы и выявите ключевые сегменты",
    studentName: "Иван Иванов",
    submissionDate: "2023-05-15",
    status: "pending",
    score: 0,
    maxScore: 100,
    attachments: ["analysis.pdf", "data.xlsx"],
  },
  {
    id: "2",
    title: "Разработка скрипта продаж",
    description: "Создайте эффективный скрипт продаж для нового продукта",
    studentName: "Мария Петрова",
    submissionDate: "2023-05-14",
    status: "approved",
    score: 95,
    maxScore: 100,
    attachments: ["script.docx"],
  },
  {
    id: "3",
    title: "Подготовка презентации",
    description: "Подготовьте презентацию о преимуществах нашего продукта",
    studentName: "Алексей Сидоров",
    submissionDate: "2023-05-13",
    status: "rejected",
    score: 60,
    maxScore: 100,
    attachments: ["presentation.pptx"],
  },
  // Добавьте больше задач для демонстрации пагинации
]

export function TaskReview() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(tasks)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all")
  const [selectedTasks, setSelectedTasks] = useState<string[]>([])
  const [sortConfig, setSortConfig] = useState<{ key: keyof Task; direction: "asc" | "desc" } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const tasksPerPage = 10

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    filterTasks(term, statusFilter)
  }

  const handleStatusFilter = (status: "all" | "pending" | "approved" | "rejected") => {
    setStatusFilter(status)
    filterTasks(searchTerm, status)
  }

  const filterTasks = (term: string, status: "all" | "pending" | "approved" | "rejected") => {
    let filtered = tasks
    if (term) {
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(term.toLowerCase()) ||
          task.studentName.toLowerCase().includes(term.toLowerCase()),
      )
    }
    if (status !== "all") {
      filtered = filtered.filter((task) => task.status === status)
    }
    setFilteredTasks(filtered)
    setCurrentPage(1)
  }

  const indexOfLastTask = currentPage * tasksPerPage
  const indexOfFirstTask = indexOfLastTask - tasksPerPage
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask)

  const handleTaskAction = async (taskId: string, action: "approve" | "reject", score: number) => {
    setIsLoading(true)
    // Имитация задержки сети
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, status: action === "approve" ? "approved" : "rejected", score } : task,
    )
    setTasks(updatedTasks)
    filterTasks(searchTerm, statusFilter)
    setIsLoading(false)
  }

  const handleBulkAction = async (action: "approve" | "reject") => {
    setIsLoading(true)
    // Имитация задержки сети
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const updatedTasks = tasks.map((task) =>
      selectedTasks.includes(task.id) ? { ...task, status: action === "approve" ? "approved" : "rejected" } : task,
    )
    setTasks(updatedTasks)
    setSelectedTasks([])
    filterTasks(searchTerm, statusFilter)
    setIsLoading(false)
  }

  const toggleTaskSelection = (taskId: string) => {
    setSelectedTasks((prev) => (prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]))
  }

  const handleSort = (key: keyof Task) => {
    let direction: "asc" | "desc" = "asc"
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })
  }

  useEffect(() => {
    if (sortConfig !== null) {
      const sortedTasks = [...filteredTasks].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1
        }
        return 0
      })
      setFilteredTasks(sortedTasks)
    }
  }, [sortConfig, filteredTasks]) // Added filteredTasks to dependencies

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      <h1 className="text-3xl font-bold text-foreground">{translations.taskReview.title}</h1>
      <Card>
        <CardHeader>
          <CardTitle>{translations.taskReview.taskList}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <Search className="text-muted-foreground" />
              <Input
                placeholder={translations.taskReview.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-64"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="text-muted-foreground" />
              <Select
                value={statusFilter}
                onValueChange={(value: "all" | "pending" | "approved" | "rejected") => handleStatusFilter(value)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder={translations.taskReview.filterByStatus} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{translations.taskReview.allStatuses}</SelectItem>
                  <SelectItem value="pending">{translations.taskReview.statusPending}</SelectItem>
                  <SelectItem value="approved">{translations.taskReview.statusApproved}</SelectItem>
                  <SelectItem value="rejected">{translations.taskReview.statusRejected}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedTasks.length > 0 && (
            <div className="mb-4 space-x-2">
              <Button onClick={() => handleBulkAction("approve")} disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {translations.taskReview.approveBulk}
              </Button>
              <Button onClick={() => handleBulkAction("reject")} variant="destructive" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {translations.taskReview.rejectBulk}
              </Button>
            </div>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedTasks.length === currentTasks.length}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedTasks(currentTasks.map((task) => task.id))
                      } else {
                        setSelectedTasks([])
                      }
                    }}
                  />
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("title")}>
                  {translations.taskReview.taskTitle}
                  <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("studentName")}>
                  {translations.taskReview.studentName}
                  <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("submissionDate")}>
                  {translations.taskReview.submissionDate}
                  <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("status")}>
                  {translations.taskReview.status}
                  <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("score")}>
                  {translations.taskReview.score}
                  <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
                <TableHead>{translations.taskReview.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedTasks.includes(task.id)}
                      onCheckedChange={() => toggleTaskSelection(task.id)}
                    />
                  </TableCell>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.studentName}</TableCell>
                  <TableCell>{task.submissionDate}</TableCell>
                  <TableCell>
                    {
                      translations.taskReview[
                        `status${task.status.charAt(0).toUpperCase() + task.status.slice(1)}` as keyof typeof translations.taskReview
                      ]
                    }
                  </TableCell>
                  <TableCell>
                    <Progress value={(task.score / task.maxScore) * 100} className="w-[60px]" />
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedTask(task)}>
                            {translations.taskReview.review}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>{translations.taskReview.reviewTask}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label>{translations.taskReview.taskTitle}</Label>
                              <p className="text-lg font-medium">{selectedTask?.title}</p>
                            </div>
                            <div>
                              <Label>{translations.taskReview.taskDescription}</Label>
                              <p>{selectedTask?.description}</p>
                            </div>
                            <div>
                              <Label>{translations.taskReview.studentName}</Label>
                              <p>{selectedTask?.studentName}</p>
                            </div>
                            <div>
                              <Label>{translations.taskReview.submissionDate}</Label>
                              <p>{selectedTask?.submissionDate}</p>
                            </div>
                            <div>
                              <Label>{translations.taskReview.attachments}</Label>
                              <ul className="list-disc list-inside">
                                {selectedTask?.attachments.map((attachment, index) => (
                                  <li key={index} className="flex items-center">
                                    <Paperclip className="mr-2 h-4 w-4" />
                                    <span>{attachment}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <Label>{translations.taskReview.score}</Label>
                              <div className="flex items-center space-x-2">
                                <Slider
                                  defaultValue={[selectedTask?.score || 0]}
                                  max={selectedTask?.maxScore}
                                  step={1}
                                  onValueChange={(value) => {
                                    if (selectedTask) {
                                      setSelectedTask({ ...selectedTask, score: value[0] })
                                    }
                                  }}
                                />
                                <span>
                                  {selectedTask?.score} / {selectedTask?.maxScore}
                                </span>
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="feedback">{translations.taskReview.feedback}</Label>
                              <Textarea id="feedback" placeholder={translations.taskReview.enterFeedback} />
                            </div>
                            <div className="flex justify-end space-x-2">
                              <Button
                                onClick={() =>
                                  selectedTask && handleTaskAction(selectedTask.id, "approve", selectedTask.score)
                                }
                                disabled={isLoading}
                              >
                                {isLoading ? (
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                  <Check className="mr-2 h-4 w-4" />
                                )}
                                {translations.taskReview.approve}
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() =>
                                  selectedTask && handleTaskAction(selectedTask.id, "reject", selectedTask.score)
                                }
                                disabled={isLoading}
                              >
                                {isLoading ? (
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                  <X className="mr-2 h-4 w-4" />
                                )}
                                {translations.taskReview.reject}
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Pagination
            className="mt-4"
            currentPage={currentPage}
            totalPages={Math.ceil(filteredTasks.length / tasksPerPage)}
            onPageChange={setCurrentPage}
          />
        </CardContent>
      </Card>
    </div>
  )
}

