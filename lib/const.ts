// Import any necessary components
import dynamic from 'next/dynamic'
import {
  Map,
  LayoutTemplate,
  MessageCircle,
  Download,
  BellRing,
  Users,
} from 'lucide-react'
import { Step } from 'react-joyride'

// eslint-disable-next-line import/prefer-default-export
export const items = [
  { value: 'Name', label: 'name', placeholder: 'Costa Rica' },
  { value: 'GDP', label: 'gdp', placeholder: '450353432' },
  { value: 'Population', label: 'population', placeholder: '76763124657' },
  { value: 'World Ranking', label: 'world Ranking', placeholder: '12' },
]

export const sampleComments = [
  {
    id: 1,
    message: 'this is the main chat',
    user: 'bluebird',
    time: new Date('2024-08-12T08:15:30'),
  },
  {
    id: 2,
    message: 'I totally agree with that!',
    user: 'sunnyday',
    time: new Date('2024-08-12T08:25:45'),
  },
  {
    id: 3,
    message: 'Does anyone have more information on this topic?',
    user: 'nightowl',
    time: new Date('2024-08-12T08:45:10'),
  },
  {
    id: 4,
    message: 'Great discussion, everyone!',
    user: 'starrysky',
    time: new Date('2024-08-12T09:10:00'),
  },
  {
    id: 5,
    message: 'I think we should explore other options as well.',
    user: 'rainmaker',
    time: new Date('2024-08-12T09:25:30'),
  },
  {
    id: 6,
    message: 'Can someone clarify the last point?',
    user: 'moonlight',
    time: new Date('2024-08-12T09:45:15'),
  },
  {
    id: 7,
    message: "Here's an interesting article on the subject.",
    user: 'earlybird',
    time: new Date('2024-08-12T10:00:45'),
  },
  {
    id: 8,
    message: 'Thanks for sharing your thoughts!',
    user: 'sunflower',
    time: new Date('2024-08-12T10:20:00'),
  },
  {
    id: 9,
    message: 'I have a different perspective on this.',
    user: 'stormchaser',
    time: new Date('2024-08-12T10:35:25'),
  },
  {
    id: 10,
    message: "Let's set up a meeting to discuss further.",
    user: 'cloudwalker',
    time: new Date('2024-08-12T10:50:55'),
  },
  {
    id: 1,
    message: 'this is the main chat',
    user: 'bluebird',
    time: new Date('2024-08-12T08:15:30'),
  },
  {
    id: 2,
    message: 'I totally agree with that!',
    user: 'sunnyday',
    time: new Date('2024-08-12T08:25:45'),
  },
  {
    id: 3,
    message: 'Does anyone have more information on this topic?',
    user: 'nightowl',
    time: new Date('2024-08-12T08:45:10'),
  },
  {
    id: 4,
    message: 'Great discussion, everyone!',
    user: 'starrysky',
    time: new Date('2024-08-12T09:10:00'),
  },
  {
    id: 5,
    message: 'I think we should explore other options as well.',
    user: 'rainmaker',
    time: new Date('2024-08-12T09:25:30'),
  },
  {
    id: 6,
    message: 'Can someone clarify the last point?',
    user: 'moonlight',
    time: new Date('2024-08-12T09:45:15'),
  },
  {
    id: 7,
    message: "Here's an interesting article on the subject.",
    user: 'earlybird',
    time: new Date('2024-08-12T10:00:45'),
  },
  {
    id: 8,
    message: 'Thanks for sharing your thoughts!',
    user: 'sunflower',
    time: new Date('2024-08-12T10:20:00'),
  },
  {
    id: 9,
    message: 'I have a different perspective on this.',
    user: 'stormchaser',
    time: new Date('2024-08-12T10:35:25'),
  },
  {
    id: 10,
    message: "Let's set up a meeting to discuss further.",
    user: 'cloudwalker',
    time: new Date('2024-08-12T10:50:55'),
  },
]

