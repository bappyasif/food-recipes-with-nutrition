import { DuoCarousels, ReusableCarousel } from "@/components/forHome/DuoCarousels";
import { HomeHero } from "@/components/forHome/HomeHero";
import { RandomizeSelection } from "@/components/forHome/RandomizeSelection";
import { RecentlyViewedMealsScroller } from "@/components/forHome/RecentlyViewedMealsScroller";

// import { Resend } from 'resend';
// const resend = new Resend('re_dgvjUeao_CSde72KynviYMRSHmUSctjPG');

// (async function () {
//   try {
//     const data = await resend.emails.send({
//       from: 'Acme <onboarding@resend.dev>',
//       to: ['delivered@resend.dev'],
//       subject: 'Hello World',
//       html: '<strong>It works!</strong>',
//     });

//     console.log(data);
//   } catch (error) {
//     console.error(error);
//   }
// })();


// import nodemailer from 'nodemailer';

// export async function resendSMTP() {
//   console.log(process.env.NEXT_PUBLIC_RESEND_API_KEY, process.env.NEXT_RESEND_API_KEY)

//   const transporter = nodemailer.createTransport({
//     host: 'smtp.resend.com',
//     secure: true,
//     port: 465,
//     auth: {
//       user: 'resend',
//       pass: process.env.NEXT_RESEND_API_KEY,
//     },
//   });

//   const info = await transporter.sendMail({
//     from: 'onboarding@resend.dev',
//     to: 'asifuzzamanbappy@gmail.com',
//     subject: 'Hello World',
//     html: '<strong>It works!!</strong>'
//   });

//   console.log('Message sent: %s', info.messageId);
// }

// resendSMTP().catch(console.error);

export default function Home() {

  return (
    <div className="bg-secondary flex flex-col gap-y-20">
      <HomeHero />

      <RandomizeSelection />

      {/* smaller screen */}
      <div className="xxs:flex xxs:flex-col xl:hidden items-center gap-x-20 justify-between text-special-foreground mb-10">
        <RecentlyViewedMealsScroller />
        <DuoCarousels />
      </div>

      {/* bigger screen */}
      <div className="xxs:hidden xl:flex flex-row items-center gap-x-20 justify-between text-special-foreground mb-16">
        <ReusableCarousel title='Dish' />
        <RecentlyViewedMealsScroller />
        <ReusableCarousel title='Cuisine' />
      </div>
    </div>
  )
}