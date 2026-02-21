interface HeaderProps {
  title: string
}

export default function Header({ title }: HeaderProps) {
  return (
    <header className="flex h-14 items-center border-b px-6">
      <h1 className="text-lg font-semibold">{title}</h1>
      {/* Right side reserved for future user info, notifications, etc. */}
      <div className="ml-auto" />
    </header>
  )
}
