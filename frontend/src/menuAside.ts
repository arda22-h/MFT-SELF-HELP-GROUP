import * as icon from '@mdi/js';
import { MenuAsideItem } from './interfaces'

const menuAside: MenuAsideItem[] = [
  {
    href: '/dashboard',
    icon: icon.mdiViewDashboardOutline,
    label: 'Dashboard',
  },

  {
    href: '/users/users-list',
    label: 'Users',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: icon.mdiAccountGroup ?? icon.mdiTable,
    permissions: 'READ_USERS'
  },
  {
    href: '/bank_accounts/bank_accounts-list',
    label: 'Bank accounts',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: 'mdiBankOutline' in icon ? icon['mdiBankOutline' as keyof typeof icon] : icon.mdiTable ?? icon.mdiTable,
    permissions: 'READ_BANK_ACCOUNTS'
  },
  {
    href: '/contributions/contributions-list',
    label: 'Contributions',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: 'mdiCurrencyUsd' in icon ? icon['mdiCurrencyUsd' as keyof typeof icon] : icon.mdiTable ?? icon.mdiTable,
    permissions: 'READ_CONTRIBUTIONS'
  },
  {
    href: '/documents/documents-list',
    label: 'Documents',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: 'mdiFileDocument' in icon ? icon['mdiFileDocument' as keyof typeof icon] : icon.mdiTable ?? icon.mdiTable,
    permissions: 'READ_DOCUMENTS'
  },
  {
    href: '/expenses/expenses-list',
    label: 'Expenses',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: 'mdiCash' in icon ? icon['mdiCash' as keyof typeof icon] : icon.mdiTable ?? icon.mdiTable,
    permissions: 'READ_EXPENSES'
  },
  {
    href: '/fines/fines-list',
    label: 'Fines',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: 'mdiGavel' in icon ? icon['mdiGavel' as keyof typeof icon] : icon.mdiTable ?? icon.mdiTable,
    permissions: 'READ_FINES'
  },
  {
    href: '/letters/letters-list',
    label: 'Letters',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: 'mdiEmail' in icon ? icon['mdiEmail' as keyof typeof icon] : icon.mdiTable ?? icon.mdiTable,
    permissions: 'READ_LETTERS'
  },
  {
    href: '/loans/loans-list',
    label: 'Loans',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: 'mdiBank' in icon ? icon['mdiBank' as keyof typeof icon] : icon.mdiTable ?? icon.mdiTable,
    permissions: 'READ_LOANS'
  },
  {
    href: '/members/members-list',
    label: 'Members',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: 'mdiAccountGroup' in icon ? icon['mdiAccountGroup' as keyof typeof icon] : icon.mdiTable ?? icon.mdiTable,
    permissions: 'READ_MEMBERS'
  },
  {
    href: '/projects/projects-list',
    label: 'Projects',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: 'mdiBriefcase' in icon ? icon['mdiBriefcase' as keyof typeof icon] : icon.mdiTable ?? icon.mdiTable,
    permissions: 'READ_PROJECTS'
  },
  {
    href: '/welfare_contributions/welfare_contributions-list',
    label: 'Welfare contributions',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: 'mdiHeart' in icon ? icon['mdiHeart' as keyof typeof icon] : icon.mdiTable ?? icon.mdiTable,
    permissions: 'READ_WELFARE_CONTRIBUTIONS'
  },
  {
    href: '/profile',
    label: 'Profile',
    icon: icon.mdiAccountCircle,
  },

 {
    href: '/api-docs',
    target: '_blank',
    label: 'Swagger API',
    icon: icon.mdiFileCode,
    permissions: 'READ_API_DOCS'
  },
]

export default menuAside
