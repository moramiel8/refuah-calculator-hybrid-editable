import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = "refuah"

interface ContactNotificationProps {
  name?: string
  email?: string
  subject?: string
  message?: string
}

const ContactNotificationEmail = ({ name, email, subject, message }: ContactNotificationProps) => (
  <Html lang="he" dir="rtl">
    <Head />
    <Preview>הודעה חדשה מטופס יצירת קשר - {SITE_NAME}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>הודעה חדשה מטופס יצירת קשר</Heading>
        <Text style={text}>
          המשתמש <strong>{name || 'לא צוין'}</strong> שלח הודעה בנוגע ל: <strong>{subject || 'ללא נושא'}</strong>
        </Text>
        <Text style={label}>אימייל השולח:</Text>
        <Text style={text}>{email || 'לא צוין'}</Text>
        <Hr style={hr} />
        <Text style={label}>תוכן ההודעה:</Text>
        <Text style={messageStyle}>{message || 'ללא תוכן'}</Text>
        <Hr style={hr} />
        <Text style={footer}>הודעה זו נשלחה אוטומטית מ-{SITE_NAME}</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: ContactNotificationEmail,
  subject: (data: Record<string, any>) => `פנייה חדשה: ${data.subject || 'ללא נושא'} - ${data.name || 'משתמש'}`,
  displayName: 'התראת יצירת קשר',
  to: 'support@refuah.io',
  previewData: { name: 'ישראל ישראלי', email: 'israel@example.com', subject: 'שאלה כללית', message: 'שלום, יש לי שאלה לגבי האתר.' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Assistant, Arial, sans-serif' }
const container = { padding: '20px 25px', maxWidth: '580px', margin: '0 auto' }
const h1 = { fontSize: '22px', fontWeight: 'bold' as const, color: 'hsl(220, 20%, 14%)', margin: '0 0 20px', textAlign: 'right' as const }
const text = { fontSize: '14px', color: 'hsl(215, 13%, 50%)', lineHeight: '1.6', margin: '0 0 12px', textAlign: 'right' as const }
const label = { fontSize: '13px', fontWeight: '600' as const, color: 'hsl(220, 20%, 14%)', margin: '0 0 4px', textAlign: 'right' as const }
const messageStyle = { fontSize: '14px', color: 'hsl(220, 20%, 14%)', lineHeight: '1.6', margin: '0 0 12px', textAlign: 'right' as const, backgroundColor: 'hsl(210, 14%, 95%)', padding: '12px 16px', borderRadius: '8px' }
const hr = { borderColor: 'hsl(214, 18%, 91%)', margin: '20px 0' }
const footer = { fontSize: '12px', color: 'hsl(215, 13%, 50%)', margin: '30px 0 0', textAlign: 'right' as const }
