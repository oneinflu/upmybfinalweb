export type QuestionType = 'single' | 'multi' | 'text'

export interface QuestionOption {
  value:       string
  label:       string
  description: string
}

export interface Question {
  id:          string
  question:    string
  type:        QuestionType
  required:    boolean
  skipLabel:   'Skip' | 'Not sure yet'
  placeholder?: string
  options?:    QuestionOption[]
}

export type BusinessType = 'ecommerce' | 'clinic' | 'ca' | 'restaurant' | 'education' | 'consultant' | 'general'

export function detectType(idea: string): BusinessType {
  const s = idea.toLowerCase()
  if (s.match(/ecommerce|e-commerce|shop|store|sell|selling|product|retail|marketplace/)) return 'ecommerce'
  if (s.match(/clinic|doctor|hospital|health|physio|dental|therapy|medical/))            return 'clinic'
  if (s.match(/\bca\b|chartered|accountant|tax|gst|audit|compliance|filing/))           return 'ca'
  if (s.match(/restaurant|food|cafe|café|kitchen|hotel|dhaba|tiffin|catering/))         return 'restaurant'
  if (s.match(/coach|coaching|teach|teacher|course|education|tutor|class|training/))    return 'education'
  if (s.match(/consultant|consulting|agency|adviser|advisor|service/))                  return 'consultant'
  return 'general'
}

export function getTypeLabel(t: BusinessType): string {
  const map: Record<BusinessType, string> = {
    ecommerce:  'ecommerce',
    clinic:     'clinic management',
    ca:         'CA firm',
    restaurant: 'restaurant',
    education:  'education platform',
    consultant: 'consulting',
    general:    'business',
  }
  return map[t]
}

/* ── Shared trailing questions ── */

const AUTH: Question = {
  id: 'auth', question: 'How should customers log in?', type: 'single', required: true, skipLabel: 'Skip',
  options: [
    { value: 'phone-otp', label: 'Phone OTP (recommended for India)', description: 'Most Indian users prefer this. No password needed.' },
    { value: 'email',     label: 'Email + Password',                  description: 'Traditional login. Works everywhere.' },
    { value: 'google',    label: 'Google login',                      description: 'One-tap sign in with Google account.' },
    { value: 'guest',     label: 'Guest checkout',                    description: 'No login required. Customer just enters address.' },
  ],
}

const DOMAIN: Question = {
  id: 'domain', question: 'Do you have a domain name?', type: 'single', required: true, skipLabel: 'Not sure yet',
  options: [
    { value: 'have',    label: 'Yes, I have a domain',     description: 'e.g. mybusiness.com. We\'ll connect it.' },
    { value: 'subdomain', label: 'No, use a free subdomain', description: 'We\'ll give you mybusiness.upmyb.com instantly.' },
    { value: 'buy',     label: 'I want to buy one',        description: 'We\'ll suggest available names and help you buy.' },
  ],
}

const HOSTING: Question = {
  id: 'hosting', question: 'Where do you want to host your site?', type: 'single', required: true, skipLabel: 'Not sure yet',
  options: [
    { value: 'upmyb',  label: 'Upmyb hosting (recommended)', description: 'We manage everything. ₹1,999/month total.' },
    { value: 'own',    label: 'I have my own server',         description: 'We\'ll generate files you can deploy anywhere.' },
    { value: 'later',  label: 'I\'ll decide later',           description: 'Use Upmyb hosting for now, migrate anytime.' },
  ],
}

/* ── Ecommerce (9 questions) ── */

