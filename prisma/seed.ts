import { PrismaClient } from '@prisma/client';
import user_seed from './seed/users.json';
import student_seed from './seed/students.json';
import class_schedules from './seed/class-schedules.json';
import class_list from './seed/class-list.json';
import subjects from './seed/subjects.json';
import { hash } from 'bcrypt';
import { format } from 'date-fns';

const prisma = new PrismaClient();

async function main() {
  const schoolYears = ['2021-2022', '2022-2023'];

  // Seeding school year data to database
  for (const schoolYear of schoolYears) {
    if (schoolYears[schoolYears.length - 1] === schoolYear) {
      await prisma.schoolYear.create({
        data: { year: schoolYear, isActive: true },
      });
    } else {
      await prisma.schoolYear.create({
        data: { year: schoolYear },
      });
    }
  }

  // Seeding users data to database
  for (const user of user_seed) {
    const { password } = user;

    await prisma.user.create({
      data: { ...user, password: await hash(password, 10) },
    });
  }

  // Seeding class list data to database
  for (const classData of class_list) {
    const { gradeLevel, section } = classData;

    const activeSchoolYear = await prisma.schoolYear.findFirst({
      where: { isActive: true },
    });

    await prisma.class.create({
      data: {
        schoolYearId: activeSchoolYear.id,
        gradeLevel: toTitleCase(gradeLevel),
        section: toTitleCase(section),
      },
    });
  }

  // Seeding subjects data to database
  for (const subject of subjects) {
    await prisma.subjects.create({ data: subject });
  }

  // Seeding students data to database
  for (const student of student_seed) {
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

  // Seed schedule to first class data
  for (const csData of class_schedules) {
    const { gradeLevel, section, schedules } = csData;

    const classData = await prisma.class.findFirst({ where: { gradeLevel, section } });

    if (classData) {
      for (const schedule of schedules) {
        const { time, day, subject } = schedule;

        const subjectData = await prisma.subjects.findUnique({
          where: { name: subject },
        });

        await prisma.classSchedule.create({
          data: { classId: classData.id, subjectId: subjectData.id, time, day },
        });
      }
    }
  }

  console.log('Seeded successfully! Please validate the database if it reflected.');
}

const toTitleCase = (text: string) => {
  text = text.toLowerCase();
  return text.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })

  .catch(async (e) => {
    console.error(e);

    await prisma.$disconnect();

    process.exit(1);
  });
