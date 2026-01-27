# Configuration & Préférences Utilisateur

## Overview

Ce document définit l'architecture du système de configuration et de gestion des préférences utilisateur pour WareFlow SaaS. Le système permet une personnalisation complète de l'expérience utilisateur tout en maintenant une cohérence à travers les différents clients.

## Architecture du Système de Configuration

### Principes de Conception

- **Immutabilité** : Toutes les structures de configuration sont immuables
- **Persistance locale** : Utilisation du stockage Electron `app.getPath('userData')`
- **Synchronisation** : Les préférences sont synchronisables avec le cloud (optionnel)
- **Validation** : Toutes les configurations sont validées avant persistance
- **Isolation** : Les préférences sont isolées par utilisateur et par installation

### Type: UserPreferences

Définit l'ensemble des préférences utilisateur de l'application.

```typescript
type UserPreferences = readonly {
  /** Identifiant unique de l'utilisateur (UUID) */
  readonly userId: string;

  /** Identifiant de l'organisation (pour les comptes entreprise) */
  readonly organizationId: string | null;

  /** Préférences d'affichage et d'interface */
  readonly display: DisplaySettings;

  /** Paramètres régionaux et linguistiques */
  readonly regional: RegionalSettings;

  /** Préférences par défaut pour les entrepôts */
  readonly defaultWarehouse: WarehouseDefaults;

  /** Politiques de rétention des données */
  readonly dataRetention: DataRetentionPolicy;

  /** Paramètres de l'application */
  readonly application: ApplicationSettings;

  /** Date de dernière modification */
  readonly lastModified: string;

  /** Version du schéma de configuration */
  readonly schemaVersion: number;
};
```

### Type: DisplaySettings

Configure l'apparence et le comportement de l'interface utilisateur.

```typescript
type DisplaySettings = readonly {
  /** Thème de l'application */
  readonly theme: AppTheme;

  /** Densité d'affichage des données dans les tableaux */
  readonly tableDensity: TableDensity;

  /** Configuration par défaut des colonnes de tableau */
  readonly defaultColumnLayout: ColumnLayoutConfig;

  /** Taille de police de l'interface (en pixels) */
  readonly fontSize: number;

  /** Afficher ou masquer les tooltips */
  readonly showTooltips: boolean;

  /** Animation des transitions */
  readonly enableAnimations: boolean;

  /** Mode plein écran par défaut */
  readonly startFullscreen: boolean;

  /** Position et taille de la fenêtre principale */
  readonly windowState: WindowState;
};

type AppTheme =
  | 'light'
  | 'dark'
  | 'system'
  | 'high-contrast';

type TableDensity =
  | 'compact'
  | 'comfortable'
  | 'spacious';

type ColumnLayoutConfig = readonly {
  /** Liste des colonnes visibles par défaut */
  readonly visibleColumns: readonly string[];

  /** Largeur des colonnes (en pixels) */
  readonly columnWidths: readonly {
    readonly columnId: string;
    readonly width: number;
  }[];

  /** Ordre des colonnes */
  readonly columnOrder: readonly string[];

  /** Colonnes figées à gauche */
  readonly frozenColumns: readonly string[];
};

type WindowState = readonly {
  /** Largeur de la fenêtre */
  readonly width: number;

  /** Hauteur de la fenêtre */
  readonly height: number;

  /** Position X */
  readonly x: number | null;

  /** Position Y */
  readonly y: number | null;

  /** État maximisé */
  readonly isMaximized: boolean;

  /** État plein écran */
  readonly isFullscreen: boolean;
};
```

### Type: RegionalSettings

Configure les paramètres régionaux et linguistiques de l'application.

```typescript
type RegionalSettings = readonly {
  /** Code de langue (ISO 639-1) */
  readonly language: string;

  /** Code de pays/région (ISO 3166-1 alpha-2) */
  readonly region: string;

  /** Fuseau horaire (IANA timezone database) */
  readonly timezone: string;

  /** Format des dates */
  readonly dateFormat: DateFormat;

  /** Séparateur décimal pour les nombres */
  readonly decimalSeparator: DecimalSeparator;

  /** Séparateur des milliers pour les nombres */
  readonly thousandsSeparator: ThousandsSeparator;

  /** Format d'heure */
  readonly timeFormat: TimeFormat;

  /** Premier jour de la semaine (0 = dimanche, 1 = lundi, etc.) */
  readonly firstDayOfWeek: number;

  /** Devise par défaut pour les affichages monétaires */
  readonly currency: string;
};

type DateFormat =
  | 'DD/MM/YYYY'
  | 'MM/DD/YYYY'
  | 'YYYY-MM-DD'
  | 'DD.MM.YYYY'
  | 'custom';

type DecimalSeparator =
  | '.'
  | ',';

type ThousandsSeparator =
  | ','
  | '.'
  | ' '
  | 'none';

type TimeFormat =
  | '12h'
  | '24h';
```

