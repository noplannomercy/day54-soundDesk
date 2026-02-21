import MainLayout from '@/components/layout/MainLayout'

export default async function AlbumDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <MainLayout title={`Album ${id}`}>
      <div className="text-muted-foreground">준비 중입니다.</div>
    </MainLayout>
  )
}
