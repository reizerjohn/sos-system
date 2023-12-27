'use client';

import { OptionType } from '@app/components/fields/dynamic-select';
import { clientApi } from '@app/lib/api';
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type AppContextType = {
  user: any;
  setUser: (user: User) => void;
  schoolYear: OptionType;
  setSchoolYear: (option: OptionType) => void;
  isLoading: boolean;
  setIsLoading: (flag: boolean) => void;
  fetchUserData: () => void;
  fetchActiveSchoolYear: () => Promise<void>;
};

interface Props {
  children: ReactNode;
}

const AppContext = createContext<AppContextType>(undefined);

const AppProvider = ({ children }: Props) => {
  const [user, setUser] = useState(undefined);
  const [schoolYear, setSchoolYear] = useState<OptionType>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchActiveSchoolYear = async () => {
    const { data } = await clientApi.get('options/school-year/active');
    setSchoolYear(data.option);
  };

  const fetchUserData = async () => {
    const { data } = await clientApi.get('auth/me');
    setUser(data);
  };

  useEffect(() => {
    fetchActiveSchoolYear();
  }, []);

  let value = {
    user,
    setUser,
    schoolYear,
    setSchoolYear,
    isLoading,
    setIsLoading,
    fetchUserData,
    fetchActiveSchoolYear,
  };

  return <AppContext.Provider value={value}>{schoolYear && children}</AppContext.Provider>;
};

const useAppContext = () => useContext<AppContextType>(AppContext);

export { AppProvider, useAppContext };
