'use client'

import { useState, useEffect } from 'react'
import { AppSettings, STORAGE_KEYS } from '@/types'
import { getObject, saveObject } from '@/lib/storage'
import { initializeSeedData } from '@/lib/seed'
import MainLayout from '@/components/layout/MainLayout'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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

const DEFAULT_SETTINGS: AppSettings = {
  defaultCurrency: 'KRW',
  taxRate: 10,
  darkMode: false,
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS)
  const [saved, setSaved] = useState(false)
  const [resetDone, setResetDone] = useState(false)

  useEffect(() => {
    const stored = getObject<AppSettings>(STORAGE_KEYS.SETTINGS)
    if (stored) {
      setSettings(stored)
      if (stored.darkMode) {
        document.documentElement.classList.add('dark')
      }
    }
  }, [])

  function handleSaveSettings() {
    saveObject(STORAGE_KEYS.SETTINGS, settings)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function handleDarkModeChange(checked: boolean) {
    const updated = { ...settings, darkMode: checked }
    setSettings(updated)
    document.documentElement.classList.toggle('dark', checked)
    saveObject(STORAGE_KEYS.SETTINGS, updated)
  }

  function handleResetData() {
    localStorage.clear()
    initializeSeedData()
    const stored = getObject<AppSettings>(STORAGE_KEYS.SETTINGS)
    if (stored) {
      setSettings(stored)
      document.documentElement.classList.toggle('dark', stored.darkMode)
    } else {
      setSettings(DEFAULT_SETTINGS)
      document.documentElement.classList.remove('dark')
    }
    setResetDone(true)
    setTimeout(() => setResetDone(false), 3000)
  }

  return (
    <MainLayout title="설정">
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">설정</h2>

        {/* Section 1: App Settings */}
        <Card>
          <CardHeader>
            <CardTitle>앱 설정</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currency">기본 통화</Label>
                <Select
                  value={settings.defaultCurrency}
                  onValueChange={(v) =>
                    setSettings({ ...settings, defaultCurrency: v as 'KRW' | 'USD' })
                  }
                >
                  <SelectTrigger id="currency" className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="KRW">KRW (원)</SelectItem>
                    <SelectItem value="USD">USD ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxRate">세율 (%)</Label>
                <Input
                  id="taxRate"
                  type="number"
                  min={0}
                  max={100}
                  className="w-[200px]"
                  value={settings.taxRate}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      taxRate: Math.min(100, Math.max(0, Number(e.target.value))),
                    })
                  }
                />
              </div>

              <div className="flex items-center gap-2">
                <Button onClick={handleSaveSettings}>저장</Button>
                {saved && (
                  <span className="text-sm text-green-600">저장되었습니다.</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Dark Mode */}
        <Card>
          <CardHeader>
            <CardTitle>다크모드</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Checkbox
                id="darkMode"
                checked={settings.darkMode}
                onCheckedChange={(checked) =>
                  handleDarkModeChange(checked === true)
                }
              />
              <Label htmlFor="darkMode" className="cursor-pointer">
                다크모드 사용
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Data Reset */}
        <Card>
          <CardHeader>
            <CardTitle>데이터 초기화</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-muted-foreground text-sm">
                모든 데이터를 삭제하고 초기 샘플 데이터로 복원합니다.
              </p>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">전체 데이터 삭제</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>데이터 초기화</AlertDialogTitle>
                    <AlertDialogDescription>
                      모든 데이터가 삭제됩니다. 계속하시겠습니까?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>취소</AlertDialogCancel>
                    <AlertDialogAction
                      variant="destructive"
                      onClick={handleResetData}
                    >
                      삭제
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              {resetDone && (
                <span className="text-sm text-green-600">
                  데이터가 초기화되었습니다.
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
