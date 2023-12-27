'use client';

import { clientApi } from '@app/lib/api';
import { createContext, useContext, useState, ReactNode } from 'react';
import { useAppContext } from '../app-context';
import { OptionType } from '@app/components/fields/dynamic-select';
export interface StudentGradesType {
  studentId: number;
  student: string;
  subject: string;
  q1: number;
  q2: number;
  q3: number;
  q4: number;
  finalGrade: number;
  remarks: string;
}

interface FetchStudentGradesType {
  studentId: number;
  classId: number;
}

interface FetchSubjectStudentsType {
  subjectId: number;
}

export type StudentGradesContextType = {
  grades: Partial<StudentGradesType>[];
  setGrades: (grades: Partial<StudentGradesType>[]) => void;
  fetchStudentGrades: (params: Partial<FetchStudentGradesType>) => void;
  fetchSubjectStudents: (params: FetchSubjectStudentsType) => void;
  schoolYear: OptionType;
  setSchoolYear: (year: OptionType) => void;
};

interface Props {
  children: ReactNode;
}

const StudentGradesContext = createContext<StudentGradesContextType>(undefined);

const StudentGradesProvider = ({ children }: Props) => {
  const { setIsLoading } = useAppContext();
  const [grades, setGrades] = useState<Partial<StudentGradesType>[]>([]);
  const [schoolYear, setSchoolYear] = useState<OptionType | null>(null);

  const fetchStudentGrades = async (params?: Partial<FetchStudentGradesType>) => {
    setIsLoading(true);

    const schoolYearParams = schoolYear ? { schoolYear: schoolYear.label } : {};
    const { data } = await clientApi.get('users/students/grades', {
      params: { ...params, ...schoolYearParams },
    });

    setGrades(data);
    setIsLoading(false);
  };

  const fetchSubjectStudents = async ({ subjectId }: FetchSubjectStudentsType) => {
    setIsLoading(true);

    const { data } = await clientApi.get('users/students/grades', {
      params: { subjectId },
    });

    setGrades(data);
    setIsLoading(false);
  };

  const value = {
    grades,
    setGrades,
    fetchStudentGrades,
    fetchSubjectStudents,
    schoolYear,
    setSchoolYear,
  };

  return <StudentGradesContext.Provider value={value}>{children}</StudentGradesContext.Provider>;
};

const useStudentGradesContext = () => useContext<StudentGradesContextType>(StudentGradesContext);

export { StudentGradesProvider, useStudentGradesContext };
