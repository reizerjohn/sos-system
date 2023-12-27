// Define constant / static data here

export const navbarLinks = [
  {
    userType: 'administrator',
    links: [
      { title: 'Home', url: '/' },
      { title: 'Teachers', url: '/teachers/management' },
      { title: 'Students', url: '/students/management' },
      { title: 'Class List', url: '/classes/management' },
      { title: 'Subjects', url: '/subjects/management' },
      { title: 'Messages', url: '/messages' },
      { title: 'About Us', url: '/about-us' },
      { title: 'Settings', url: '/settings' },
    ],
  },

  {
    userType: 'teacher',
    links: [
      { title: 'Home', url: '/' },
      { title: 'Students', url: '/students/management' },
      { title: 'Class Schedule', url: '/class-schedule' },
      { title: 'Students Grading', url: '/grades/students' },
      { title: 'About Us', url: '/about-us' },
    ],
  },

  {
    userType: 'student',
    links: [
      { title: 'Home', url: '/' },
      { title: 'Class Schedule', url: '/class-schedule' },
      { title: 'Grades', url: '/grades' },
      { title: 'Messages', url: '/messages' },
      { title: 'About Us', url: '/about-us' },
    ],
  },
];

export const userTypeRoutes = [
  {
    userType: 'administrator',
    routes: [
      '/teachers',
      '/students',
      '/classes',
      '/subjects',
      '/grades/students',
      '/messages',
      '/about-us',
      '/settings',
      '/profile',
    ],
  },
  { userType: 'teacher', routes: ['/students', '/class-schedule', '/grades/students', '/profile', '/about-us'] },
  { userType: 'student', routes: ['/class-schedule', '/grades', '/messages', '/profile', '/about-us'] },
];

export const gradeLevel = [
  'Kinder',
  'Grade 1',
  'Grade 2',
  'Grade 3',
  'Grade 4',
  'Grade 5',
  'Grade 6',
  'Grade 7',
  'Grade 8',
  'Grade 9',
  'Grade 10',
] as const;

export const scheduleTime = [
  '0700 - 0800',
  '0800 - 0900',
  '0900 - 1000',
  '1000 - 1100',
  '1100 - 1200',
  '1200 - 1300',
  '1300 - 1400',
  '1400 - 1500',
  '1500 - 1600',
  '1600 - 1700',
  '1700 - 1800',
] as const;

export const scheduleDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;

export interface SearchParamsProps {
  search: string;
  page: number;
  limit: number;
}
