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
    <label htmlFor="locale-switcher" className='text-muted-foreground flex items-center gap-x-1.5'>
      <span className='xxs:hidden md:block text-sm'>{t("label")}</span>
      <select
        className="inline-flex appearance-none bg-transparent py-1 pl-2 xxs:p-1 lg:pr-6 font-bold xxs:text-xs sm:text-sm md:text-lg xl:text-xl text-accent duration-1000 transition-all hover:text-card cursor-pointer rounded-sm"
        defaultValue={locale}
        disabled={isPending}
        onChange={onSelectChange}
      >
        {['en', 'bn'].map((cur) => (
          <option key={cur} value={cur} className='font-bold bg-card text-secondary'>
            {t(`${cur}`)}
          </option>
        ))}
      </select>
    </label>
  )
}
