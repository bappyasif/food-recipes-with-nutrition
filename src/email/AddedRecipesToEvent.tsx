import React from 'react'
import { Html } from "@react-email/html"
import { Head } from "@react-email/head"
import { Container } from "@react-email/container"
import { Heading } from "@react-email/heading"
import { Button } from "@react-email/button"

// interface EmailTemplateProps {
//     firstName: string;
// }

// export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({ }) => {
//     return null
// }

export const AddedRecipesToEvent = () => {
    return (
        <Html lang='en' dir='ltr'>
            <Head>
                <title>Hurray!!You planned on cooking....</title>
            </Head>

            <Container>
                <Heading>Congratulations!! Good luck completing this cooking list, enjoy</Heading>
                <Button>Visit Whats's Cooking Yo!!</Button>
            </Container>
        </Html>
    )
}
