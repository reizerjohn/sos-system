'use client';

import { AppProvider } from '@app/contexts/app-context';
import { ClassProvider } from '@app/contexts/class-context';
import { ClassScheduleProvider } from '@app/contexts/class-schedule-context';
import { StudentProvider } from '@app/contexts/student-context';
import { StudentGradesProvider } from '@app/contexts/student-grades-context';
import { UserProvider } from '@app/contexts/user-context';
import { clientApi } from '@app/lib/api';
import { SessionProvider } from 'next-auth/react';
import { ToastContainer } from 'react-toastify';
import { SWRConfig } from 'swr';

interface Props {
  children?: React.ReactNode;
}

/* Define client providers
    SessionProvider - for authentication
    ToastContainer - for toast notification message
*/

export default function ClientProviders({ children }: Props) {
  return (
    <SWRConfig
      value={{
        refreshInterval: 5000,
        fetcher: (url) => clientApi.get(url).then((res: any) => res.data),
      }}
    >
      <SessionProvider>
        <AppProvider>
          <ToastContainer />
          <UserProvider>
            <ClassProvider>
              <ClassScheduleProvider>
                <StudentProvider>
                  <StudentGradesProvider>{children}</StudentGradesProvider>
                </StudentProvider>
              </ClassScheduleProvider>
            </ClassProvider>
          </UserProvider>
        </AppProvider>
      </SessionProvider>
    </SWRConfig>
  );
}
