import MainLayout from '@/components/layout/MainLayout'

export default async function SessionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <MainLayout title={`Session ${id}`}>
      <div className="text-muted-foreground">준비 중입니다.</div>
    </MainLayout>
  )
}