export const features = [
  {
    icon: Map,
    featureTitle: 'Multiple Map Type Support',
    featureDescription:
      'Lorem ipsum dolor sit amet consectetur. Sit venenatis posuere sapien pretium adipiscing dictum ut sagittis nisl. Lorem ipsum dolor sit amet consectetur. Sit venenatis posuere sapien pretium adipiscing dictum ut sagittis nisl.',
    comingSoon: '',
  },
  {
    icon: LayoutTemplate,
    featureTitle: 'Templates',
    featureDescription:
      'Lorem ipsum dolor sit amet consectetur. Sit venenatis posuere sapien pretium adipiscing dictum ut sagittis nisl. Lorem ipsum dolor sit amet consectetur. Sit venenatis posuere sapien pretium adipiscing dictum ut sagittis nisl.',
    comingSoon: '',
  },
  {
    icon: MessageCircle,
    featureTitle: 'Dedicated Chat',
    featureDescription:
      'Lorem ipsum dolor sit amet consectetur. Sit venenatis posuere sapien pretium adipiscing dictum ut sagittis nisl. Lorem ipsum dolor sit amet consectetur. Sit venenatis posuere sapien pretium adipiscing dictum ut sagittis nisl.',
    comingSoon: '',
  },
  {
    icon: Download,
    featureTitle: 'Download Your Creations',
    featureDescription:
      'Lorem ipsum dolor sit amet consectetur. Sit venenatis posuere sapien pretium adipiscing dictum ut sagittis nisl. Lorem ipsum dolor sit amet consectetur. Sit venenatis posuere sapien pretium adipiscing dictum ut sagittis nisl.',
    comingSoon: '',
  },
  {
    icon: BellRing,
    featureTitle: 'Notifications',
    featureDescription:
      'Lorem ipsum dolor sit amet consectetur. Sit venenatis posuere sapien pretium adipiscing dictum ut sagittis nisl. Lorem ipsum dolor sit amet consectetur. Sit venenatis posuere sapien pretium adipiscing dictum ut sagittis nisl.',
    comingSoon: '',
  },
  {
    icon: Users,
    featureTitle: 'Multi-User Editing',
    featureDescription:
      'Lorem ipsum dolor sit amet consectetur. Sit venenatis posuere sapien pretium adipiscing dictum ut sagittis nisl. Lorem ipsum dolor sit amet consectetur. Sit venenatis posuere sapien pretium adipiscing dictum ut sagittis nisl.',
    comingSoon: 'Coming soon for Pro users!',
  },
]

export const pricingModels = [
  {
    title: 'Free',
    monthlyPrice: '$0/month',
    yearlyPrice: '$0/year',
    description: 'Forever free!',
    features: ['Always Free', 'Share & View Maps', 'Basic Drawing Tools'],
  },
  {
    title: 'Pro',
    monthlyPrice: '$9.99/month',
    yearlyPrice: '$99.99/year',
    description: 'Even more features for our pro users!',
    features: [
      'Unlimited Map Storage',
      'Access to Beta Features',
      'Advanced Tools & Customization',
    ],
  },
]

export const faqData = [
  {
    question: 'How to use CyanNav?',
    answer:
      'CyanNav is easy to use! Simply include it in your project, and use the provided components to create navigation menus. Customize it as needed using the available props and styles.',
  },
  {
    question: 'Is CyanNav compatible with all browsers?',
    answer:
      'Yes, CyanNav is designed to be compatible with all modern browsers, ensuring a consistent experience across different platforms.',
  },
  {
    question: 'Can I customize the appearance of CyanNav?',
    answer:
      'Absolutely! CyanNav allows for extensive customization, including color schemes, font sizes, and layout options, to match your project’s design.',
  },
  {
    question: 'Does CyanNav support responsive design?',
    answer:
      'Yes, CyanNav is fully responsive and adjusts automatically to different screen sizes, ensuring optimal navigation on both desktop and mobile devices.',
  },
  {
    question: 'How do I integrate CyanNav with my existing project?',
    answer:
      'To integrate CyanNav with your project, simply install the package via npm or yarn, import the necessary components, and include them in your layout. Detailed documentation is available to guide you through the process.',
  },
  {
    question: 'Is CyanNav accessible?',
    answer:
      'Yes, CyanNav adheres to accessibility standards, including ARIA attributes, ensuring that all users, including those with disabilities, can navigate your site easily.',
  },
  {
    question: 'Can I use CyanNav with other UI libraries?',
    answer:
      'Yes, CyanNav is designed to be flexible and can be integrated with most UI libraries and frameworks, allowing you to enhance your existing project without conflict.',
  },
  {
    question: 'Is there support available if I run into issues?',
    answer:
      'Yes, our support team is available to help with any issues you may encounter. You can also refer to our extensive documentation and community forums for additional help.',
  },
  {
    question: 'Does CyanNav support multi-level menus?',
    answer:
      'Yes, CyanNav supports multi-level menus, making it easy to create complex navigation structures for your site.',
  },
  {
    question: 'Can I add icons to the navigation items?',
    answer:
      'Yes, CyanNav allows you to add icons to your navigation items, enhancing the visual appeal and usability of your menus.',
  },
]

