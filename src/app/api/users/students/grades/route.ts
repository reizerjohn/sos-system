/* eslint-disable @typescript-eslint/no-unused-vars */
import { getServerSession } from '@app/lib/auth';
import prisma from '@app/lib/prisma';
import _, { isEmpty } from 'lodash';
import { NextResponse, NextRequest } from 'next/server';

export const revalidate = 0;

export async function GET(req: NextRequest) {
  const session = await getServerSession();
  const userType = session?.user?.type;

  const { searchParams } = new URL(req.url);
  const subjectId = searchParams.get('subjectId');
  const schoolYear = searchParams.get('schoolYear');

  const activeSchoolYear = await prisma.schoolYear.findFirst({
    where: { isActive: true },
  });

  if (session?.user) {
    if (userType === 'teacher' && !isEmpty(subjectId)) {
      const activeClass = await prisma.class.findFirst({
        where: {
          schoolYear: { year: activeSchoolYear.year },
          adviserId: session.user.id,
        },
        include: { students: { include: { user: true, grades: true } } },
      });

      if (activeClass) {
        const studentsList = activeClass.students;

        const gradesList = studentsList.map((s) => {
          const subjectGrade = s.grades.find((g) => g.subjectId === +subjectId) ?? {};

          return {
            classId: activeClass.id,
            studentId: s.id,
            subjectId: +subjectId,
            student: `${s.user.lastName}, ${s.user.firstName} ${s.user.middleName}`,
            ...subjectGrade,
          };
        });

        return NextResponse.json(gradesList);
      }
    } else if (userType === 'student') {
      const studentActiveClass = await prisma.class.findFirst({
        where: {
          schoolYear: { year: schoolYear ?? activeSchoolYear.year },
          students: { some: { id: +session.user.studentId } },
        },
      });

      if (studentActiveClass) {
        const subjects = await prisma.classSchedule.findMany({
          select: { subject: true },
          where: { classId: studentActiveClass.id },
        });

        if (subjects.length > 0) {
          const grades = await prisma.studentGrades.findMany({
            select: { subject: true, q1: true, q2: true, q3: true, q4: true, finalGrade: true, remarks: true },
            where: { classId: studentActiveClass.id, studentId: +session.user.studentId },
          });

          let filteredSubjects = _.uniq(subjects.map((s) => s.subject.name));
          const gradesList = filteredSubjects.map((s) => {
            const hasGrade = grades.find((g) => g.subject.name === s);

            if (hasGrade) return { ...hasGrade, subject: hasGrade.subject.name };
            return { subject: s };
          });

          return NextResponse.json(gradesList);
        }
      }
    }
    return NextResponse.json([]);
  }

  return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  const user = session?.user;

  const body = await req.json();
  const { grades } = body.data;
  const { classId, studentId, subjectId } = grades[0];

  if (user.type === 'administrator' || user.type === 'teacher') {
    // Clear existing class schedules
    await prisma.studentGrades.deleteMany({
      where: { studentId, subjectId, classId },
    });

    for (const grade of grades) {
      const { id, classId, studentId, subjectId, student, ...gradeData } = grade;
      await prisma.studentGrades.create({ data: { classId, studentId, subjectId, ...gradeData } });
    }

    return NextResponse.json({ success: true, message: 'Successfully updated class schedules' });
  }
  return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
}
