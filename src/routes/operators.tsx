import { createFileRoute } from '@tanstack/react-router'
import {
  Search,
  SearchX,
  Filter,
  Plus,
  Trash2,
  Edit,
  UserPlus,
  Users,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Bell,
  AlertCircle,
  AlertTriangle,
  ShieldAlert,
  Check,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { useState, useMemo, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export const Route = createFileRoute('/operators')({
  component: OperatorsPage,
})

function OperatorsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const itemsPerPage = 10

  const operators = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'Admin',
      warehouse: 'Warehouse A',
      status: 'Active',
      startDate: '2023-01-15',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: 'Manager',
      warehouse: 'Warehouse B',
      status: 'Active',
      startDate: '2022-06-01',
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      role: 'Operator',
      warehouse: 'Warehouse A',
      status: 'Active',
      startDate: '2021-03-10',
    },
    {
      id: 4,
      name: 'Alice Williams',
      email: 'alice.williams@example.com',
      role: 'Operator',
      warehouse: 'Warehouse C',
      status: 'Inactive',
      startDate: '2020-09-20',
    },
    {
      id: 5,
      name: 'Charlie Brown',
      email: 'charlie.brown@example.com',
      role: 'Operator',
      warehouse: 'Warehouse B',
      status: 'Active',
      startDate: '2024-01-08',
    },
  ]

  // KPIs
  const kpis = {
    totalOperators: operators.length,
    activeOperators: operators.filter((e) => e.status === 'Active').length,
    inactiveOperators: operators.filter((e) => e.status === 'Inactive').length,
    newHiresThisMonth: 2,
  }

  // Notifications
  const [readNotifications, setReadNotifications] = useState<Set<number>>(
    new Set(),
  )

  const notifications = {
    critical: [
      {
        id: 1,
        operator: 'John Doe',
        type: 'Training expired',
        category: 'Safety',
        time: '2 days',
      },
      {
        id: 2,
        operator: 'Jane Smith',
        type: 'Medical checkup missed',
        date: '2026-02-01',
        time: '4 days',
      },
    ],
    warning: [
      {
        id: 3,
        operator: 'Bob Johnson',
        type: 'Training expiring soon',
        category: 'Forklift',
        daysLeft: 5,
        time: '5 days',
      },
      {
        id: 4,
        operator: 'Alice Williams',
        type: 'Training expiring soon',
        category: 'Safety',
        daysLeft: 7,
        time: '7 days',
      },
    ],
  }

  const markAsRead = (id: number) => {
    setReadNotifications((prev) => new Set([...prev, id]))
  }

  const markAllAsRead = () => {
    const allIds = [...notifications.critical, ...notifications.warning].map(
      (n) => n.id,
    )
    setReadNotifications(new Set(allIds))
  }

  // Get unique roles and statuses
  const uniqueRoles = useMemo(() => {
    const roles = new Set(operators.map((e) => e.role))
    return Array.from(roles)
  }, [operators])

  const uniqueStatuses = useMemo(() => {
    const statuses = new Set(operators.map((e) => e.status))
    return Array.from(statuses)
  }, [operators])

  // Filter operators
  const filteredOperators = useMemo(() => {
    return operators.filter((operator) => {
      const matchesSearch =
        search === '' ||
        operator.name.toLowerCase().includes(search.toLowerCase()) ||
        operator.email.toLowerCase().includes(search.toLowerCase())

      const matchesRole =
        roleFilter === 'all' || operator.role === roleFilter
      const matchesStatus =
        statusFilter === 'all' || operator.status === statusFilter

      return matchesSearch && matchesRole && matchesStatus
    })
  }, [operators, search, roleFilter, statusFilter])

  const totalPages = Math.ceil(filteredOperators.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedOperators = filteredOperators.slice(startIndex, endIndex)

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [search, roleFilter, statusFilter])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-green-500/10 border border-green-500/20 text-green-500">
            Active
          </span>
        )
      case 'Inactive':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-yellow-500/10 border border-yellow-500/20 text-yellow-500">
            Inactive
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-500/10 border border-gray-500/20 text-gray-500">
            {status}
          </span>
        )
    }
  }

  const getRoleBadge = (role: string) => {
    const roleColors: { [key: string]: string } = {
      Admin: 'bg-rose-500/10 border border-rose-500/20 text-rose-500',
      Manager: 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-500',
      Operator: 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-500',
    }
    const colors =
      roleColors[role] ||
      'bg-gray-500/10 border border-gray-500/20 text-gray-500'
    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${colors}`}
      >
        {role}
      </span>
    )
  }

  const getWarehouseBadge = (warehouse: string) => {
    const warehouseColors: { [key: string]: string } = {
      'Warehouse A': 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-500',
      'Warehouse B': 'bg-amber-500/10 border border-amber-500/20 text-amber-500',
      'Warehouse C': 'bg-violet-500/10 border border-violet-500/20 text-violet-500',
    }
    const colors =
      warehouseColors[warehouse] ||
      'bg-gray-500/10 border border-gray-500/20 text-gray-500'
    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${colors}`}
      >
        {warehouse}
      </span>
    )
  }

  return (
    <SidebarInset>
      <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4 sticky top-0 bg-background z-10">
        <SidebarTrigger className="-ml-1" />
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold">Operators</h2>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                {notifications.critical.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-background">
                    {notifications.critical.length +
                      notifications.warning.length}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-0">
              <div className="p-3 border-b">
                <div className="flex items-center justify-between">
                  <DropdownMenuLabel className="p-0 text-sm font-semibold">
                    Notifications
                  </DropdownMenuLabel>
                  <span className="text-xs text-muted-foreground">
                    {notifications.critical.length +
                      notifications.warning.length -
                      readNotifications.size}{' '}
                    new
                  </span>
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto">
                {notifications.critical.filter(
                  (n) => !readNotifications.has(n.id),
                ).length > 0 && (
                  <div className="border-b">
                    <div className="px-3 py-1.5 bg-red-50 border-b border-red-100">
                      <p className="text-[11px] font-semibold text-red-700 flex items-center gap-1.5">
                        <AlertCircle className="h-3 w-3" />
                        Critical (
                        {
                          notifications.critical.filter(
                            (n) => !readNotifications.has(n.id),
                          ).length
                        }
                        )
                      </p>
                    </div>
                    <div className="divide-y divide-border">
                      {notifications.critical
                        .filter((n) => !readNotifications.has(n.id))
                        .map((notification) => (
                          <DropdownMenuItem
                            key={notification.id}
                            className="flex items-center gap-2 px-3 py-2 hover:bg-red-50/30 cursor-pointer border-0 group"
                          >
                            <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                              <ShieldAlert className="h-3 w-3 text-red-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium truncate">
                                {notification.operator}
                              </p>
                              <p className="text-[11px] text-muted-foreground truncate">
                                {notification.type}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  markAsRead(notification.id)
                                }}
                              >
                                <Check className="h-3 w-3 text-green-600" />
                              </Button>
                            </div>
                          </DropdownMenuItem>
                        ))}
                    </div>
                  </div>
                )}

                {notifications.warning.filter(
                  (n) => !readNotifications.has(n.id),
                ).length > 0 && (
                  <div>
                    <div className="px-3 py-1.5 bg-yellow-50 border-b border-yellow-100">
                      <p className="text-[11px] font-semibold text-yellow-700 flex items-center gap-1.5">
                        <AlertTriangle className="h-3 w-3" />
                        Warning (
                        {
                          notifications.warning.filter(
                            (n) => !readNotifications.has(n.id),
                          ).length
                        }
                        )
                      </p>
                    </div>
                    <div className="divide-y divide-border">
                      {notifications.warning
                        .filter((n) => !readNotifications.has(n.id))
                        .map((notification) => (
                          <DropdownMenuItem
                            key={notification.id}
                            className="flex items-center gap-2 px-3 py-2 hover:bg-yellow-50/30 cursor-pointer border-0 group"
                          >
                            <div className="h-6 w-6 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                              <AlertCircle className="h-3 w-3 text-yellow-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium truncate">
                                {notification.operator}
                              </p>
                              <p className="text-[11px] text-muted-foreground truncate">
                                {notification.type}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  markAsRead(notification.id)
                                }}
                              >
                                <Check className="h-3 w-3 text-green-600" />
                              </Button>
                            </div>
                          </DropdownMenuItem>
                        ))}
                    </div>
                  </div>
                )}

                {notifications.critical.filter(
                  (n) => !readNotifications.has(n.id),
                ).length === 0 &&
                  notifications.warning.filter(
                    (n) => !readNotifications.has(n.id),
                  ).length === 0 && (
                    <div className="py-8 px-3 text-center">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mx-auto mb-2">
                        <Check className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <p className="text-sm font-medium">All read</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        No new notifications
                      </p>
                    </div>
                  )}
              </div>

              {notifications.critical.filter(
                (n) => !readNotifications.has(n.id),
              ).length > 0 ||
              notifications.warning.filter(
                (n) => !readNotifications.has(n.id),
              ).length > 0 ? (
                <div className="p-2 border-t bg-muted/30 flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 justify-center text-xs gap-1"
                    onClick={markAllAsRead}
                  >
                    <Check className="h-3 w-3" />
                    Mark all as read
                  </Button>
                </div>
              ) : null}
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-green-50 text-green-700 border border-green-200">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span>Edit Mode</span>
          </div>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 py-6">
        <div className="min-h-full space-y-3">
          {/* Header */}
          <div className="mb-2">
            <Card className="p-3 bg-background shadow-sm rounded-md">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <Sparkles className="h-4 w-4 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-700">
                    <span className="font-medium">Operators</span> - Manage your
                    warehouse operators and their permissions
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* KPIs */}
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Card className="p-4 bg-background">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
                <CardTitle className="text-sm font-medium">
                  Total Operators
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-0">
                <div className="text-2xl font-bold">{kpis.totalOperators}</div>
                <p className="text-xs text-muted-foreground">
                  {kpis.activeOperators} Active
                </p>
              </CardContent>
            </Card>
            <Card className="p-4 bg-background">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
                <CardTitle className="text-sm font-medium">Active</CardTitle>
                <Edit className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-0">
                <div className="text-2xl font-bold">{kpis.activeOperators}</div>
                <p className="text-xs text-muted-foreground">
                  {((kpis.activeOperators / kpis.totalOperators) * 100).toFixed(0)}%
                  of total
                </p>
              </CardContent>
            </Card>
            <Card className="p-4 bg-background">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
                <CardTitle className="text-sm font-medium">Inactive</CardTitle>
                <Filter className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-0">
                <div className="text-2xl font-bold">
                  {kpis.inactiveOperators}
                </div>
                <p className="text-xs text-muted-foreground">
                  {((kpis.inactiveOperators / kpis.totalOperators) * 100).toFixed(
                    0,
                  )}
                  % of total
                </p>
              </CardContent>
            </Card>
            <Card className="p-4 bg-background">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
                <CardTitle className="text-sm font-medium">New Hires</CardTitle>
                <UserPlus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-0">
                <div className="text-2xl font-bold">{kpis.newHiresThisMonth}</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-wrap gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search operators..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {uniqueRoles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {uniqueStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button className="gap-2 ml-auto">
              <UserPlus className="h-4 w-4" />
              Add Operator
            </Button>
          </div>

          {/* Table */}
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Warehouse</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedOperators.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-64">
                      <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8">
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                          <SearchX className="h-8 w-8 opacity-50" />
                        </div>
                        <p className="text-lg font-medium">No data</p>
                        <p className="text-sm mt-2 max-w-md text-center">
                          No operators found matching your search
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedOperators.map((operator) => (
                    <TableRow key={operator.id} className="hover:bg-muted/50">
                      <TableCell>
                        <p className="font-medium text-gray-900">
                          {operator.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          ID{operator.id.toString().padStart(4, '0')}
                        </p>
                      </TableCell>
                      <TableCell>{operator.email}</TableCell>
                      <TableCell>{getRoleBadge(operator.role)}</TableCell>
                      <TableCell>{getWarehouseBadge(operator.warehouse)}</TableCell>
                      <TableCell>{getStatusBadge(operator.status)}</TableCell>
                      <TableCell className="text-gray-700">
                        {operator.startDate}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to{' '}
              {Math.min(endIndex, filteredOperators.length)} of{' '}
              {filteredOperators.length} operators
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </SidebarInset>
  )
}
