import { useLocale, useTranslations } from 'next-intl'
import {useRouter, usePathname} from "next-intl/client"
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
          router.replace(pathname, {locale: nextLocale});
        });
      }

  return (
    <label htmlFor="locale-switcher" className='self-end text-muted-foreground flex items-center'>
        {/* <p className="sr-only">{t('label')}</p> */}
        <span className='xxs:hidden md:block'>{t("label")}</span>
      <select
        className="inline-flex appearance-none bg-card py-1 pl-2 pr-6 font-bold text-special xxs:text-xs md:text-sm lg:text-xl"
        defaultValue={locale}
        disabled={isPending}
        onChange={onSelectChange}
      >
        {t("label")}
        {['en', 'bn'].map((cur) => (
          <option key={cur} value={cur} className='font-bold'>
            {/* {t('locales', {locale: cur})} {cur} */}
            {t(`${cur}`)}
          </option>
        ))}
      </select>
      {/* <span className="pointer-events-none absolute right-2 top-[8px]">⌄</span> */}
    </label>
  )
}
