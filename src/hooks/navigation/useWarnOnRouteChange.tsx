"use client"
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function useWarnOnRouteChange(shouldWarn: boolean) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const handler = (event: any) => {
      if (!shouldWarn) return
      const confirmed = confirm("Bạn có chắc chắn muốn rời khỏi? Danh sách chưa được gửi sẽ bị hủy.")
      if (!confirmed) {
        event.preventDefault()
        router.push(pathname) // Giữ lại route hiện tại
      }
    }

    window.addEventListener('beforeunload', handler)

    return () => window.removeEventListener('beforeunload', handler)
  }, [shouldWarn])
}
