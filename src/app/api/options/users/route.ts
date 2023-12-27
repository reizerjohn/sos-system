/* eslint-disable @typescript-eslint/no-unused-vars */
import { getServerSession } from '@app/lib/auth';
import prisma from '@app/lib/prisma';
import { isEmpty } from 'lodash';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const session = await getServerSession();
  const { searchParams } = new URL(req.url);

  const search = searchParams.get('search');
  const page = +searchParams.get('page');
  const limit = +searchParams.get('limit');
  const type = searchParams.get('type');
  const classId = searchParams.get('classId');
  const exclude = searchParams.get('exclude');

  const activeSchoolYear = await prisma.schoolYear.findFirst({
    where: { isActive: true },
  });

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
    const typeQuery = !isEmpty(type) ? { type } : {};
    const excludeQuery = !isEmpty(exclude) ? { id: { notIn: exclude.split('|').map((e) => +e) } } : {};
    const filterStudentsQuery =
      !isEmpty(classId) && type === 'student'
        ? {
            OR: [
              { student: { classes: { some: { id: +classId, schoolYearId: activeSchoolYear.id } } } },
              { student: { classes: { none: { schoolYearId: activeSchoolYear.id } } } },
            ],
          }
        : {};

    const filterTeachersQuery =
      !isEmpty(classId) && type === 'teacher'
        ? {
            OR: [
              { classes: { some: { id: +classId, schoolYearId: activeSchoolYear.id } } },
              { classes: { none: { schoolYearId: activeSchoolYear.id } } },
            ],
          }
        : {};

    const whereQuery = {
      ...excludeQuery,
      ...typeQuery,
      ...searchQuery,
      ...filterStudentsQuery,
      ...filterTeachersQuery,
    };

    const [users, count] = await prisma.$transaction([
      prisma.user.findMany({
        select: { id: true, firstName: true, lastName: true, middleName: true },
        take: limit,
        skip: (page - 1) * limit,
        where: whereQuery,
        orderBy: { lastName: 'asc' },
      }),
      prisma.user.count({
        where: { ...typeQuery, ...searchQuery },
      }),
    ]);

    const options = users.map((u) => ({ value: u.id, label: `${u.lastName}, ${u.firstName} ${u.middleName}` }));

    return NextResponse.json({ options, count });
  }
  return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
}
