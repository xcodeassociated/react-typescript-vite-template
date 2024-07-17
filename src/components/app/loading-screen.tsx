import { Spinner } from '@/components/custom/spinner'
import React from 'react'

export function LoadingScreen() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-background">
      <div>
        <Spinner size="large" />
      </div>
    </div>
  )
}

export const LoadingScreenMemo = React.memo(LoadingScreen)
