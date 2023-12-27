'use client';

import { clientApi } from '@app/lib/api';
import { createContext, useContext, useState, ReactNode, useRef } from 'react';
import { useAppContext } from '../app-context';

export type StudentContextType = {
  students: any[];
  setStudents: (students: any[]) => void;
  search: string;
  setSearch: (value: string) => void;
  pageCount: number;
  setPageCount: (count: number) => void;
  limit: number;
  setLimit: (count: number) => void;
  hasNextButton: boolean;
  setHasNextButton: (flag: boolean) => void;
  sortBy: string;
  orderBy: string;
  setSortByField: (key: string) => void;
  fetchStudents: () => void;
  reset: () => void;
};

interface Props {
  children: ReactNode;
}

const StudentContext = createContext<StudentContextType>(undefined);

const StudentProvider = ({ children }: Props) => {
  const { setIsLoading } = useAppContext();
  const [students, setStudents] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [pageCount, setPageCount] = useState(1);
  const [limit, setLimit] = useState(10);
  const [hasNextButton, setHasNextButton] = useState(true);

  let sortBy = useRef<string>('name');
  let orderBy = useRef<'asc' | 'desc'>('asc');

  const fetchStudents = async () => {
    setIsLoading(true);

    const sortParams = { sortBy: sortBy.current, orderBy: orderBy.current };
    const params = { search, page: pageCount, limit, ...sortParams };
    const { data } = await clientApi.get('users/students', { params });

    setStudents(data.users);
    setHasNextButton(data.count - pageCount * limit > 0);
    setIsLoading(false);
  };

  const reset = () => {
    setPageCount(1);
    fetchStudents();
  };

  const setSortByField = (key: string) => {
    if (!sortBy.current || sortBy.current !== key || orderBy.current === 'asc') {
      orderBy.current = 'desc';
    } else {
      orderBy.current = 'asc';
    }

    sortBy.current = key;
    fetchStudents();
  };

  const value = {
    students,
    setStudents,
    search,
    setSearch,
    pageCount,
    setPageCount,
    limit,
    setLimit,
    sortBy: sortBy.current,
    orderBy: orderBy.current,
    hasNextButton,
    setHasNextButton,
    setSortByField,
    fetchStudents,
    reset,
  };

  return <StudentContext.Provider value={value}>{children}</StudentContext.Provider>;
};

const useStudentContext = () => useContext<StudentContextType>(StudentContext);

export { StudentProvider, useStudentContext };