### Type: WarehouseDefaults

Configure les comportements par défaut pour la gestion des entrepôts.

```typescript
type WarehouseDefaults = readonly {
  /** Identifiant de l'entrepôt par défaut au démarrage */
  readonly defaultWarehouseId: string | null;

  /** Afficher automatiquement le sélecteur d'entrepôt au démarrage */
  readonly showWarehouseSelector: boolean;

  /** Autoriser le changement rapide d'entrepôt */
  readonly allowQuickSwitch: boolean;

  /** Configuration des vues par entrepôt */
  readonly perWarehouseViews: readonly {
    readonly warehouseId: string;
    readonly defaultView: string;
  }[];
};
```

### Type: DataRetentionPolicy

Définit les politiques de rétention et de nettoyage des données.

```typescript
type DataRetentionPolicy = readonly {
  /** Durée de rétention des archives (en jours) */
  readonly archiveRetentionDays: number;

  /** Durée de rétention des logs d'activité (en jours) */
  readonly activityLogRetentionDays: number;

  /** Durée de rétention des données historiques (en jours) */
  readonly historicalDataRetentionDays: number;

  /** Politique de nettoyage automatique */
  readonly autoCleanup: AutoCleanupPolicy;

  /** Règles de purge par type de données */
  readonly purgeRules: PurgeRules;

  /** Conservation des données sensibles */
  readonly sensitiveDataPolicy: SensitiveDataPolicy;
};

type AutoCleanupPolicy = readonly {
  /** Activer le nettoyage automatique */
  readonly enabled: boolean;

  /** Fréquence du nettoyage (en heures) */
  readonly frequency: number;

  /** Moment du nettoyage (heure du jour, 0-23) */
  readonly scheduledHour: number;

  /** Notification avant nettoyage (en jours) */
  readonly warningDays: number;
};

type PurgeRules = readonly {
  /** Supprimer les données archivées après expiration */
  readonly purgeArchives: boolean;

  /** Supprimer les logs après expiration */
  readonly purgeActivityLogs: boolean;

  /** Supprimer les données historiques après expiration */
  readonly purgeHistoricalData: boolean;

  /** Conserver un échantillon de données pour analyse */
  readonly keepSampleData: boolean;

  /** Taille de l'échantillon (en pourcentage) */
  readonly samplePercentage: number;
};

type SensitiveDataPolicy = readonly {
  /** Chiffrer les données sensibles stockées */
  readonly encryptStored: boolean;

  /** Masquer les données sensibles dans les exports */
  readonly maskInExports: boolean;

  /** Durée de rétention des données sensibles (en jours) */
  readonly retentionDays: number;

  /** Anonymiser les données sensibles après expiration */
  readonly anonymizeAfterExpiration: boolean;
};
```

### Type: ApplicationSettings

Configure les paramètres généraux de l'application.

