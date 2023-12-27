import ClientProviders from '@app/providers/client-provider';
import '@app/styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import 'react-chat-elements/dist/main.css';
import MainPageLayout from '@app/components/layouts/main';

// Set page metadata
export const metadata = {
  title: `St. Robert's International College | Student Online Services`,
  description: `Student Online Services System for Saint Robert's International College`,
};

// Main root layout
export default async function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body>
        <main className='min-h-screen flex flex-col bg-gray-100'>
          <ClientProviders>
            <MainPageLayout>{children}</MainPageLayout>
          </ClientProviders>
        </main>
        <div id={'#__next'.replace('#', '')} />
      </body>
    </html>
  );
}
