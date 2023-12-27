/* eslint-disable @typescript-eslint/no-unused-vars */
import { getServerSession } from '@app/lib/auth';
import { hash } from '@app/lib/bcrypt';
import prisma from '@app/lib/prisma';
import { format } from 'date-fns';
import { NextResponse, NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const session = await getServerSession();

  if (session?.user?.type === 'administrator') {
    const body = await req.json();

    for (const student of body.data) {
      const {
        idNumber,
        firstName,
        lastName,
        middleName,
        gradeLevel,
        section,
        gender,
        birthday,
        address,
        guardian,
        dateEnrolled,
        status,
      } = student;

      // Check if class exists
      let studentClass = await prisma.class.findFirst({
        where: { gradeLevel: toTitleCase(gradeLevel), section: toTitleCase(section) },
      });

      // If class does not exist, create new class data
      if (!studentClass) {
        const schoolYear = await prisma.schoolYear.findFirst({ where: { year: '2022-2023' } });

        studentClass = await prisma.class.create({
          data: { schoolYearId: schoolYear.id, gradeLevel: toTitleCase(gradeLevel), section: toTitleCase(section) },
        });
      }

      const idNumberExists = await prisma.user.findUnique({ where: { idNumber } });

      if (!idNumberExists) {
        await prisma.user.create({
          data: {
            idNumber: `${idNumber}`,
            firstName: toTitleCase(firstName),
            lastName: toTitleCase(lastName),
            middleName: toTitleCase(middleName),
            password: await hash(format(new Date(birthday), 'yyyy-MM-dd'), 10),
            type: 'student',
            student: {
              create: {
                gender: toTitleCase(gender),
                birthday: new Date(birthday),
                address: toTitleCase(address),
                guardian: toTitleCase(guardian),
                dateEnrolled: new Date(dateEnrolled),
                classes: { connect: { id: studentClass.id } },
                status,
              },
            },
          },
        });
      }
    }
    return NextResponse.json({ success: true, message: 'Successfully imported CSV data' });
  }

  return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
}

const toTitleCase = (text: string) => {
  text = text.toLowerCase();
  return text.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};