```typescript
type ApplicationSettings = readonly {
  /** Vérifier les mises à jour au démarrage */
  readonly checkForUpdates: boolean;

  /** Activer les notifications système */
  readonly enableNotifications: boolean;

  /** Fréquence de sauvegarde automatique (en minutes) */
  readonly autosaveFrequency: number;

  /** Nombre maximal de sauvegardes à conserver */
  readonly maxBackups: number;

  /** Paramètres de connexion et synchronisation */
  readonly sync: SyncSettings;

  /** Paramètres de performance */
  readonly performance: PerformanceSettings;

  /** Paramètres de sécurité */
  readonly security: SecuritySettings;

  /** Paramètres de journalisation */
  readonly logging: LoggingSettings;
};

type SyncSettings = readonly {
  /** Activer la synchronisation cloud */
  readonly enabled: boolean;

  /** Fréquence de synchronisation (en minutes) */
  readonly frequency: number;

  /** Synchroniser uniquement en Wi-Fi */
  readonly wifiOnly: boolean;

  /** URL du serveur de synchronisation */
  readonly serverUrl: string | null;
};

type PerformanceSettings = readonly {
  /** Limiter l'utilisation de la mémoire (en Mo) */
  readonly maxMemoryUsage: number;

  /** Charger les données par pagination */
  readonly enablePagination: boolean;

  /** Taille des pages (nombre d'éléments) */
  readonly pageSize: number;

  /** Activer la mise en cache agressive */
  readonly aggressiveCaching: boolean;

  /** Utiliser le rendu virtuel pour les grandes listes */
  readonly virtualScrolling: boolean;
};

type SecuritySettings = readonly {
  /** Exiger un mot de passe au démarrage */
  readonly requirePassword: boolean;

  /** Délai d'inactivité avant verrouillage (en minutes) */
  readonly inactivityLockTimeout: number;

  /** Activer l'authentification à deux facteurs */
  readonly twoFactorAuth: boolean;

  /** Chiffrer la base de données locale */
  readonly encryptDatabase: boolean;

  /** Journal des audits de sécurité */
  readonly auditLog: boolean;
};

type LoggingSettings = readonly {
  /** Niveau de日志isation */
  readonly level: LogLevel;

  /** Conserver les logs de l'application */
  readonly retainLogs: boolean;

  /** Durée de rétention des logs (en jours) */
  readonly retentionDays: number;

  /** Emplacement des logs */
  readonly logPath: string;
};

type LogLevel =
  | 'error'
  | 'warn'
  | 'info'
  | 'debug'
  | 'trace';
```

## Stratégie de Persistance des Configuration

### Emplacement de Stockage

Les configurations sont stockées dans le répertoire utilisateur fourni par Electron :

```typescript
type ConfigurationStoragePath = readonly {
  /** Chemin complet du répertoire userData */
  readonly userDataPath: string;

  /** Emplacement du fichier de configuration principal */
  readonly configFilePath: string;

  /** Emplacement des sauvegardes de configuration */
  readonly backupPath: string;

  /** Emplacement du cache de configuration */
  readonly cachePath: string;
};
```

### Format de Stockage

```typescript
type ConfigurationFile = readonly {
  /** Version du format de fichier */
  readonly version: number;

  /** Préférences utilisateur */
  readonly preferences: UserPreferences;

  /** Signature cryptographique (pour vérification) */
  readonly signature: string | null;

  /** Date de création du fichier */
  readonly createdAt: string;

  /** Date de dernière modification */
  readonly modifiedAt: string;
};
```

### Cycle de Vie de la Configuration

```typescript
type ConfigurationLifecycle = readonly {
  /** Chargement de la configuration au démarrage */
  load: (userId: string) => Promise<UserPreferences>;

  /** Sauvegarde de la configuration */
  save: (preferences: UserPreferences) => Promise<void>;

  /** Migration vers une nouvelle version du schéma */
  migrate: (fromVersion: number, toVersion: number) => Promise<UserPreferences>;

  /** Validation de la configuration */
  validate: (preferences: unknown) => ValidationResult;

  /** Réinitialisation aux valeurs par défaut */
  reset: (userId: string) => Promise<UserPreferences>;

  /** Export de la configuration */
  export: (preferences: UserPreferences) => Promise<string>;

  /** Import de la configuration */
  import: (data: string) => Promise<UserPreferences>;
};

type ValidationResult = readonly {
  /** La configuration est valide */
  readonly isValid: boolean;

  /** Liste des erreurs de validation */
  readonly errors: readonly ValidationError[];

  /** Liste des avertissements */
  readonly warnings: readonly ValidationWarning[];
};

type ValidationError = readonly {
  /** Chemin de la propriété en erreur */
  readonly path: string;

  /** Message d'erreur */
  readonly message: string;

  /** Code d'erreur */
  readonly code: string;
};

type ValidationWarning = readonly {
  /** Chemin de la propriété */
  readonly path: string;

  /** Message d'avertissement */
  readonly message: string;

  /** Code d'avertissement */
  readonly code: string;
};
```

## Fonctions de Gestion des Préférences

### Chargement et Initialisation

