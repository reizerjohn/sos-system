import prisma from '@app/lib/prisma';
import { getServerSession } from '@app/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const session = await getServerSession();

  if (session?.user?.type === 'administrator') {
    const { schoolYear } = await req.json();

    const activeSchoolYear = await prisma.schoolYear.findFirst({ where: { isActive: true } });
    const schoolYearExists = await prisma.schoolYear.findFirst({ where: { year: schoolYear } });

    if (schoolYearExists) {
      return NextResponse.json({ message: 'School year already exists' }, { status: 400 });
    }

    const newSchoolYear = await prisma.schoolYear.create({ data: { year: schoolYear } });

    const classList = await prisma.class.findMany({
      where: { schoolYearId: activeSchoolYear.id },
      include: { schedules: true },
    });

    for (const classData of classList) {
      const classSchedules = classData.schedules.map((s) => ({
        subjectId: s.subjectId,
        time: s.time,
        day: s.day,
      }));

      await prisma.class.create({
        data: {
          schoolYearId: newSchoolYear.id,
          gradeLevel: classData.gradeLevel,
          section: classData.section,
          schedules: {
            createMany: { data: classSchedules },
          },
        },
      });
    }

    return NextResponse.json({ success: true, message: 'Successfully add new school year' });
  }

  return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession();

  if (session?.user?.type === 'administrator') {
    const { schoolYear } = await req.json();

    const activeSchoolYear = await prisma.schoolYear.findFirst({ where: { isActive: true } });

    if (activeSchoolYear) {
      await prisma.schoolYear.update({ where: { id: activeSchoolYear.id }, data: { isActive: false } });
    }

    const newActiveSchoolYear = await prisma.schoolYear.findFirst({ where: { year: schoolYear } });
    await prisma.schoolYear.update({ where: { id: newActiveSchoolYear.id }, data: { isActive: true } });

    return NextResponse.json({ success: true, message: 'Successfully updated school year' });
  }

  return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
}
