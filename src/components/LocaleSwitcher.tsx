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
        <span className='xxs:hidden md:block text-sm'>{t("label")}</span>
      <select
        className="inline-flex appearance-none bg-card py-1 pl-2 xxs:p-1 lg:pr-6 font-bold xxs:text-xs md:text-sm lg:text-lg text-special-foreground duration-1000 transition-all hover:text-special cursor-pointer"
        defaultValue={locale}
        disabled={isPending}
        onChange={onSelectChange}
      >
        {/* <span className='duration-1000 transition-all hover:text-special'>{t("label")}</span> */}
        {/* {t("label")} */}
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