```typescript
/**
 * Charge les préférences utilisateur depuis le stockage local.
 * Si aucune préférence n'existe, retourne les valeurs par défaut.
 */
loadUserPreferences: (
  userId: string,
  defaultPreferences?: Partial<UserPreferences>
) => Promise<UserPreferences>;

/**
 * Initialise les préférences pour un nouvel utilisateur.
 */
initializeUserPreferences: (
  userId: string,
  organizationId: string | null,
  region: string
) => Promise<UserPreferences>;
```

### Mise à Jour des Préférences

```typescript
/**
 * Met à jour les préférences utilisateur.
 * Les modifications sont fusionnées avec les préférences existantes.
 */
updateUserPreferences: (
  userId: string,
  updates: Partial<UserPreferences>
) => Promise<UserPreferences>;

/**
 * Met à jour un sous-ensemble de préférences.
 */
updateDisplaySettings: (
  userId: string,
  settings: Partial<DisplaySettings>
) => Promise<DisplaySettings>;

/**
 * Met à jour les paramètres régionaux.
 */
updateRegionalSettings: (
  userId: string,
  settings: Partial<RegionalSettings>
) => Promise<RegionalSettings>;
```

### Validation et Migration

```typescript
/**
 * Valide une structure de préférences.
 */
validatePreferences: (preferences: unknown) => ValidationResult;

/**
 * Migre les préférences d'une version à une autre.
 */
migratePreferences: (
  preferences: UserPreferences,
  targetVersion: number
) => Promise<UserPreferences>;

/**
 * Vérifie si une migration est nécessaire.
 */
checkMigrationNeeded: (
  currentVersion: number,
  targetVersion: number
) => boolean;
```

### Export et Import

```typescript
/**
 * Exporte les préférences utilisateur au format JSON.
 */
exportPreferences: (
  preferences: UserPreferences,
  format: 'json' | 'yaml'
) => Promise<string>;

/**
 * Importe les préférences depuis un fichier.
 */
importPreferences: (
  userId: string,
  data: string,
  format: 'json' | 'yaml'
) => Promise<UserPreferences>;

/**
 * Réinitialise les préférences aux valeurs par défaut.
 */
resetPreferences: (userId: string) => Promise<UserPreferences>;
```

### Sauvegarde et Restauration

```typescript
/**
 * Crée une sauvegarde des préférences actuelles.
 */
backupPreferences: (
  userId: string,
  preferences: UserPreferences
) => Promise<string>;

/**
 * Restaure les préférences depuis une sauvegarde.
 */
restorePreferences: (
  userId: string,
  backupId: string
) => Promise<UserPreferences>;

/**
 * Liste les sauvegardes disponibles.
 */
listBackups: (userId: string) => Promise<readonly BackupInfo[]>;

type BackupInfo = readonly {
  /** Identifiant de la sauvegarde */
  readonly id: string;

  /** Date de création */
  readonly createdAt: string;

  /** Version du schéma */
  readonly schemaVersion: number;

  /** Taille du fichier (en octets) */
  readonly size: number;

  /** Description */
  readonly description: string | null;
};
```

## Synchronisation des Préférences

### Stratégie de Synchronisation

```typescript
type SyncStrategy = readonly {
  /** Priorité en cas de conflit */
  readonly conflictResolution: ConflictResolution;

  /** Fréquence de synchronisation */
  readonly frequency: number;

  /** Synchroniser automatiquement */
  readonly autoSync: boolean;

  /** Types de données à synchroniser */
  readonly syncScope: readonly SyncScope[];
};

type ConflictResolution =
  | 'local-wins'
  | 'remote-wins'
  | 'most-recent'
  | 'manual';

type SyncScope =
  | 'display'
  | 'regional'
  | 'warehouse-defaults'
  | 'data-retention'
  | 'application';
```

### Fonctions de Synchronisation

```typescript
/**
 * Synchronise les préférences avec le serveur distant.
 */
syncPreferences: (
  userId: string,
  strategy: SyncStrategy
) => Promise<SyncResult>;

/**
 * Détecte les conflits entre les préférences locales et distantes.
 */
detectConflicts: (
  local: UserPreferences,
  remote: UserPreferences
) => readonly Conflict[];

/**
 * Résout un conflit de synchronisation.
 */
resolveConflict: (
  conflict: Conflict,
  resolution: ConflictResolution
) => UserPreferences;

type SyncResult = readonly {
  /** La synchronisation a réussi */
  readonly success: boolean;

  /** Préférences mises à jour */
  readonly preferences: UserPreferences;

  /** Conflits détectés */
  readonly conflicts: readonly Conflict[];

  /** Horodatage de la synchronisation */
  readonly syncedAt: string;
};

type Conflict = readonly {
  /** Chemin de la propriété en conflit */
  readonly path: string;

  /** Valeur locale */
  readonly localValue: unknown;

  /** Valeur distante */
  readonly remoteValue: unknown;

  /** Date de modification locale */
  readonly localModifiedAt: string;

  /** Date de modification distante */
  readonly remoteModifiedAt: string;
};
```

