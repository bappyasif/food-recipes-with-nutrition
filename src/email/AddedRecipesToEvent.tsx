import React from 'react'
import { Html } from "@react-email/html"
import { Head } from "@react-email/head"
import { Container } from "@react-email/container"
import { Heading } from "@react-email/heading"
import { Button } from "@react-email/button"
import { getBaseApiUrl } from '@/utils/dbRequests'
import { Preview } from "@react-email/preview"

export const AddedRecipesToEvent = () => {
    return (
        <Html lang='en' dir='ltr'>
            <Head>
                <title>Hurray!!You planned on cooking....</title>
            </Head>

            <Container>
                <Preview>Hurray!! You planned on cooking....</Preview>
                <Heading as='h1'>Congratulations!!</Heading>
                <Heading as='h2'>Good luck completing this cooking list, enjoy</Heading>
                <Button href={getBaseApiUrl()}>Visit Whats Cooking Yo!!</Button>
            </Container>
        </Html>
    )
}
