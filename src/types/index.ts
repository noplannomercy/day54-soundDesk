// ============================================================
// SoundDesk Entity Types
// All application types are defined here. Import via `@/types`.
// ============================================================

// ------------------------------------------------------------
// Studio -- single object stored (not an array)
// ------------------------------------------------------------
export interface Studio {
  id: string
  name: string
  description: string
  address: string
  phone: string
  email: string
  openTime: string  // HH:mm
  closeTime: string // HH:mm
  createdAt: string
  updatedAt: string
}

// ------------------------------------------------------------
// Room
// ------------------------------------------------------------
export type RoomType = 'recording' | 'mixing' | 'mastering' | 'rehearsal'

export interface Room {
  id: string
  studioId: string
  name: string
  type: RoomType
  hourlyRate: number
  capacity: number
  equipment: string  // JSON array string of Equipment IDs
  isAvailable: boolean
  createdAt: string
  updatedAt: string
}

// ------------------------------------------------------------
// Artist
// ------------------------------------------------------------
export interface Artist {
  id: string
  name: string
  email: string
  phone: string
  genre: string
  label: string
  bio: string
  avatar: string | null
  createdAt: string
  updatedAt: string
}

// ------------------------------------------------------------
// Album
// ------------------------------------------------------------
export type AlbumStatus = 'planning' | 'recording' | 'mixing' | 'mastering' | 'released'

export interface Album {
  id: string
  artistId: string
  title: string
  genre: string
  releaseDate: string | null
  status: AlbumStatus
  coverArt: string | null
  totalTracks: number
  createdAt: string
  updatedAt: string
}

// ------------------------------------------------------------
// Track
// ------------------------------------------------------------
export type TrackStatus = 'pending' | 'recording' | 'recorded' | 'mixing' | 'mixed' | 'mastered' | 'final'

export interface Track {
  id: string
  albumId: string
  title: string
  duration: number  // seconds
  trackNumber: number
  status: TrackStatus
  bpm: number | null
  key: string | null
  notes: string
  createdAt: string
  updatedAt: string
}

// ------------------------------------------------------------
// Session
// ------------------------------------------------------------
export type SessionStatus = 'scheduled' | 'in-progress' | 'completed' | 'cancelled'

export interface Session {
  id: string
  roomId: string
  artistId: string
  albumId: string | null
  trackId: string | null
  engineerId: string
  date: string        // YYYY-MM-DD
  startTime: string   // HH:mm
  endTime: string     // HH:mm
  status: SessionStatus
  notes: string
  createdAt: string
  updatedAt: string
}

// ------------------------------------------------------------
// Equipment
// ------------------------------------------------------------
export type EquipmentCategory = 'microphone' | 'headphone' | 'monitor' | 'mixer' | 'interface' | 'instrument' | 'cable' | 'other'
export type EquipmentCondition = 'excellent' | 'good' | 'fair' | 'poor'

export interface Equipment {
  id: string
  name: string
  category: EquipmentCategory
  brand: string
  model: string
  serialNumber: string
  purchaseDate: string
  purchasePrice: number
  condition: EquipmentCondition
  location: string | null  // Room.id
  isAvailable: boolean
  createdAt: string
  updatedAt: string
}

// ------------------------------------------------------------
// Member (Staff)
// ------------------------------------------------------------
export type MemberRole = 'owner' | 'engineer' | 'assistant' | 'intern'
export type MemberSpeciality = 'recording' | 'mixing' | 'mastering' | 'general'

export interface Member {
  id: string
  name: string
  email: string
  phone: string
  role: MemberRole
  speciality: MemberSpeciality
  hourlyRate: number
  avatar: string | null
  createdAt: string
  updatedAt: string
}

// ------------------------------------------------------------
// Invoice
// ------------------------------------------------------------
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
export type Currency = 'KRW' | 'USD'

export interface InvoiceItem {
  label: string
  amount: number
}

export interface Invoice {
  id: string
  artistId: string
  sessionIds: string   // JSON array string
  items: string        // JSON array string of InvoiceItem[]
  subtotal: number
  tax: number
  total: number
  currency: Currency
  status: InvoiceStatus
  dueDate: string
  paidDate: string | null
  notes: string
  createdAt: string
  updatedAt: string
}

// ------------------------------------------------------------
// Contract
// ------------------------------------------------------------
export type ContractType = 'session' | 'album' | 'retainer'
export type ContractStatus = 'draft' | 'active' | 'completed' | 'terminated'

export interface Contract {
  id: string
  artistId: string
  albumId: string | null
  type: ContractType
  startDate: string
  endDate: string
  totalValue: number
  terms: string
  status: ContractStatus
  signedDate: string | null
  createdAt: string
  updatedAt: string
}

// ------------------------------------------------------------
// Playlist
// ------------------------------------------------------------
export interface Playlist {
  id: string
  name: string
  description: string
  trackIds: string   // JSON array string (ordered)
  isPublic: boolean
  createdBy: string  // Member.id
  createdAt: string
  updatedAt: string
}

// ------------------------------------------------------------
// Review
// ------------------------------------------------------------
export interface Review {
  id: string
  artistId: string
  sessionId: string | null
  rating: number  // 1-5
  comment: string
  createdAt: string
}

// ------------------------------------------------------------
// Tag
// ------------------------------------------------------------
export interface Tag {
  id: string
  name: string
  color: string   // #RRGGBB
  createdAt: string
}

// ------------------------------------------------------------
// EntityTag (N:M bridge table)
// ------------------------------------------------------------
export type EntityType = 'artist' | 'album' | 'track' | 'equipment'

export interface EntityTag {
  id: string
  entityType: EntityType
  entityId: string
  tagId: string
}

// ------------------------------------------------------------
// App Settings
// ------------------------------------------------------------
export interface AppSettings {
  defaultCurrency: Currency
  taxRate: number
  darkMode: boolean
}

// ------------------------------------------------------------
// Storage Keys
// ------------------------------------------------------------
export const STORAGE_KEYS = {
  STUDIO: 'sounddesk_studio',
  ROOMS: 'sounddesk_rooms',
  ARTISTS: 'sounddesk_artists',
  ALBUMS: 'sounddesk_albums',
  TRACKS: 'sounddesk_tracks',
  SESSIONS: 'sounddesk_sessions',
  EQUIPMENT: 'sounddesk_equipment',
  MEMBERS: 'sounddesk_members',
  INVOICES: 'sounddesk_invoices',
  CONTRACTS: 'sounddesk_contracts',
  PLAYLISTS: 'sounddesk_playlists',
  REVIEWS: 'sounddesk_reviews',
  TAGS: 'sounddesk_tags',
  ENTITY_TAGS: 'sounddesk_entity_tags',
  SETTINGS: 'sounddesk_settings',
} as const
