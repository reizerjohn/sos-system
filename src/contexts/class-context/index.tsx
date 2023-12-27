'use client';

import { OptionType } from '@app/components/fields/dynamic-select';
import { createContext, useContext, useState, ReactNode, useRef } from 'react';
import { useAppContext } from '../app-context';
import { clientApi } from '@app/lib/api';
export interface ClassType {
  time: OptionType;
  day: OptionType;
  subject: OptionType;
  teacher: string;
}

export type ClassContextType = {
  classes: ClassType[];
  setClasses: (schedules: ClassType[]) => void;
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
  fetchClasses: () => void;
  reset: () => void;
};

interface Props {
  children: ReactNode;
}

const ClassContext = createContext<ClassContextType>(undefined);

const ClassProvider = ({ children }: Props) => {
  const { setIsLoading } = useAppContext();
  const [classes, setClasses] = useState<ClassType[]>([]);
  const [search, setSearch] = useState('');
  const [pageCount, setPageCount] = useState(1);
  const [limit, setLimit] = useState(10);
  const [hasNextButton, setHasNextButton] = useState(true);

  let sortBy = useRef<string>('name');
  let orderBy = useRef<'asc' | 'desc'>('asc');

  const fetchClasses = async () => {
    setIsLoading(true);

    const sortParams = { sortBy: sortBy.current, orderBy: orderBy.current };
    const params = { search, page: pageCount, limit, ...sortParams };
    const { data } = await clientApi.get('classes', { params });

    setClasses(data.classes);
    setHasNextButton(data.count - pageCount * limit > 0);
    setIsLoading(false);
  };

  const reset = () => {
    setPageCount(1);
    fetchClasses();
  };

  const setSortByField = (key: string) => {
    if (!sortBy.current || sortBy.current !== key || orderBy.current === 'asc') {
      orderBy.current = 'desc';
    } else {
      orderBy.current = 'asc';
    }

    sortBy.current = key;
    fetchClasses();
  };

  const value = {
    classes,
    setClasses,
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
    fetchClasses,
    reset,
  };

  return <ClassContext.Provider value={value}>{children}</ClassContext.Provider>;
};

const useClassContext = () => useContext<ClassContextType>(ClassContext);

export { ClassProvider, useClassContext };
