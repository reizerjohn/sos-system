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

  if (session?.user?.type === 'teacher') {
    const activeSchoolYear = await prisma.schoolYear.findFirst({
      where: { isActive: true },
    });

    const teacherActiveClass = await prisma.class.findFirst({
      where: {
        schoolYear: { year: activeSchoolYear.year },
        adviserId: session.user.id,
      },
    });

    const searchQuery = !isEmpty(search) ? { name: { contains: search } } : {};

    const [subjects, count] = await prisma.$transaction([
      prisma.subjects.findMany({
        where: {
          ...searchQuery,
          schedules: { some: { classId: teacherActiveClass.id } },
        },
        take: limit,
        skip: (page - 1) * limit,
        orderBy: { name: 'asc' },
      }),
      prisma.subjects.count({ where: searchQuery }),
    ]);

    const formattedData = subjects.map((s) => ({ label: s.name, value: s.id }));

    return NextResponse.json({ options: formattedData, count });
  }

  return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
}
