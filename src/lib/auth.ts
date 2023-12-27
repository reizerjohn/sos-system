import { ERROR_PAGE, LOGIN_PAGE } from '@app/constants/routes';
import { NextAuthOptions, getServerSession as getNextServerSession } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import prisma from './prisma';
import { compare } from './bcrypt';

export interface CredentialsType extends Record<'idNumber' | 'password', string> {
  idNumber: string;
  password: string;
}

export const getServerSession = async () => {
  const session = await getNextServerSession(authOptions);
  return session;
};

// Default next auth configuration for authentication
// Reference: https://codevoweb.com/setup-and-use-nextauth-in-nextjs-13-app-directory/

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        idNumber: { label: 'ID Number', type: 'string' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: CredentialsType): Promise<any | null> {
        try {
          const { idNumber, password } = credentials;

          if (idNumber && password) {
            // Check for matched id number and password on database
            const user = await prisma.user.findFirst({
              where: { idNumber },
              include: { student: true },
            });
            const passwordMatched = await compare(password, user.password);

            // Return matched user account
            if (user && passwordMatched) {
              return {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                middleName: user.middleName,
                idNumber: user.idNumber,
                type: user.type,
                studentId: user.student?.id,
              };
            }
          }

          // Return null if credentials did not match to
          // any data in accounts list
          return null;
        } catch (error) {
          console.error(error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: LOGIN_PAGE,
    error: ERROR_PAGE,
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 3, // 3 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }

      return token;
    },
    async session({ session, token }) {
      session.user = token.user as any;
      return session;
    },
  },
};
