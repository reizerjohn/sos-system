/* eslint-disable @typescript-eslint/no-unused-vars */
import { getServerSession } from '@app/lib/auth';
import prisma from '@app/lib/prisma';
import { isEmpty } from 'lodash';
import { NextResponse, NextRequest } from 'next/server';

export const revalidate = 0;

export async function GET(req: NextRequest) {
  const session = await getServerSession();
  const { searchParams } = new URL(req.url);
  const classId = searchParams.get('classId');

  if (session?.user) {
    const userType = session.user.type;

    const activeSchoolYear = await prisma.schoolYear.findFirst({
      where: { isActive: true },
    });

    if (userType === 'administrator') {
      if (!isEmpty(classId)) {
        const schedules = await prisma.classSchedule.findMany({
          where: { classId: +classId },
          include: { teacher: true, subject: true },
        });

        const formatData = schedules.map((s) => ({
          time: { label: s.time, value: s.time },
          day: { label: s.day, value: s.day },
          subject: s.subject ? { label: s.subject.name, value: s.subject.id } : null,
          teacher: s.teacher
            ? {
                label: `${s.teacher.lastName}, ${s.teacher.firstName} ${s.teacher.middleName}`,
                value: s.teacher.id,
              }
            : null,
        }));

        return NextResponse.json(formatData);
      }
    } else if (userType === 'teacher') {
      const schedules = await prisma.classSchedule.findMany({
        where: { teacherId: session.user.id },
        include: { subject: true },
      });

      return NextResponse.json(schedules);
    } else if (userType === 'student') {
      const studentClass = await prisma.class.findFirst({
        where: { schoolYear: { id: activeSchoolYear.id }, students: { some: { id: +session.user.studentId } } },
        include: { schoolYear: true, adviser: true },
      });

      if (studentClass) {
        const schedules = await prisma.classSchedule.findMany({
          where: { classId: studentClass.id },
          include: { subject: true },
        });

        return NextResponse.json(schedules);
      }
    }

    return NextResponse.json([]);
  }

  return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession();

  if (session?.user?.type === 'administrator') {
    const body = await req.json();
    const { classId, schedules } = body.data;

    // Clear existing class schedules
    await prisma.classSchedule.deleteMany({
      where: { classId },
    });

    for (const schedule of schedules) {
      await prisma.classSchedule.create({
        data: { classId, ...schedule },
      });
    }

    return NextResponse.json({ success: true, message: 'Successfully updated class schedules' });
  }

  return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
}
