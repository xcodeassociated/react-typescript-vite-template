import React, { useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { decrement, increment, incrementAsync, incrementByAmount, incrementIfOdd, selectCount } from './counterSlice'
import styles from './Counter.module.css'
import { CardDescription, CardHeader, CardTitle, CardContent, Card } from '@/components/ui/card'
import { useTranslation } from 'react-i18next'

export const Counter: React.FC = () => {
  const count = useAppSelector(selectCount)
  const dispatch = useAppDispatch()
  const [incrementAmount, setIncrementAmount] = useState('2')
  const incrementValue = Number(incrementAmount) || 0
  const { t } = useTranslation(['main'])

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>{t(`counter.title`, { ns: ['main'] })}</CardTitle>
          <CardDescription>{t(`counter.subtitle`, { ns: ['main'] })}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className={styles.row}>
            <button
              className={styles.button}
              aria-label={t(`counter.increment`, { ns: ['main'] })}
              onClick={() => dispatch(decrement())}
            >
              -
            </button>
            <span className={styles.value}>{count}</span>
            <button
              className={styles.button}
              aria-label={t(`counter.decrement`, { ns: ['main'] })}
              onClick={() => dispatch(increment())}
            >
              +
            </button>
          </div>
          <div className={styles.row}>
            <input
              className={styles.textbox}
              aria-label={t(`counter.increment_by`, { ns: ['main'] })}
              value={incrementAmount}
              onChange={(e) => setIncrementAmount(e.target.value)}
            />
            <button className={styles.button} onClick={() => dispatch(incrementByAmount(incrementValue))}>
              {t(`counter.add_amount`, { ns: ['main'] })}
            </button>
            <button className={styles.asyncButton} onClick={() => dispatch(incrementAsync(incrementValue))}>
              {t(`counter.add_async`, { ns: ['main'] })}
            </button>
            <button className={styles.button} onClick={() => dispatch(incrementIfOdd(incrementValue))}>
              {t(`counter.add_if_odd`, { ns: ['main'] })}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
