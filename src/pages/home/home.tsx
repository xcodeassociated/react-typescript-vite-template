import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useTranslation } from 'react-i18next'

export const Home = () => {
  const { t } = useTranslation(['main'])

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{t(`home.title`, { ns: ['main'] })}</CardTitle>
          <CardDescription>{t(`home.subtitle`, { ns: ['main'] })}</CardDescription>
        </CardHeader>
        <CardContent>{t(`home.details`, { ns: ['main'] })}</CardContent>
        <CardFooter className="text-sm text-muted-foreground">{t(`home.contact`, { ns: ['main'] })}</CardFooter>
      </Card>
    </>
  )
}