const ECOMMERCE: Question[] = [
  {
    id: 'name', question: 'What\'s your business name and what are you selling?',
    type: 'text', required: true, skipLabel: 'Skip',
    placeholder: 'e.g. FreshKart — organic vegetables and fruits',
  },
  {
    id: 'product-type', question: 'What are you selling?', type: 'single', required: true, skipLabel: 'Skip',
    options: [
      { value: 'physical',        label: 'Physical products',      description: 'We\'ll handle inventory, shipping, and delivery.' },
      { value: 'digital',         label: 'Digital products',       description: 'Ebooks, courses, software, templates.' },
      { value: 'services',        label: 'Services',               description: 'Consulting, repair, cleaning, anything time-based.' },
      { value: 'physical-digital',label: 'Both physical and digital', description: 'Mixed catalogue.' },
    ],
  },
  {
    id: 'payment-model', question: 'How will customers pay you?', type: 'single', required: true, skipLabel: 'Skip',
    options: [
      { value: 'one-time',    label: 'One-time purchase',         description: 'Customer buys once, you ship once.' },
      { value: 'subscription',label: 'Subscription',             description: 'Weekly, monthly, or yearly recurring orders.' },
      { value: 'rental',      label: 'Rental / Try & Buy',       description: 'Customer rents the product or tries before paying.' },
      { value: 'wholesale',   label: 'Wholesale / B2B',          description: 'You sell to businesses, not end consumers.' },
    ],
  },
  {
    id: 'delivery', question: 'What delivery model are you planning?', type: 'single', required: true, skipLabel: 'Not sure yet',
    options: [
      { value: '10min',     label: '10-minute delivery',         description: 'Like Blinkit or Zepto. Needs dark stores.' },
      { value: 'same-day',  label: 'Same day delivery',         description: 'Order before 2pm, delivered by evening.' },
      { value: 'standard',  label: 'Standard delivery (1–5 days)', description: 'Normal courier. Works for most businesses.' },
      { value: 'pickup',    label: 'Customer picks up',         description: 'Takeaway or click-and-collect model.' },
    ],
  },
  {
    id: 'catalogue', question: 'How many products in your catalogue?', type: 'single', required: false, skipLabel: 'Skip',
    options: [
      { value: 'under-50',  label: 'Under 50 products',         description: 'Small curated collection.' },
      { value: '50-500',    label: '50 to 500 products',        description: 'Medium catalogue. We\'ll help organise it.' },
      { value: '500-plus',  label: '500+ products',             description: 'Large catalogue. Needs smart filtering.' },
      { value: 'later',     label: 'I\'ll add products later',  description: 'Start with a template, add products after.' },
    ],
  },
  {
    id: 'payment', question: 'Which payment methods do you need?', type: 'multi', required: true, skipLabel: 'Skip',
    options: [
      { value: 'upi-cards', label: 'UPI + Cards (Razorpay)',   description: 'PhonePe, GPay, credit/debit cards.' },
      { value: 'cod',       label: 'Cash on delivery (COD)',   description: 'Customer pays when order arrives.' },
      { value: 'emi',       label: 'EMI / Buy Now Pay Later',  description: 'Break payments into instalments.' },
      { value: 'intl',      label: 'International payments',   description: 'Accept USD, EUR, GBP from global customers.' },
    ],
  },
  AUTH,
  DOMAIN,
  HOSTING,
]

/* ── Clinic (8 questions) ── */

const CLINIC: Question[] = [
  {
    id: 'name', question: 'What\'s your clinic name and city?',
    type: 'text', required: true, skipLabel: 'Skip',
    placeholder: 'e.g. Sharma Eye Clinic, Hyderabad',
  },
  {
    id: 'clinic-type', question: 'What type of clinic?', type: 'single', required: true, skipLabel: 'Skip',
    options: [
      { value: 'general',   label: 'General physician',          description: 'Family doctor, primary care.' },
      { value: 'specialist',label: 'Specialist clinic',          description: 'Cardiologist, dermatologist, ortho, etc.' },
      { value: 'physio',    label: 'Physiotherapy / Rehabilitation', description: 'Sports injuries, post-surgery recovery.' },
      { value: 'dental',    label: 'Dental clinic',              description: 'Teeth, gums, cosmetic dentistry.' },
    ],
  },
  {
    id: 'features', question: 'What features do you need?', type: 'multi', required: true, skipLabel: 'Skip',
    options: [
      { value: 'registration', label: 'Patient registration',    description: 'Digital patient records.' },
      { value: 'booking',      label: 'Appointment booking',     description: 'Online slot booking for patients.' },
      { value: 'billing',      label: 'Billing and payments',    description: 'Collect fees online via Razorpay.' },
      { value: 'reminders',    label: 'SMS / WhatsApp reminders',description: 'Remind patients of appointments.' },
    ],
  },
  {
    id: 'users', question: 'Who needs to log in?', type: 'single', required: true, skipLabel: 'Skip',
    options: [
      { value: 'doctors',     label: 'Doctors only',            description: 'Only your staff uses the system.' },
      { value: 'staff',       label: 'Doctors + Receptionist',  description: 'Multiple staff roles.' },
      { value: 'patients',    label: 'Patients too (self-booking)', description: 'Patients create accounts and book online.' },
    ],
  },
  AUTH, DOMAIN, HOSTING,
  {
    id: 'reminders', question: 'Send WhatsApp reminders to patients?', type: 'single', required: false, skipLabel: 'Not sure yet',
    options: [
      { value: 'yes', label: 'Yes, WhatsApp and SMS', description: 'Automated appointment reminders.' },
      { value: 'no',  label: 'No, not needed',        description: 'Skip this for now.' },
    ],
  },
]

