/** Verified owner-supplied identity. Editorial course copy is a later phase. */
export interface CourseDefinition {
  id: string;
  name: string;
  category: 'theory' | 'practical';
}

export interface BranchDefinition {
  id: string;
  locale: string;
  name: string;
  branchName: string;
  fullName: string;
  tagline: string;
  links: {
    registration: string;
    messenger: string;
    facebook: string;
    googleMaps: string | null;
  };
  address: string | null;
  defaultHours: {
    timeZone: string;
    days: readonly number[];
    opens: string;
    closes: string;
    displayDays: string;
    displayTime: string;
  };
  courses: readonly CourseDefinition[];
}

export const branch = {
  id: 'trece-martires',
  locale: 'en-PH',
  name: 'A1C Driving Academy',
  branchName: 'Trece Martires Branch',
  fullName: 'A1C Driving Academy – Trece Martires Branch',
  tagline: 'Start Smart. Drive Confident.',
  links: {
    registration: 'https://a1c-operations.pages.dev/register',
    messenger: 'https://m.me/a1ctmc',
    facebook: 'https://fb.me/a1ctmc',
    googleMaps: null,
  },
  address: null,
  defaultHours: {
    timeZone: 'Asia/Manila',
    days: [0, 1, 2, 3, 4, 5, 6],
    opens: '08:00',
    closes: '17:00',
    displayDays: 'Monday–Sunday',
    displayTime: '8:00 AM–5:00 PM',
  },
  courses: [
    { id: 'tdc', name: 'Theoretical Driving Course – TDC', category: 'theory' },
    { id: 'online-tdc', name: 'Online TDC', category: 'theory' },
    { id: 'pdc-motorcycle', name: 'PDC Motorcycle with Knowledge', category: 'practical' },
    { id: 'pdc-manual', name: 'PDC 4-Wheel Manual', category: 'practical' },
    { id: 'pdc-automatic', name: 'PDC 4-Wheel Automatic', category: 'practical' },
  ],
} as const satisfies BranchDefinition;

export type CourseId = typeof branch.courses[number]['id'];
