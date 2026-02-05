import { useMemo, useState, useEffect } from "react"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { User } from "@/shared/schemas/entities"

interface UsersTableProps {
  users: User[]
}

export function UsersTable({ users }: UsersTableProps) {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [warehouseFilter, setWarehouseFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  const uniqueStatuses = useMemo(() => {
    const statuses = new Set(users.map((u) => u.status))
    return Array.from(statuses)
  }, [users])

  const uniqueRoles = useMemo(() => {
    const roles = new Set(users.map((u) => u.role))
    return Array.from(roles)
  }, [users])

  const uniqueWarehouses = useMemo(() => {
    const warehouses = new Set(users.map((u) => u.warehouseName).filter(Boolean))
    return Array.from(warehouses)
  }, [users])

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        search === "" ||
        user.username.toLowerCase().includes(search.toLowerCase()) ||
        user.fullName.toLowerCase().includes(search.toLowerCase()) ||
        (user.email && user.email.toLowerCase().includes(search.toLowerCase()))
      const matchesStatus = statusFilter === "all" || user.status === statusFilter
      const matchesRole = roleFilter === "all" || user.role === roleFilter
      const matchesWarehouse = warehouseFilter === "all" || user.warehouseName === warehouseFilter
      return matchesSearch && matchesStatus && matchesRole && matchesWarehouse
    })
  }, [users, search, statusFilter, roleFilter, warehouseFilter])

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredUsers.slice(start, start + itemsPerPage)
  }, [filteredUsers, currentPage, itemsPerPage])

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [search, statusFilter, roleFilter, warehouseFilter])

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      active: {
        label: "Active",
        className: "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-green-500/10 border border-green-500/20 text-green-500",
      },
      inactive: {
        label: "Inactive",
        className: "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-500/10 border border-gray-500/20 text-gray-500",
      },
      pending: {
        label: "Pending",
        className: "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-yellow-500/10 border border-yellow-500/20 text-yellow-500",
      },
      blocked: {
        label: "Blocked",
        className: "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-red-500/10 border border-red-500/20 text-red-500",
      },
      archived: {
        label: "Archived",
        className: "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-500/10 border border-gray-500/20 text-gray-500",
      },
    }

    const config = statusConfig[status] || {
      label: status,
      className: "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-500/10 border border-gray-500/20 text-gray-500"
    }
    return <span className={config.className}>{config.label}</span>
  }

  const getRoleBadge = (role: string) => {
    const roleConfig: Record<string, { label: string; className: string }> = {
      admin: {
        label: "Admin",
        className: "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-purple-500/10 border border-purple-500/20 text-purple-500",
      },
      manager: {
        label: "Manager",
        className: "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-500/10 border border-blue-500/20 text-blue-500",
      },
      operator: {
        label: "Operator",
        className: "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-green-500/10 border border-green-500/20 text-green-500",
      },
      supervisor: {
        label: "Supervisor",
        className: "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-orange-500/10 border border-orange-500/20 text-orange-500",
      },
    }

    const config = roleConfig[role] || {
      label: role,
      className: "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-500/10 border border-gray-500/20 text-gray-500"
    }
    return <span className={config.className}>{config.label}</span>
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never"
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="space-y-3">
      {/* Search and Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by username, name, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={warehouseFilter} onValueChange={setWarehouseFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Warehouses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Warehouses</SelectItem>
            {uniqueWarehouses.map((warehouse) => (
              <SelectItem key={warehouse} value={warehouse}>
                {warehouse.length > 20 ? warehouse.substring(0, 20) + "..." : warehouse}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            {uniqueRoles.map((role) => (
              <SelectItem key={role} value={role}>
                {role === "admin" ? "Admin" : role === "manager" ? "Manager" : role === "operator" ? "Operator" : role === "supervisor" ? "Supervisor" : role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {uniqueStatuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status === "active" ? "Active" : status === "inactive" ? "Inactive" : status === "pending" ? "Pending" : status === "blocked" ? "Blocked" : "Archived"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Warehouse</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Login</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              paginatedUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell>{user.fullName}</TableCell>
                  <TableCell className="text-muted-foreground">{user.email || "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{user.warehouseName || "—"}</TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(user.lastLoginAt)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {filteredUsers.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