/* ── CA Firm (7 questions) ── */

const CA: Question[] = [
  {
    id: 'name', question: 'What\'s your firm name and city?',
    type: 'text', required: true, skipLabel: 'Skip',
    placeholder: 'e.g. Mehta & Associates, Mumbai',
  },
  {
    id: 'services', question: 'Which services do you offer?', type: 'multi', required: true, skipLabel: 'Skip',
    options: [
      { value: 'tax',           label: 'Tax filing',             description: 'ITR filing for individuals and businesses.' },
      { value: 'gst',           label: 'GST registration & filing', description: 'GST compliance services.' },
      { value: 'incorporation', label: 'Company incorporation',  description: 'Pvt Ltd, LLP, OPC registration.' },
      { value: 'audit',         label: 'Audit & compliance',     description: 'Statutory and internal audits.' },
    ],
  },
  {
    id: 'portal', question: 'Do you need a client portal?', type: 'single', required: true, skipLabel: 'Skip',
    options: [
      { value: 'website-only', label: 'Just a website (no client login)', description: 'Show services, collect leads.' },
      { value: 'portal',       label: 'Client portal',                    description: 'Upload docs, track filings.' },
      { value: 'both',         label: 'Both',                             description: 'Website + client area.' },
    ],
  },
  {
    id: 'leads', question: 'How do you want to capture leads?', type: 'multi', required: true, skipLabel: 'Skip',
    options: [
      { value: 'form',      label: 'Contact form',         description: 'Simple enquiry form.' },
      { value: 'whatsapp',  label: 'WhatsApp button',      description: 'Direct to WhatsApp chat.' },
      { value: 'booking',   label: 'Appointment booking',  description: 'Calendar-based slot booking.' },
    ],
  },
  {
    id: 'team', question: 'How large is your team?', type: 'single', required: false, skipLabel: 'Skip',
    options: [
      { value: 'solo',  label: 'Solo practitioner',  description: 'Just you.' },
      { value: 'small', label: '2–5 staff',           description: 'Small team.' },
      { value: 'large', label: '6+ staff',            description: 'Larger firm.' },
    ],
  },
  DOMAIN, HOSTING,
]

/* ── Restaurant (6 questions) ── */

