// Shared navigation + footer data for the public pages.
// Kept out of the component files so React Fast Refresh keeps working.

export const MENU_ITEMS = [
  { label: 'HOME', to: '/' },
  { label: 'WORK', to: '/work' },
  { label: 'ABOUT', to: '/about' },
  { label: 'CONTACT', to: '/contact' },
];

export const footerColumns = (contactData) => [
  {
    title: 'Studio',
    lines: [contactData.address, 'Kakkhean Portfolio'],
  },
  {
    title: 'Follow',
    lines: [
      { label: 'Twitter', href: contactData.twitter },
      { label: 'Instagram', href: contactData.instagram },
      { label: 'LinkedIn', href: contactData.linkedin },
    ],
  },
  {
    title: 'Contact',
    lines: [{ label: contactData.email, href: `mailto:${contactData.email}` }, contactData.phone],
  },
  {
    title: 'Credits',
    lines: ['Crafted by Kakkhean'],
  },
];
