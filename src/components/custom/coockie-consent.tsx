import { CookieIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export interface CookieConsentProps {
  demo?: boolean
  onAcceptCallback?: () => void
  onDeclineCallback?: () => void
}

export default function CookieConsent({ demo, onAcceptCallback, onDeclineCallback }: CookieConsentProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [hide, setHide] = useState(false)
  const { t } = useTranslation(['main'])

  const accept = () => {
    setIsOpen(false)
    document.cookie = 'cookieConsent=true; expires=Fri, 31 Dec 9999 23:59:59 GMT'
    setTimeout(() => {
      setHide(true)
    }, 700)
    if (onAcceptCallback) {
      onAcceptCallback()
    }
  }

  const decline = () => {
    setIsOpen(false)
    setTimeout(() => {
      setHide(true)
    }, 700)
    if (onDeclineCallback) {
      onDeclineCallback()
    }
  }

  useEffect(() => {
    try {
      setIsOpen(true)
      if (document.cookie.includes('cookieConsent=true')) {
        if (!demo) {
          setIsOpen(false)
          setTimeout(() => {
            setHide(true)
          }, 700)
        }
      }
    } catch (e) {
      // console.log("Error: ", e);
    }
  }, [])

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-[200] w-full transition-transform duration-700 sm:bottom-4 sm:left-4 sm:max-w-md',
        !isOpen
          ? 'translate-y-8 opacity-0 transition-[opacity,transform]'
          : 'translate-y-0 opacity-100 transition-[opacity,transform]',
        hide && 'hidden'
      )}
    >
      <div className="m-2 rounded-md bg-secondary">
        <div className="grid gap-2">
          <div className="flex h-14 items-center justify-between border-b border-border p-4">
            <h1 className="text-lg font-medium"> {t('cookie_consent.title', { ns: ['main'] })}</h1>
            <CookieIcon className="h-[1.2rem] w-[1.2rem]" />
          </div>
          <div className="p-4">
            <p className="text-sm font-normal">
              {t('cookie_consent.content', { ns: ['main'] })}
              <br />
              <br />
              <span className="text-xs">
                {t('cookie_consent.accept_pt1', { ns: ['main'] }) + ' '} "
                <span className="font-medium opacity-80">{t('cookie_consent.accept', { ns: ['main'] })}</span>"{' '}
                {', ' + t('cookie_consent.accept_pt2', { ns: ['main'] })}
              </span>
              <br />
              <a href="#" className="text-xs underline">
                {t('cookie_consent.learn_more', { ns: ['main'] })}
              </a>
            </p>
          </div>
          <div className="flex gap-2 border-t border-border bg-background/20 p-4 py-5">
            <Button onClick={accept} className="w-full">
              {t('cookie_consent.accept', { ns: ['main'] })}
            </Button>
            <Button onClick={decline} className="w-full" variant="secondary">
              {t('cookie_consent.decline', { ns: ['main'] })}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
