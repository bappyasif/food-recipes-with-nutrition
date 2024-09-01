import { useLocale, useTranslations } from 'next-intl'
import { useRouter, usePathname } from "next-intl/client"
import React, { ChangeEvent, useTransition } from 'react'

export const LocaleSwitcher = () => {
  const t = useTranslations('locales');

  const [isPending, startTransition] = useTransition()
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function onSelectChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextLocale = event.target.value;
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  }

  return (
    <label htmlFor="locale-switcher" className='flex items-end gap-x-1.5 text-content/80'>
      <span className='xxs:hidden md:block text-sm font-light'>{t("label")}</span>
      <select
        className='flex items-end appearance-none bg-transparent font-semibold text-lg duration-1000 transition-all hover:text-content-light/80 cursor-pointer rounded-sm leading-none p-0.5'
        defaultValue={locale}
        disabled={isPending}
        onChange={onSelectChange}
      >
        {['en', 'bn'].map((cur) => (
          <option key={cur} value={cur} className='font-bold'>
            {t(`${cur}`)}
          </option>
        ))}
      </select>
    </label>
  )
}
