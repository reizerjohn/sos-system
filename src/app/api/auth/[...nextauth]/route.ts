import { authOptions } from '@app/lib/auth';
import NextAuth from 'next-auth/next';

// Default next auth configuration for authentication
// Reference: https://codevoweb.com/setup-and-use-nextauth-in-nextjs-13-app-directory/

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