## Observabilité et Surveillance

### Télémétrie des Préférences

```typescript
type PreferenceTelemetry = readonly {
  /** Événements de modification des préférences */
  readonly changes: readonly PreferenceChange[];

  /** Métriques d'utilisation */
  readonly metrics: PreferenceMetrics;

  /** Erreurs rencontrées */
  readonly errors: readonly PreferenceError[];
};

type PreferenceChange = readonly {
  /** Identifiant de l'utilisateur */
  readonly userId: string;

  /** Chemin de la propriété modifiée */
  readonly propertyPath: string;

  /** Ancienne valeur */
  readonly oldValue: unknown;

  /** Nouvelle valeur */
  readonly newValue: unknown;

  /** Date de modification */
  readonly timestamp: string;

  /** Source de la modification */
  readonly source: 'user' | 'sync' | 'migration';
};

type PreferenceMetrics = readonly {
  /** Nombre total d'utilisateurs */
  readonly totalUsers: number;

  /** Distribution des thèmes */
  readonly themeDistribution: readonly {
    readonly theme: AppTheme;
    readonly count: number;
    readonly percentage: number;
  }[];

  /** Distribution des langues */
  readonly languageDistribution: readonly {
    readonly language: string;
    readonly count: number;
    readonly percentage: number;
  }[];

  /** Configuration la plus utilisée */
  readonly popularConfigurations: readonly {
    readonly config: string;
    readonly usage: number;
  }[];
};

type PreferenceError = readonly {
  /** Code d'erreur */
  readonly code: string;

  /** Message d'erreur */
  readonly message: string;

  /** Contexte de l'erreur */
  readonly context: readonly {
    readonly userId: string;
    readonly operation: string;
    readonly timestamp: string;
  };

  /** Stack trace */
  readonly stack: string | null;
};
```

## Sécurité des Préférences

### Contrôles d'Accès

```typescript
type PreferenceSecurity = readonly {
  /** Chiffrement des préférences sensibles */
  readonly encryptSensitiveFields: boolean;

  /** Contrôle d'accès aux préférences */
  readonly accessControl: AccessControlPolicy;

  ** Audit des modifications de préférences */
  readonly auditLogging: boolean;
};

type AccessControlPolicy = readonly {
  /** Utilisateurs autorisés à modifier les préférences */
  readonly authorizedUsers: readonly string[];

  /** Préférences nécessitant des droits d'administrateur */
  readonly adminOnlyFields: readonly string[];

  /** Préférences en lecture seule */
  readonly readOnlyFields: readonly string[];
};
```

## Gestion des Schémas

### Versionnement du Schéma

```typescript
type SchemaVersion = readonly {
  /** Numéro de version */
  readonly version: number;

  /** Date de publication */
  readonly releasedAt: string;

  /** Description des changements */
  readonly changes: readonly string[];

  /** Breaking changes */
  readonly breakingChanges: readonly string[];

  /** Script de migration */
  readonly migrationScript: string | null;
};

type SchemaRegistry = readonly {
  /** Liste de toutes les versions du schéma */
  readonly versions: readonly SchemaVersion[];

  /** Version actuelle du schéma */
  readonly currentVersion: number;

  /** Version minimale supportée */
  readonly minimumSupportedVersion: number;
};
```

## Références

- [Architecture Electron - app.getPath](https://www.electronjs.org/docs/latest/api/app#appgetpathname)
- [Spécification ISO 639-1 (Codes de langue)](https://en.wikipedia.org/wiki/ISO_639-1)
- [Spécification ISO 3166-1 (Codes de pays)](https://en.wikipedia.org/wiki/ISO_3166-1)
- [IANA Time Zone Database](https://www.iana.org/time-zones)
- [Documentation SaaS - 01-Product-Overview.md](./01-product-overview.md)
- [Documentation SaaS - 10-User-Management.md](./10-user-management.md)