const RESTAURANT: Question[] = [
  {
    id: 'name', question: 'What\'s your restaurant name, city, and cuisine?',
    type: 'text', required: true, skipLabel: 'Skip',
    placeholder: 'e.g. Spice Garden, Bangalore — North Indian',
  },
  {
    id: 'model', question: 'What\'s your restaurant model?', type: 'single', required: true, skipLabel: 'Skip',
    options: [
      { value: 'dine-in',    label: 'Dine-in',              description: 'Table service, sit-down experience.' },
      { value: 'takeaway',   label: 'Takeaway only',        description: 'No dine-in, pick-up orders.' },
      { value: 'cloud',      label: 'Cloud kitchen',        description: 'Delivery-only, no physical dining area.' },
      { value: 'multi',      label: 'Multiple outlets',     description: 'More than one location.' },
    ],
  },
  {
    id: 'ordering', question: 'What do you want on your website?', type: 'multi', required: true, skipLabel: 'Skip',
    options: [
      { value: 'menu',      label: 'Show menu only',        description: 'Display your menu with photos.' },
      { value: 'ordering',  label: 'Online order + payment',description: 'Customers order and pay online.' },
      { value: 'reservation',label: 'Table reservation',   description: 'Book a table in advance.' },
    ],
  },
  {
    id: 'delivery', question: 'How will you handle delivery?', type: 'single', required: false, skipLabel: 'Not sure yet',
    options: [
      { value: 'own',    label: 'Own delivery team',        description: 'Your staff delivers.' },
      { value: 'third',  label: 'Third-party (Dunzo/Porter)', description: 'Outsource to delivery partners.' },
      { value: 'pickup', label: 'Pickup only',              description: 'No delivery, only takeaway.' },
      { value: 'none',   label: 'No delivery',              description: 'Dine-in and pickup only.' },
    ],
  },
  DOMAIN, HOSTING,
]

/* ── Education / Coaching (8 questions) ── */

const EDUCATION: Question[] = [
  {
    id: 'name', question: 'What\'s your name and what do you teach?',
    type: 'text', required: true, skipLabel: 'Skip',
    placeholder: 'e.g. Priya Sharma — UPSC coaching for working professionals',
  },
  {
    id: 'format', question: 'What format are your classes?', type: 'single', required: true, skipLabel: 'Skip',
    options: [
      { value: 'live',     label: 'Live classes',           description: 'Real-time sessions with students.' },
      { value: 'recorded', label: 'Recorded courses',       description: 'Students watch at their own pace.' },
      { value: 'both',     label: 'Both live + recorded',   description: 'Live sessions + recorded archive.' },
      { value: '1on1',     label: '1-on-1 coaching',        description: 'Individual coaching sessions.' },
    ],
  },
  {
    id: 'payment-model', question: 'How will students pay?', type: 'single', required: true, skipLabel: 'Skip',
    options: [
      { value: 'one-time',    label: 'One-time course fee',   description: 'Pay once, access forever.' },
      { value: 'subscription',label: 'Monthly subscription',  description: 'Recurring monthly fee.' },
      { value: 'per-session', label: 'Per session',           description: 'Pay for each session separately.' },
    ],
  },
  {
    id: 'features', question: 'What student features do you need?', type: 'multi', required: false, skipLabel: 'Not sure yet',
    options: [
      { value: 'progress',     label: 'Progress tracking',    description: 'Students see their course progress.' },
      { value: 'assignments',  label: 'Assignments',          description: 'Submit and grade work online.' },
      { value: 'certificates', label: 'Certificates',         description: 'Issue completion certificates.' },
      { value: 'live-qa',      label: 'Live Q&A',             description: 'Real-time doubt sessions.' },
    ],
  },
  {
    id: 'class-size', question: 'What\'s your typical class size?', type: 'single', required: false, skipLabel: 'Skip',
    options: [
      { value: 'solo',   label: 'Solo coaching',             description: 'Just you and the student.' },
      { value: 'small',  label: 'Small groups (under 20)',   description: 'Intimate batch learning.' },
      { value: 'large',  label: 'Large batches (20+)',       description: 'Mass online education.' },
    ],
  },
  AUTH, DOMAIN, HOSTING,
]

/* ── Consultant / Agency (7 questions) ── */