type DashboardView = {
  title: string
  searchable: boolean
  selectOptions: { label: string; value: string }[]
}

export const dashboardViews: { [key: string]: DashboardView } = {
  'my-maps': {
    title: 'My Maps',
    searchable: true,
    selectOptions: [
      { label: 'Recently Updated', value: 'updated_at' }, // default
      { label: 'A-Z', value: 'alphabet-a-z' },
      { label: 'Recently Created', value: 'created_at' },
    ],
  },
  community: {
    title: 'Community',
    searchable: true,
    selectOptions: [
      { label: 'Most Positive', value: 'most_positive' }, // default
      { label: 'Most Negative', value: 'most_negative' },
      { label: 'Recently Updated', value: 'updated_at' },
      { label: 'A-Z', value: 'alphabet-a-z' },
      { label: 'Recently Created', value: 'created_at' },
    ],
  },
  'shared-with-me': {
    title: 'Shared with Me',
    searchable: false,
    selectOptions: [], // no sort options
  },
  'starred-maps': {
    title: 'Starred Maps',
    searchable: false,
    selectOptions: [], // no sort options
  },
}

export const sharedNavbarSteps: Step[] = [
  // Navbar
  {
    target: '#navbar-notification-icon',
    content: '🔔 This icon shows all the messages you’ve received.',
  },
  {
    target: '#navbar-help-icon',
    content: '❓ Click here for help and guides when you’re lost.',
  },
  {
    target: '#navbar-profile-icon',
    content:
      '👤 View your profile, manage settings, and even delete your account here.',
  },
]
export const dashboardSteps: Step[] = [
  {
    target: 'body',
    placement: 'center',
    content:
      '👋 Welcome to CyanNav Dashboard! Here you can manage your maps and discover others.',
    disableBeacon: true,
  },
  ...sharedNavbarSteps,
  // Sidebar
  {
    target: '#sidebar-mymaps',
    content: '🗺️ “My Maps” shows all the maps you own.',
  },
  {
    target: '#sidebar-community',
    content: '🌍 “Community” displays public maps from other users.',
  },
  {
    target: '#sidebar-shared',
    content: '🤝 “Shared with Me” shows maps others have shared with you.',
  },
  {
    target: '#sidebar-starred',
    content: '⭐ “Starred Maps” are your favorited maps for quick access.',
  },
  {
    target: '#sidebar-import-button',
    content:
      '➕ Use this button to import your own map files like NavJSON, GeoJSON, KML, or Shapefile.',
  },
  {
    target: '#sidebar-template-button',
    content:
      ' 🗺️ Click here to choose a ready-made template and start quickly.',
  },

  // General Area
  {
    target: '#map-grid',
    content:
      '📁 This is where your maps are displayed in a grid. You can search and sort them here.',
  },
  {
    target: 'body',
    placement: 'center',
    content: '🎉 That’s the tour! Now go explore CyanNav.',
  },
]

export const userSettingsSteps: Step[] = [
  {
    target: 'body',
    placement: 'center',
    content:
      '👋 Welcome to your User Settings page! Here you can manage your personal information and view your activity.',
    disableBeacon: true,
  },
  ...sharedNavbarSteps,

  // Tabs
  {
    target: '#user-settings-back-tab',
    content: '⬅️ Click here to go back to the previous page or dashboard.',
  },
  {
    target: '#user-settings-profile-tab',
    content:
      '🧑 This tab lets you update your profile picture, change your username, or delete your account.',
  },
  {
    target: '#user-settings-transactions-tab',
    content: '📜 View a full history of your past transactions here.',
  },

  {
    target: 'body',
    placement: 'center',
    content: '🎉 That’s it! Your settings are just a few clicks away.',
  },
]


export const yearlyPriceId = 'price_1RfTeYFJGOpcxqCyUirbAqcq'
export const monthlyPriceId = 'price_1RfTh2FJGOpcxqCyrhLMLTAF'
