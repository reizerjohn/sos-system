/* eslint-disable @typescript-eslint/no-unused-vars */
import { getServerSession } from '@app/lib/auth';
import prisma from '@app/lib/prisma';
import { isEmpty, uniq } from 'lodash';
import { NextResponse, NextRequest } from 'next/server';
import { format } from 'date-fns';

export const revalidate = 0;

export async function GET(req: NextRequest) {
  const session = await getServerSession();
  const { searchParams } = new URL(req.url);
  const subjectId = searchParams.get('subjectId');

  if (session?.user?.type === 'administrator' && !isEmpty(subjectId)) {
    const activeSchoolYear = await prisma.schoolYear.findFirst({
      where: { isActive: true },
    });

    const classList = await prisma.class.findMany({
      where: { schoolYearId: activeSchoolYear.id, schedules: { some: { subjectId: +subjectId } } },
      include: { students: { include: { user: true } } },
    });

    let studentsList = classList.flatMap((c) => c.students.map((s) => ({ ...s, gradeLevel: c.gradeLevel })));
    studentsList = uniq(studentsList);

    const formattedData = studentsList.map((s) => ({
      id: s.user.id,
      idNumber: s.user.idNumber,
      fullName: `${s.user.lastName}, ${s.user.firstName} ${s.user.middleName}`,
      gradeLevel: s.gradeLevel,
      gender: s.gender,
      birthday: format(new Date(s.birthday), 'MM-dd-yyyy'),
      status: s.status,
    }));

    return NextResponse.json({ students: formattedData });
  }

  return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
}
