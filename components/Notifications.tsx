import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { translations } from "../utils/translations"
import { Search, Filter, Trash2, Bell, ArrowUpDown, Eye } from "lucide-react"

interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "warning" | "success" | "error"
  date: string
  isRead: boolean
  link?: string
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Новое задание",
    message: "Вам назначено новое задание 'Анализ клиентской базы'",
    type: "info",
    date: "2023-05-20",
    isRead: false,
    link: "/tasks/1",
  },
  {
    id: "2",
    title: "Срок выполнения задания истекает",
    message: "Срок выполнения задания 'Разработка скрипта продаж' истекает через 2 дня",
    type: "warning",
    date: "2023-05-19",
    isRead: true,
    link: "/tasks/2",
  },
  {
    id: "3",
    title: "Задание проверено",
    message: "Ваше задание 'Подготовка презентации' было проверено и одобрено",
    type: "success",
    date: "2023-05-18",
    isRead: false,
    link: "/tasks/3",
  },
  {
    id: "4",
    title: "Ошибка в системе",
    message: "Произошла ошибка при загрузке файла. Пожалуйста, попробуйте еще раз",
    type: "error",
    date: "2023-05-17",
    isRead: true,
  },
  // Добавьте больше уведомлений для демонстрации пагинации
]

export function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>(notifications)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<"all" | "info" | "warning" | "success" | "error">("all")
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([])
  const [sortConfig, setSortConfig] = useState<{ key: keyof Notification; direction: "asc" | "desc" } | null>(null)
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)
  const notificationsPerPage = 10

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    filterNotifications(term, typeFilter)
  }

  const handleTypeFilter = (type: "all" | "info" | "warning" | "success" | "error") => {
    setTypeFilter(type)
    filterNotifications(searchTerm, type)
  }

  const filterNotifications = (term: string, type: "all" | "info" | "warning" | "success" | "error") => {
    let filtered = notifications
    if (term) {
      filtered = filtered.filter(
        (notification) =>
          notification.title.toLowerCase().includes(term.toLowerCase()) ||
          notification.message.toLowerCase().includes(term.toLowerCase()),
      )
    }
    if (type !== "all") {
      filtered = filtered.filter((notification) => notification.type === type)
    }
    setFilteredNotifications(filtered)
    setCurrentPage(1)
  }

  const indexOfLastNotification = currentPage * notificationsPerPage
  const indexOfFirstNotification = indexOfLastNotification - notificationsPerPage
  const currentNotifications = filteredNotifications.slice(indexOfFirstNotification, indexOfLastNotification)

  const toggleNotificationSelection = (notificationId: string) => {
    setSelectedNotifications((prev) =>
      prev.includes(notificationId) ? prev.filter((id) => id !== notificationId) : [...prev, notificationId],
    )
  }

  const handleSort = (key: keyof Notification) => {
    let direction: "asc" | "desc" = "asc"
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })
  }

  const handleMarkAsRead = () => {
    const updatedNotifications = notifications.map((notification) =>
      selectedNotifications.includes(notification.id) ? { ...notification, isRead: true } : notification,
    )
    setNotifications(updatedNotifications)
    setSelectedNotifications([])
    filterNotifications(searchTerm, typeFilter)
  }

  const handleDelete = () => {
    const updatedNotifications = notifications.filter(
      (notification) => !selectedNotifications.includes(notification.id),
    )
    setNotifications(updatedNotifications)
    setSelectedNotifications([])
    filterNotifications(searchTerm, typeFilter)
  }

  const handleNotificationClick = (notification: Notification) => {
    setSelectedNotification(notification)
    if (!notification.isRead) {
      const updatedNotifications = notifications.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n))
      setNotifications(updatedNotifications)
    }
  }

  useEffect(() => {
    if (sortConfig !== null) {
      const sortedNotifications = [...filteredNotifications].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1
        }
        return 0
      })
      setFilteredNotifications(sortedNotifications)
    }
  }, [sortConfig, filteredNotifications])

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      <h1 className="text-3xl font-bold text-foreground">{translations.notifications.title}</h1>
      <Card>
        <CardHeader>
          <CardTitle>{translations.notifications.notificationList}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <Search className="text-muted-foreground" />
              <Input
                placeholder={translations.notifications.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-64"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="text-muted-foreground" />
              <Select
                value={typeFilter}
                onValueChange={(value: "all" | "info" | "warning" | "success" | "error") => handleTypeFilter(value)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder={translations.notifications.filterByType} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{translations.notifications.allTypes}</SelectItem>
                  <SelectItem value="info">{translations.notifications.typeInfo}</SelectItem>
                  <SelectItem value="warning">{translations.notifications.typeWarning}</SelectItem>
                  <SelectItem value="success">{translations.notifications.typeSuccess}</SelectItem>
                  <SelectItem value="error">{translations.notifications.typeError}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedNotifications.length > 0 && (
            <div className="mb-4 space-x-2">
              <Button onClick={handleMarkAsRead}>
                <Bell className="mr-2 h-4 w-4" />
                {translations.notifications.markAsRead}
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                {translations.notifications.delete}
              </Button>
            </div>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedNotifications.length === currentNotifications.length}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedNotifications(currentNotifications.map((notification) => notification.id))
                      } else {
                        setSelectedNotifications([])
                      }
                    }}
                  />
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("title")}>
                  {translations.notifications.title}
                  <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("type")}>
                  {translations.notifications.type}
                  <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("date")}>
                  {translations.notifications.date}
                  <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
                <TableHead>{translations.notifications.status}</TableHead>
                <TableHead>{translations.notifications.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentNotifications.map((notification) => (
                <TableRow key={notification.id} className={notification.isRead ? "opacity-60" : ""}>
                  <TableCell>
                    <Checkbox
                      checked={selectedNotifications.includes(notification.id)}
                      onCheckedChange={() => toggleNotificationSelection(notification.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{notification.title}</p>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={notification.type === "error" ? "destructive" : "default"}>
                      {
                        translations.notifications[
                          `type${notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}` as keyof typeof translations.notifications
                        ]
                      }
                    </Badge>
                  </TableCell>
                  <TableCell>{notification.date}</TableCell>
                  <TableCell>
                    {notification.isRead ? (
                      <Badge variant="outline">{translations.notifications.read}</Badge>
                    ) : (
                      <Badge>{translations.notifications.unread}</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => handleNotificationClick(notification)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{notification.title}</DialogTitle>
                        </DialogHeader>
                        <div className="mt-4">
                          <p>{notification.message}</p>
                          <p className="mt-2 text-sm text-muted-foreground">{notification.date}</p>
                          {notification.link && (
                            <Button className="mt-4" asChild>
                              <a href={notification.link}>{translations.notifications.viewDetails}</a>
                            </Button>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Pagination
            className="mt-4"
            currentPage={currentPage}
            totalPages={Math.ceil(filteredNotifications.length / notificationsPerPage)}
            onPageChange={setCurrentPage}
          />
        </CardContent>
      </Card>
    </div>
  )
}

