/* eslint-disable @typescript-eslint/no-unused-vars */
import { getServerSession } from '@app/lib/auth';
import prisma from '@app/lib/prisma';
import { isEmpty } from 'lodash';
import { NextResponse, NextRequest } from 'next/server';

export const revalidate = 0;

export async function GET(req: NextRequest) {
  const session = await getServerSession();
  const { searchParams } = new URL(req.url);

  const search = searchParams.get('search');
  const page = +searchParams.get('page');
  const limit = +searchParams.get('limit');
  const exclude = searchParams.get('exclude');

  if (session?.user) {
    const searchQuery = !isEmpty(search)
      ? {
          OR: [
            { firstName: { contains: search } },
            { lastName: { contains: search } },
            { middleName: { contains: search } },
          ],
        }
      : {};
    const excludeQuery = !isEmpty(exclude) ? { id: { notIn: exclude.split('|').map((e) => +e) } } : {};
    const whereQuery = { ...excludeQuery, ...searchQuery, type: 'teacher' };

    const [users, count] = await prisma.$transaction([
      prisma.user.findMany({
        select: { id: true, firstName: true, lastName: true, middleName: true },
        take: limit,
        skip: (page - 1) * limit,
        where: whereQuery,
        orderBy: { lastName: 'asc' },
      }),
      prisma.user.count({
        where: { ...searchQuery, type: 'teacher' },
      }),
    ]);

    const options = users.map((u) => ({ value: u.id, label: `${u.lastName}, ${u.firstName} ${u.middleName}` }));

    return NextResponse.json({ options, count });
  }
  return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
}
