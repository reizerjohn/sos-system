// Data used for Academic records page

export type GradesType = {
  code: string;
  description: string;
  grade: string;
  credit: string;
  remark: string;
};

export const academicGradesHeaders = ['Code', 'Description', 'Grade', 'Credit', 'Remark'];

export const sampleGrades = [
  {
    yearLevel: 'First Year',
    semester: 'First Semester',
    records: [
      {
        code: 'CCS 1001',
        description: 'Introduction to Computing',
        grade: '2.75',
        credit: '3.00',
        remark: 'Passed',
      },
      {
        code: 'CCS 1400',
        description: 'Fundamentals of Programming',
        grade: '2.25',
        credit: '3.00',
        remark: 'Passed',
      },
      {
        code: 'CETech 1',
        description: 'Living in the IT Era',
        grade: '2.0',
        credit: '3.00',
        remark: 'Passed',
      },
      {
        code: 'Fil 12',
        description: 'Sayko-Sosyolinggwistik na Pag-aaral ng Wikang Filipino',
        grade: '2.5',
        credit: '3.00',
        remark: 'Passed',
      },
      {
        code: 'GEMath 1',
        description: 'Mathematics in the Modern World',
        grade: '2.5',
        credit: '3.00',
        remark: 'Passed',
      },
      {
        code: 'GESocSci 1',
        description: 'Understanding the Self',
        grade: '2.25',
        credit: '3.00',
        remark: 'Passed',
      },
      {
        code: 'NSTP1-CWTS',
        description: 'Civic Welfare Training Service',
        grade: '2.75',
        credit: '3.00',
        remark: 'Passed',
      },
      {
        code: 'PE 2B(M)',
        description: 'Individual/Dual Sports (Swimming)',
        grade: '1.5',
        credit: '3.00',
        remark: 'Passed',
      },
      {
        code: 'RE 1',
        description: 'Christianity in a Changing Society',
        grade: '2.25',
        credit: '3.00',
        remark: 'Passed',
      },
      {
        code: 'SEAL 1',
        description: 'Student Enhancement Activities for Life I',
        grade: '3.0',
        credit: '3.00',
        remark: 'Passed',
      },
    ],
  },
  {
    yearLevel: 'First Year',
    semester: 'Second Semester',
    records: [
      {
        code: 'CCS 1301',
        description: 'Data Structures and Algorithms',
        grade: '2.75',
        credit: '3.00',
        remark: 'Passed',
      },
      {
        code: 'CCS 1500',
        description: 'Intermediate Programming',
        grade: '2.25',
        credit: '3.00',
        remark: 'Passed',
      },
      {
        code: 'CEArts 3',
        description: 'Reading Visual Arts',
        grade: '2.0',
        credit: '3.00',
        remark: 'Passed',
      },
      {
        code: 'CESocSci 4',
        description: 'The Entrepreneurial Mind',
        grade: '2.5',
        credit: '3.00',
        remark: 'Passed',
      },
      {
        code: 'Fil 13',
        description: 'Pagsusuri at Pagpapahalaga ng mga Kontemporaryong Panitikan',
        grade: '2.5',
        credit: '3.00',
        remark: 'Passed',
      },
      {
        code: 'GEEng 1 ',
        description: 'Purposive Communication',
        grade: '2.25',
        credit: '3.00',
        remark: 'Passed',
      },
      {
        code: 'NSTP2-CWTS',
        description: 'Civic Welfare Training Service',
        grade: '2.75',
        credit: '3.00',
        remark: 'Passed',
      },
      {
        code: 'PE 1a(M)',
        description: 'Physical Fitness and Wellness',
        grade: '1.5',
        credit: '3.00',
        remark: 'Passed',
      },
      {
        code: 'PE 2B(W)',
        description: 'Individual/Dual Sports (Swimming)',
        grade: '2.25',
        credit: '3.00',
        remark: 'Passed',
      },
      {
        code: 'RE 2',
        description: 'Christian Ethics in a Changing World',
        grade: '3.0',
        credit: '3.00',
        remark: 'Passed',
      },
      {
        code: 'SEAL 2',
        description: 'Student Enhancement Activities for Life II',
        grade: '3.0',
        credit: '3.00',
        remark: 'Passed',
      },
    ],
  },
];



export const sampleGradesEmpty = [
  {
    yearLevel: 'First Year',
    semester: 'First Semester',
    records: [
      {
        code: 'Subject 1',
        description: 'Subject 1 Description',
        grade: '',
        credit: '',
        remark: '',
      },
      {
        code: 'Subject 2',
        description: 'Subject 2 Description',
        grade: '',
        credit: '',
        remark: '',
      },
      {
        code: 'Subject 3',
        description: 'Subject 3 Description',
        grade: '',
        credit: '',
        remark: '',
      },
      {
        code: 'Subject 4',
        description: 'Subject 4 Description',
        grade: '',
        credit: '',
        remark: '',
      },
      {
        code: 'Subject 5',
        description: 'Subject 5 Description',
        grade: '',
        credit: '',
        remark: '',
      },
      {
        code: 'Subject 6',
        description: 'Subject 6 Description',
        grade: '',
        credit: '',
        remark: '',
      },
      {
        code: 'Subject 7',
        description: 'Subject 7 Description',
        grade: '',
        credit: '',
        remark: '',
      },
      {
        code: 'Subject 8',
        description: 'Subject 8 Description',
        grade: '',
        credit: '',
        remark: '',
      },
      {
        code: 'Subject 9',
        description: 'Subject 9 Description',
        grade: '',
        credit: '',
        remark: '',
      },
      {
        code: 'Subject 10',
        description: 'Subject 10 Description',
        grade: '',
        credit: '',
        remark: '',
      },
    ],
  },

];