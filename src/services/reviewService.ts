import { Review, STORAGE_KEYS } from '@/types'
import { getAll, getById, save, generateId } from '@/lib/storage'

/**
 * Retrieve all reviews, optionally filtered by artistId and/or rating.
 */
export function getReviews(filters?: {
  artistId?: string
  rating?: number
}): Review[] {
  let reviews = getAll<Review>(STORAGE_KEYS.REVIEWS)

  if (filters?.artistId) {
    reviews = reviews.filter((r) => r.artistId === filters.artistId)
  }

  if (filters?.rating) {
    reviews = reviews.filter((r) => r.rating === filters.rating)
  }

  return reviews
}

/**
 * Find a single review by its ID.
 */
export function getReviewById(id: string): Review | undefined {
  return getById<Review>(STORAGE_KEYS.REVIEWS, id)
}

/**
 * Create a new review and persist it.
 */
export function createReview(
  data: Omit<Review, 'id' | 'createdAt'>
): Review {
  const review: Review = {
    ...data,
    id: generateId(),
    createdAt: new Date().toISOString(),
  }
  const reviews = getAll<Review>(STORAGE_KEYS.REVIEWS)
  reviews.push(review)
  save(STORAGE_KEYS.REVIEWS, reviews)
  return review
}

/**
 * Partially update an existing review by ID.
 * Review has no updatedAt field; only the specified fields are changed.
 * Returns the updated review.
 */
export function updateReview(
  id: string,
  data: Partial<Omit<Review, 'id' | 'createdAt'>>
): Review {
  const reviews = getAll<Review>(STORAGE_KEYS.REVIEWS)
  let updated: Review | undefined

  const updatedReviews = reviews.map((review) => {
    if (review.id === id) {
      updated = { ...review, ...data }
      return updated
    }
    return review
  })

  if (!updated) {
    throw new Error('Review not found')
  }

  save(STORAGE_KEYS.REVIEWS, updatedReviews)
  return updated
}

/**
 * Delete a review by ID.
 */
export function deleteReview(id: string): void {
  const reviews = getAll<Review>(STORAGE_KEYS.REVIEWS)
  save(
    STORAGE_KEYS.REVIEWS,
    reviews.filter((r) => r.id !== id)
  )
}
