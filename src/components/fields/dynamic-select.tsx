import { clientApi } from '@app/lib/api';
import { useState, useEffect, forwardRef, Ref, useImperativeHandle } from 'react';
import { withAsyncPaginate } from 'react-select-async-paginate';
import ReactSelectComponent from 'react-select';
import { isEmpty } from 'lodash';

interface Props {
  fetchUrl: string;
  fetchParams?: Object;
  initialValue?: OptionType;
  isClearable?: boolean;
  placeholder?: string;
  borderRadius?: number;
  excludeData?: OptionType[];
  isDisabled?: boolean;
  className?: string;
  onChange?: (option: OptionType) => void;
}

export type OptionType = {
  value: number;
  label: string;
};

export type FieldDynamicSelectRef = {
  reset: () => void;
};

const SelectComponent = withAsyncPaginate(ReactSelectComponent);

const FieldDynamicSelect = (
  {
    fetchUrl,
    fetchParams,
    initialValue,
    isClearable,
    placeholder,
    borderRadius,
    excludeData,
    isDisabled,
    className,
    onChange,
  }: Props,
  ref: Ref<FieldDynamicSelectRef>
) => {
  const [value, setValue] = useState<OptionType | null>(initialValue || null);

  const customStyles = {
    control: (provided) => ({
      ...provided,
      borderRadius: borderRadius || 8,
      padding: '2px 3px',
      backgroundColor: 'white',
      with: '100%',
    }),
    singleValue: (p) => ({
      ...p,
      color: '#404968',
    }),
  };

  useEffect(() => {
    if (!isEmpty(value) && onChange) {
      onChange(value);
    }
  }, [value]);


  const reset = () => {
    setValue(null);
  };

  const updateValue = (option: OptionType) => {
    setValue(option);
  };
  
  useImperativeHandle(ref, () => ({
    reset,
    updateValue,
  }));

  const loadOptions = async (search, prevOptions, { page }) => {
    const excludeParams = !isEmpty(excludeData) ? { exclude: excludeData.map((e) => e.value).join('|') } : {};
    const params = { search, page, limit: 10, ...fetchParams, ...excludeParams };
    const { data } = await clientApi.get(fetchUrl, { params });

    return {
      options: data.options,
      hasMore: data.count - page * 10 > 0,
      additional: {
        page: page + 1,
      },
    };
  };

  return (
    <SelectComponent
      className={className}
      key={value?.value}
      styles={customStyles}
      isClearable={isClearable}
      value={value}
      loadOptions={loadOptions}
      onChange={setValue}
      additional={{ page: 1 }}
      placeholder={placeholder}
      isDisabled={isDisabled}
    />
  );
};

export default forwardRef(FieldDynamicSelect);
