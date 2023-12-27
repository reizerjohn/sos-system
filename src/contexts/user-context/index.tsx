'use client';

import { clientApi } from '@app/lib/api';
import { createContext, useContext, useState, ReactNode, useRef } from 'react';
import { useAppContext } from '../app-context';

export type UserContextType = {
  users: any[];
  setUsers: (users: any[]) => void;
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
  fetchUsers: () => void;
  reset: () => void;
};

interface Props {
  children: ReactNode;
}

const UserContext = createContext<UserContextType>(undefined);

const UserProvider = ({ children }: Props) => {
  const { setIsLoading } = useAppContext();
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [pageCount, setPageCount] = useState(1);
  const [limit, setLimit] = useState(10);
  const [hasNextButton, setHasNextButton] = useState(true);

  let sortBy = useRef<string>('name');
  let orderBy = useRef<'asc' | 'desc'>('asc');

  const fetchUsers = async () => {
    setIsLoading(true);

    const sortParams = { sortBy: sortBy.current, orderBy: orderBy.current };
    const params = { search, page: pageCount, limit, ...sortParams };
    const { data } = await clientApi.get('users', { params });

    setUsers(data.users);
    setHasNextButton(data.count - pageCount * limit > 0);
    setIsLoading(false);
  };

  const reset = () => {
    setPageCount(1);
    fetchUsers();
  };

  const setSortByField = (key: string) => {
    if (!sortBy.current || sortBy.current !== key || orderBy.current === 'asc') {
      orderBy.current = 'desc';
    } else {
      orderBy.current = 'asc';
    }

    sortBy.current = key;
    fetchUsers();
  };

  const value = {
    users,
    setUsers,
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
    fetchUsers,
    reset,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

const useUserContext = () => useContext<UserContextType>(UserContext);

export { UserProvider, useUserContext };
