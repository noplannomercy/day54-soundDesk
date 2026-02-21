// ============================================================
// Seed Data Initializer
//
// Populates localStorage with sample data for development.
// Only writes data when the corresponding key is empty,
// so existing user data is never overwritten.
// ============================================================

import {
  STORAGE_KEYS,
  Studio,
  Room,
  Artist,
  Member,
  Equipment,
  Album,
  Track,
  AppSettings,
} from '@/types'
import { save, saveObject, getAll, getObject, generateId } from '@/lib/storage'

/**
 * Initialize seed data for all entity types.
 * Each entity group is only seeded when no data exists for its storage key.
 * Safe to call multiple times -- idempotent by design.
 */
export function initializeSeedData(): void {
  const now = new Date().toISOString()

  // ----------------------------------------------------------
  // Studio (singleton)
  // ----------------------------------------------------------
  let studioId = ''
  const existingStudio = getObject<Studio>(STORAGE_KEYS.STUDIO)
  if (!existingStudio) {
    studioId = generateId()
    const studio: Studio = {
      id: studioId,
      name: 'Sound Studio A',
      description: '서울 소재 전문 녹음 스튜디오',
      address: '서울특별시 강남구 테헤란로 123',
      phone: '02-1234-5678',
      email: 'info@soundstudioa.kr',
      openTime: '09:00',
      closeTime: '22:00',
      createdAt: now,
      updatedAt: now,
    }
    saveObject(STORAGE_KEYS.STUDIO, studio)
  } else {
    studioId = existingStudio.id
  }

  // ----------------------------------------------------------
  // Rooms (3)
  // ----------------------------------------------------------
  const existingRooms = getAll<Room>(STORAGE_KEYS.ROOMS)
  if (existingRooms.length === 0) {
    const rooms: Room[] = [
      {
        id: generateId(),
        studioId,
        name: 'Recording Room A',
        type: 'recording',
        hourlyRate: 50000,
        capacity: 6,
        equipment: '[]',
        isAvailable: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: generateId(),
        studioId,
        name: 'Mixing Suite B',
        type: 'mixing',
        hourlyRate: 80000,
        capacity: 4,
        equipment: '[]',
        isAvailable: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: generateId(),
        studioId,
        name: 'Mastering Lab C',
        type: 'mastering',
        hourlyRate: 100000,
        capacity: 3,
        equipment: '[]',
        isAvailable: true,
        createdAt: now,
        updatedAt: now,
      },
    ]
    save(STORAGE_KEYS.ROOMS, rooms)
  }

  // ----------------------------------------------------------
  // Artists (3)
  // ----------------------------------------------------------
  let artistIds: string[] = []
  const existingArtists = getAll<Artist>(STORAGE_KEYS.ARTISTS)
  if (existingArtists.length === 0) {
    const artistIdKim = generateId()
    const artistIdLee = generateId()
    const artistIdPark = generateId()
    artistIds = [artistIdKim, artistIdLee, artistIdPark]

    const artists: Artist[] = [
      {
        id: artistIdKim,
        name: '김민준',
        email: 'minjun.kim@example.com',
        phone: '010-1111-2222',
        genre: 'indie rock',
        label: '독립 레이블',
        bio: '인디 록 싱어송라이터',
        avatar: null,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: artistIdLee,
        name: '이서연',
        email: 'seoyeon.lee@example.com',
        phone: '010-3333-4444',
        genre: 'k-pop',
        label: 'SM Entertainment',
        bio: 'K-pop 솔로 아티스트',
        avatar: null,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: artistIdPark,
        name: '박지훈',
        email: 'jihun.park@example.com',
        phone: '010-5555-6666',
        genre: 'jazz',
        label: 'Blue Note Korea',
        bio: '재즈 피아니스트 겸 작곡가',
        avatar: null,
        createdAt: now,
        updatedAt: now,
      },
    ]
    save(STORAGE_KEYS.ARTISTS, artists)
  } else {
    artistIds = existingArtists.map((a) => a.id)
  }

  // ----------------------------------------------------------
  // Members (2)
  // ----------------------------------------------------------
  const existingMembers = getAll<Member>(STORAGE_KEYS.MEMBERS)
  if (existingMembers.length === 0) {
    const members: Member[] = [
      {
        id: generateId(),
        name: '최레코드',
        email: 'record.choi@example.com',
        phone: '010-7777-8888',
        role: 'engineer',
        speciality: 'recording',
        hourlyRate: 30000,
        avatar: null,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: generateId(),
        name: '정믹싱',
        email: 'mixing.jung@example.com',
        phone: '010-9999-0000',
        role: 'engineer',
        speciality: 'mixing',
        hourlyRate: 40000,
        avatar: null,
        createdAt: now,
        updatedAt: now,
      },
    ]
    save(STORAGE_KEYS.MEMBERS, members)
  }

  // ----------------------------------------------------------
  // Equipment (5)
  // ----------------------------------------------------------
  const existingEquipment = getAll<Equipment>(STORAGE_KEYS.EQUIPMENT)
  if (existingEquipment.length === 0) {
    const equipment: Equipment[] = [
      {
        id: generateId(),
        name: 'Neumann U87',
        category: 'microphone',
        brand: 'Neumann',
        model: 'U87 Ai',
        serialNumber: 'NEU-U87-001',
        purchaseDate: '2023-01-15',
        purchasePrice: 4500000,
        condition: 'excellent',
        location: null,
        isAvailable: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: generateId(),
        name: 'SSL 4000',
        category: 'mixer',
        brand: 'Solid State Logic',
        model: '4000 G+',
        serialNumber: 'SSL-4000-001',
        purchaseDate: '2022-06-20',
        purchasePrice: 120000000,
        condition: 'good',
        location: null,
        isAvailable: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: generateId(),
        name: 'Yamaha HS8',
        category: 'monitor',
        brand: 'Yamaha',
        model: 'HS8',
        serialNumber: 'YAM-HS8-001',
        purchaseDate: '2023-03-10',
        purchasePrice: 800000,
        condition: 'excellent',
        location: null,
        isAvailable: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: generateId(),
        name: 'Yamaha HS8',
        category: 'monitor',
        brand: 'Yamaha',
        model: 'HS8',
        serialNumber: 'YAM-HS8-002',
        purchaseDate: '2023-03-10',
        purchasePrice: 800000,
        condition: 'excellent',
        location: null,
        isAvailable: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: generateId(),
        name: 'Apollo Twin X',
        category: 'interface',
        brand: 'Universal Audio',
        model: 'Apollo Twin X',
        serialNumber: 'UA-ATX-001',
        purchaseDate: '2023-05-01',
        purchasePrice: 1200000,
        condition: 'excellent',
        location: null,
        isAvailable: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: generateId(),
        name: 'Sennheiser HD 650',
        category: 'headphone',
        brand: 'Sennheiser',
        model: 'HD 650',
        serialNumber: 'SEN-HD650-001',
        purchaseDate: '2023-02-28',
        purchasePrice: 450000,
        condition: 'good',
        location: null,
        isAvailable: true,
        createdAt: now,
        updatedAt: now,
      },
    ]
    save(STORAGE_KEYS.EQUIPMENT, equipment)
  }

  // ----------------------------------------------------------
  // Albums (2)
  // ----------------------------------------------------------
  let albumIds: string[] = []
  const existingAlbums = getAll<Album>(STORAGE_KEYS.ALBUMS)
  if (existingAlbums.length === 0) {
    const albumId1 = generateId()
    const albumId2 = generateId()
    albumIds = [albumId1, albumId2]

    const albums: Album[] = [
      {
        id: albumId1,
        artistId: artistIds[0] ?? '',
        title: '봄날의 기억',
        genre: 'indie rock',
        releaseDate: null,
        status: 'recording',
        coverArt: null,
        totalTracks: 3,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: albumId2,
        artistId: artistIds[1] ?? '',
        title: 'Starlight',
        genre: 'k-pop',
        releaseDate: null,
        status: 'mixing',
        coverArt: null,
        totalTracks: 2,
        createdAt: now,
        updatedAt: now,
      },
    ]
    save(STORAGE_KEYS.ALBUMS, albums)
  } else {
    albumIds = existingAlbums.map((a) => a.id)
  }

  // ----------------------------------------------------------
  // Tracks (5)
  // ----------------------------------------------------------
  const existingTracks = getAll<Track>(STORAGE_KEYS.TRACKS)
  if (existingTracks.length === 0) {
    const tracks: Track[] = [
      // Album 1: 봄날의 기억 (3 tracks)
      {
        id: generateId(),
        albumId: albumIds[0] ?? '',
        title: '봄날의 기억',
        duration: 210,
        trackNumber: 1,
        status: 'recording',
        bpm: 120,
        key: 'C major',
        notes: '타이틀곡',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: generateId(),
        albumId: albumIds[0] ?? '',
        title: '새벽 빛',
        duration: 195,
        trackNumber: 2,
        status: 'pending',
        bpm: 98,
        key: 'A minor',
        notes: '',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: generateId(),
        albumId: albumIds[0] ?? '',
        title: '그리움',
        duration: 240,
        trackNumber: 3,
        status: 'pending',
        bpm: 85,
        key: 'G major',
        notes: '',
        createdAt: now,
        updatedAt: now,
      },
      // Album 2: Starlight (2 tracks)
      {
        id: generateId(),
        albumId: albumIds[1] ?? '',
        title: 'Starlight',
        duration: 200,
        trackNumber: 1,
        status: 'mixing',
        bpm: 128,
        key: 'E minor',
        notes: '타이틀곡',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: generateId(),
        albumId: albumIds[1] ?? '',
        title: 'Moonrise',
        duration: 185,
        trackNumber: 2,
        status: 'recorded',
        bpm: 110,
        key: 'D major',
        notes: '',
        createdAt: now,
        updatedAt: now,
      },
    ]
    save(STORAGE_KEYS.TRACKS, tracks)
  }

  // ----------------------------------------------------------
  // App Settings (singleton)
  // ----------------------------------------------------------
  const existingSettings = getObject<AppSettings>(STORAGE_KEYS.SETTINGS)
  if (!existingSettings) {
    const settings: AppSettings = {
      defaultCurrency: 'KRW',
      taxRate: 10,
      darkMode: false,
    }
    saveObject(STORAGE_KEYS.SETTINGS, settings)
  }
}
