import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: string
  className?: string
}

const statusConfig: Record<string, { color: string; label: string }> = {
  // Warehouse/Zone/Sector Status
  active: { color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200", label: "Actif" },
  inactive: { color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200", label: "Inactif" },
  maintenance: { color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200", label: "Maintenance" },
  full: { color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200", label: "Plein" },

  // Location Status
  available: { color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200", label: "Disponible" },
  occupied: { color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200", label: "Occupé" },
  blocked: { color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200", label: "Bloqué" },
  reserved: { color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200", label: "Réservé" },

  // Product Status
  in_stock: { color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200", label: "En stock" },
  low_stock: { color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200", label: "Stock bas" },
  out_of_stock: { color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200", label: "Rupture" },
  discontinued: { color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200", label: "Discontinué" },

  // Order Status
  pending: { color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200", label: "En attente" },
  confirmed: { color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200", label: "Confirmé" },
  picking: { color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200", label: "Prélèvement" },
  picked: { color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200", label: "Prélevé" },
  packing: { color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200", label: "Conditionnement" },
  packed: { color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200", label: "Conditionné" },
  shipped: { color: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200", label: "Expédié" },
  delivered: { color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200", label: "Livré" },
  cancelled: { color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200", label: "Annulé" },

  // Reception Status
  in_progress: { color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200", label: "En cours" },
  completed: { color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200", label: "Complété" },
  partial: { color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200", label: "Partiel" },

  // Picking Status
  completed: { color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200", label: "Complété" },

  // Return Status
  received: { color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200", label: "Reçu" },
  inspecting: { color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200", label: "Inspection" },
  approved: { color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200", label: "Approuvé" },
  rejected: { color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200", label: "Rejeté" },
  refunded: { color: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200", label: "Remboursé" },
  restocked: { color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200", label: "Remis en stock" },
  disposed: { color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200", label: "Éliminé" },
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || { color: "bg-gray-100 text-gray-800", label: status }

  return (
    <Badge className={cn(config.color, className)}>
      {config.label}
    </Badge>
  )
}
