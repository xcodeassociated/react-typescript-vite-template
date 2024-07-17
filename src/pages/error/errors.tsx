import React from 'react'
import { useTranslation } from 'react-i18next'

export const Errors: React.FC = () => {
  const { t } = useTranslation(['main'])

  return (
    <div>
      <h1>{t(`error.not_found`)}</h1>
    </div>
  )
}

export const Unauthorized: React.FC = () => {
  const { t } = useTranslation(['main'])

  return (
    <div>
      <h1>{t(`error.unauthorized`)}</h1>
    </div>
  )
}