const CONSULTANT: Question[] = [
  {
    id: 'name', question: 'What\'s your business name and what do you do?',
    type: 'text', required: true, skipLabel: 'Skip',
    placeholder: 'e.g. Growth Studio — digital marketing for Indian D2C brands',
  },
  {
    id: 'website-type', question: 'What type of website do you need?', type: 'single', required: true, skipLabel: 'Skip',
    options: [
      { value: 'info',    label: 'Just information (no login)',   description: 'Show services, portfolio, contact.' },
      { value: 'client',  label: 'Client portal',                 description: 'Clients log in to view work and reports.' },
      { value: 'both',    label: 'Both',                          description: 'Public site + private client area.' },
    ],
  },
  {
    id: 'revenue', question: 'How do you generate revenue?', type: 'single', required: true, skipLabel: 'Skip',
    options: [
      { value: 'leads',   label: 'Lead generation (free)',        description: 'Collect enquiries, close offline.' },
      { value: 'payments',label: 'Collect payments online',       description: 'Retainers, project fees, proposals.' },
      { value: 'both',    label: 'Both',                          description: 'Leads + online payments.' },
    ],
  },
  {
    id: 'main-feature', question: 'What\'s the main thing your site needs?', type: 'single', required: true, skipLabel: 'Skip',
    options: [
      { value: 'appointments', label: 'Book appointments',        description: 'Calendar booking for discovery calls.' },
      { value: 'portfolio',    label: 'Showcase portfolio',       description: 'Case studies, client logos, results.' },
      { value: 'proposals',    label: 'Send proposals online',    description: 'Scoped work with payment link.' },
      { value: 'content',      label: 'Publish content / blog',   description: 'Thought leadership, SEO content.' },
    ],
  },
  {
    id: 'team', question: 'How large is your team?', type: 'single', required: false, skipLabel: 'Skip',
    options: [
      { value: 'solo',  label: 'Just me',           description: 'Solopreneur or freelancer.' },
      { value: 'small', label: '2–5 people',         description: 'Small studio or agency.' },
      { value: 'large', label: 'Larger team',        description: '6+ people.' },
    ],
  },
  DOMAIN, HOSTING,
]

/* ── General (7 questions) ── */

const GENERAL: Question[] = [
  {
    id: 'name', question: 'What\'s your business name, city, and what do you do?',
    type: 'text', required: true, skipLabel: 'Skip',
    placeholder: 'e.g. Krishna Repairs, Chennai — mobile and laptop repair',
  },
  {
    id: 'website-type', question: 'What type of website do you need?', type: 'single', required: true, skipLabel: 'Skip',
    options: [
      { value: 'info',   label: 'Just information (no login)',         description: 'Tell people who you are and what you do.' },
      { value: 'members',label: 'Customers log in to use features',   description: 'Accounts, dashboards, saved history.' },
      { value: 'admin',  label: 'Admin panel only',                   description: 'Internal tool for your team.' },
      { value: 'both',   label: 'Both customer + admin',              description: 'Full product with both sides.' },
    ],
  },
  {
    id: 'revenue', question: 'How does your business make money?', type: 'single', required: true, skipLabel: 'Skip',
    options: [
      { value: 'leads',   label: 'Lead generation (free)',            description: 'Website brings enquiries, you close deals.' },
      { value: 'payments',label: 'Collect payments',                  description: 'Charge customers on the website.' },
      { value: 'both',    label: 'Both',                              description: 'Enquiries and online payments.' },
    ],
  },
  {
    id: 'main-feature', question: 'What\'s the main feature you need?', type: 'single', required: true, skipLabel: 'Skip',
    options: [
      { value: 'booking',  label: 'Book appointments',                description: 'Let customers schedule time with you.' },
      { value: 'products', label: 'Sell products',                    description: 'E-commerce or catalogue.' },
      { value: 'crm',      label: 'Manage customers',                 description: 'Customer records, history, notes.' },
      { value: 'content',  label: 'Share content',                    description: 'Blog, updates, announcements.' },
    ],
  },
  {
    id: 'team', question: 'How large is your team?', type: 'single', required: false, skipLabel: 'Skip',
    options: [
      { value: 'solo',  label: 'Just me',        description: 'Running everything solo.' },
      { value: 'small', label: '2–5 people',      description: 'Small team.' },
      { value: 'large', label: 'Larger team',     description: '6+ people.' },
    ],
  },
  AUTH, DOMAIN, HOSTING,
]

/* ── Registry ── */

export const QUESTIONS: Record<BusinessType, Question[]> = {
  ecommerce:  ECOMMERCE,
  clinic:     CLINIC,
  ca:         CA,
  restaurant: RESTAURANT,
  education:  EDUCATION,
  consultant: CONSULTANT,
  general:    GENERAL,
}
