import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination"
import { translations } from "../utils/translations"
import type { User, UserRole } from "../types/user"
import { Pencil, Trash2, Search, Filter } from "lucide-react"

// Моковые данные для примера
const mockUsers: User[] = [
  { id: "1", name: "Анна Иванова", email: "anna@example.com", role: "MANAGER" },
  { id: "2", name: "Петр Петров", email: "petr@example.com", role: "MENTOR" },
  { id: "3", name: "Елена Сидорова", email: "elena@example.com", role: "EMPLOYEE" },
  // Добавим больше пользователей для демонстрации пагинации
  ...Array.from({ length: 20 }, (_, i) => ({
    id: `${i + 4}`,
    name: `User ${i + 4}`,
    email: `user${i + 4}@example.com`,
    role: ["ADMIN", "MANAGER", "MENTOR", "EMPLOYEE"][Math.floor(Math.random() * 4)] as UserRole,
  })),
]

export function AccessManagement() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [filteredUsers, setFilteredUsers] = useState<User[]>(users)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<UserRole | "ALL">("ALL")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const usersPerPage = 10

  useEffect(() => {
    let result = users
    if (searchTerm) {
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }
    if (roleFilter !== "ALL") {
      result = result.filter((user) => user.role === roleFilter)
    }
    setFilteredUsers(result)
    setCurrentPage(1)
  }, [users, searchTerm, roleFilter])

  const handleCreateUser = (userData: Omit<User, "id">) => {
    const newUser = { ...userData, id: Date.now().toString() }
    setUsers([...users, newUser])
    setIsFormOpen(false)
  }

  const handleEditUser = (userData: Omit<User, "id">) => {
    if (selectedUser) {
      const updatedUsers = users.map((user) => (user.id === selectedUser.id ? { ...user, ...userData } : user))
      setUsers(updatedUsers)
      setSelectedUser(null)
      setIsFormOpen(false)
    }
  }

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter((user) => user.id !== userId))
    setSelectedUsers(selectedUsers.filter((id) => id !== userId))
  }

  const handleBulkDelete = () => {
    setUsers(users.filter((user) => !selectedUsers.includes(user.id)))
    setSelectedUsers([])
  }

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground">{translations.accessManagement.title}</h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button>{translations.accessManagement.createUser}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedUser ? translations.accessManagement.editUser : translations.accessManagement.createUser}
              </DialogTitle>
            </DialogHeader>
            <UserForm
              user={selectedUser || undefined}
              onSubmit={selectedUser ? handleEditUser : handleCreateUser}
              onCancel={() => {
                setSelectedUser(null)
                setIsFormOpen(false)
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{translations.accessManagement.userList}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <Search className="text-muted-foreground" />
              <Input
                placeholder={translations.accessManagement.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="text-muted-foreground" />
              <Select value={roleFilter} onValueChange={(value: UserRole | "ALL") => setRoleFilter(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder={translations.accessManagement.filterByRole} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">{translations.accessManagement.allRoles}</SelectItem>
                  <SelectItem value="ADMIN">{translations.roles.ADMIN}</SelectItem>
                  <SelectItem value="MANAGER">{translations.roles.MANAGER}</SelectItem>
                  <SelectItem value="MENTOR">{translations.roles.MENTOR}</SelectItem>
                  <SelectItem value="EMPLOYEE">{translations.roles.EMPLOYEE}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedUsers.length > 0 && (
            <div className="mb-4">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">{translations.accessManagement.deleteBulk}</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{translations.accessManagement.deleteBulkConfirmation}</AlertDialogTitle>
                    <AlertDialogDescription>{translations.accessManagement.deleteBulkWarning}</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{translations.common.cancel}</AlertDialogCancel>
                    <AlertDialogAction onClick={handleBulkDelete}>{translations.common.delete}</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedUsers.length === currentUsers.length}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedUsers(currentUsers.map((user) => user.id))
                      } else {
                        setSelectedUsers([])
                      }
                    }}
                  />
                </TableHead>
                <TableHead>{translations.accessManagement.name}</TableHead>
                <TableHead>{translations.accessManagement.email}</TableHead>
                <TableHead>{translations.accessManagement.role}</TableHead>
                <TableHead>{translations.accessManagement.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedUsers.includes(user.id)}
                      onCheckedChange={() => toggleUserSelection(user.id)}
                    />
                  </TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{translations.roles[user.role]}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setSelectedUser(user)
                          setIsFormOpen(true)
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>{translations.accessManagement.deleteUserConfirmation}</AlertDialogTitle>
                            <AlertDialogDescription>
                              {translations.accessManagement.deleteUserWarning}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{translations.common.cancel}</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteUser(user.id)}>
                              {translations.common.delete}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Pagination
            className="mt-4"
            currentPage={currentPage}
            totalPages={Math.ceil(filteredUsers.length / usersPerPage)}
            onPageChange={setCurrentPage}
          />
        </CardContent>
      </Card>
    </div>
  )
}

interface UserFormProps {
  user?: User
  onSubmit: (userData: Omit<User, "id">) => void
  onCancel: () => void
}

function UserForm({ user, onSubmit, onCancel }: UserFormProps) {
  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [role, setRole] = useState<UserRole>(user?.role || "EMPLOYEE")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ name, email, role })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">{translations.accessManagement.name}</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="email">{translations.accessManagement.email}</Label>
        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="role">{translations.accessManagement.role}</Label>
        <Select value={role} onValueChange={(value: UserRole) => setRole(value)}>
          <SelectTrigger>
            <SelectValue placeholder={translations.accessManagement.selectRole} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ADMIN">{translations.roles.ADMIN}</SelectItem>
            <SelectItem value="MANAGER">{translations.roles.MANAGER}</SelectItem>
            <SelectItem value="MENTOR">{translations.roles.MENTOR}</SelectItem>
            <SelectItem value="EMPLOYEE">{translations.roles.EMPLOYEE}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          {translations.common.cancel}
        </Button>
        <Button type="submit">{user ? translations.common.save : translations.common.create}</Button>
      </div>
    </form>
  )
}

