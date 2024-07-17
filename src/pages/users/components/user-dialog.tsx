import React, { useState } from 'react'
import { Role, UserInput } from '@/pages/users/api/usersApi.types'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import MultipleSelector, { Option } from '@/components/custom/multiple-selector'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'

export interface UserDialogProps {
  children?: React.ReactNode
  data?: UserInput
  roles: Role[]
  submit?: (data: UserInput) => void
}

export const UserDialog = ({ children, data, roles, submit }: UserDialogProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useTranslation(['main'])

  const formSchema = z.object({
    _id: z.string().optional(),
    name: z.string().min(2, {
      message: t('users.name_validation', { ns: ['main'] }),
    }),
    email: z.string().min(2, {
      message: t('users.email_validation', { ns: ['main'] }),
    }),
    role: z.array(z.string()).min(1, {
      message: t('users.role_validation', { ns: ['main'] }),
    }),
    version: z.number().optional(),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      _id: undefined,
      name: '',
      email: '',
      role: [],
      version: undefined,
    },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (submit) {
      submit({
        _id: values._id,
        name: values.name,
        email: values.email,
        role: [...values.role.map((e) => roles.find((role) => role._id === e)!)],
        version: values.version,
      })
    }
    form.reset()
    setIsOpen(false)
  }

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={(nextState) => {
          setIsOpen(nextState)
          if (!nextState) {
            form.reset()
          } else {
            if (data !== undefined) {
              form.setValue('_id', data._id)
              form.setValue('name', data.name)
              form.setValue('email', data.email)
              form.setValue(
                'role',
                data.role.map((e) => e._id!)
              )
              form.setValue('version', data.version)
            }
          }
        }}
      >
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {form.getValues()._id === undefined
                ? `${t('users.add', { ns: ['main'] })}`
                : `${t('users.update', { ns: ['main'] })}`}
            </DialogTitle>
            <DialogDescription>{t('users.f1', { ns: ['main'] })}</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="col-span-4">
                        <FormLabel>{t('users.name', { ns: ['main'] })}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('users.name_placeholder', { ns: ['main'] })} {...field} />
                        </FormControl>
                        <FormDescription></FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="col-span-4">
                        <FormLabel>{t('users.email', { ns: ['main'] })}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('users.email_placeholder', { ns: ['main'] })} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem className="col-span-4">
                        <FormLabel>{t('users.role', { ns: ['main'] })}</FormLabel>
                        <FormControl>
                          <MultipleSelector
                            value={[
                              ...field.value.map((e): Option => {
                                return {
                                  label: roles.filter((r) => r._id === e)[0].name,
                                  value: e,
                                }
                              }),
                            ]}
                            defaultOptions={roles.map((role): Option => {
                              return {
                                label: role.name,
                                value: role._id?.toString() ? role._id?.toString() : '',
                              }
                            })}
                            onChange={(value) => {
                              field.onChange(value.map((e) => e.value))
                            }}
                            placeholder={t('users.role_placeholder', { ns: ['main'] })}
                            hidePlaceholderWhenSelected={true}
                            emptyIndicator={
                              <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                                {t('users.role_not_found', { ns: ['main'] })}
                              </p>
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">{t('users.submit', { ns: ['main'] })}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}
