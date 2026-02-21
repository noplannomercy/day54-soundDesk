'use client'

import { useState, useEffect } from 'react'
import { Tag } from '@/types'
import { getTags, deleteTag, getTagEntityCount } from '@/services/tagService'
import MainLayout from '@/components/layout/MainLayout'
import TagBadge from '@/components/tags/TagBadge'
import TagForm from '@/components/tags/TagForm'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
} from '@/components/ui/card'
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
} from '@/components/ui/alert-dialog'
import { Plus, Pencil, Trash2 } from 'lucide-react'

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([])
  const [formOpen, setFormOpen] = useState(false)
  const [editTag, setEditTag] = useState<Tag | undefined>(undefined)

  function loadTags() {
    setTags(getTags())
  }

  useEffect(() => {
    loadTags()
  }, [])

  function handleFormSuccess() {
    loadTags()
    setEditTag(undefined)
  }

  function handleEdit(tag: Tag) {
    setEditTag(tag)
    setFormOpen(true)
  }

  function handleDelete(id: string) {
    deleteTag(id)
    loadTags()
  }

  function handleNewTag() {
    setEditTag(undefined)
    setFormOpen(true)
  }

  return (
    <MainLayout title="태그 관리">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-sm">
            아티스트, 앨범, 트랙, 장비에 태그를 부여하여 분류할 수 있습니다.
          </p>
          <Button onClick={handleNewTag}>
            <Plus className="mr-2 h-4 w-4" />
            새 태그 추가
          </Button>
        </div>

        {tags.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              등록된 태그가 없습니다. 새 태그를 추가해주세요.
            </p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {tags.map((tag) => {
              const entityCount = getTagEntityCount(tag.id)
              return (
                <Card key={tag.id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <TagBadge tag={tag} />
                      <span className="text-xs text-muted-foreground shrink-0">
                        {entityCount}개 항목
                      </span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEdit(tag)}
                        aria-label={`${tag.name} 수정`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            aria-label={`${tag.name} 삭제`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>태그 삭제</AlertDialogTitle>
                            <AlertDialogDescription>
                              &quot;{tag.name}&quot; 태그를 삭제하시겠습니까?
                              연결된 모든 항목에서 이 태그가 제거됩니다.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>취소</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(tag.id)}
                            >
                              삭제
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      <TagForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSuccess={handleFormSuccess}
        initialData={editTag}
      />
    </MainLayout>
  )
}
