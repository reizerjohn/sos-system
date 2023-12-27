export {};

declare global {
  type User = {
    id: number;
    firstName: string;
    lastName: string;
    middleName: string;
    idNumber: string;
    type: string;
    studentId?: number;
  };

  type UserType =  'administrator' | 'teacher' | 'student';
}
