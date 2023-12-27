import React, { ButtonHTMLAttributes, ReactNode, useMemo } from 'react';
import { mdiLoading } from '@mdi/js';
import Icon from '@mdi/react';
import Link from 'next/link';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className: string;
  fontSize: string;
  paddingSize: string;
  radiusSize: string;
  color: string;
  loading: boolean;
  href: string;
}

const Button = ({
  className = '',
  children,
  fontSize,
  paddingSize,
  radiusSize,
  color,
  loading = false,
  disabled = false,
  href,
  ...otherProps
}: Partial<ButtonProps>) => {
  // Set default font size
  const buttonFont = useMemo(() => {
    switch (fontSize) {
      case 'xs':
        return 'text-xs';
      case 'md':
        return 'text-sm';
      case 'lg':
        return 'text-lg';
      default:
        return 'text-lg';
    }
  }, [fontSize]);

  // Set default padding size
  const buttonPadding = useMemo(() => {
    switch (paddingSize) {
      case 'sm':
        return 'px-4 py-2';
      case 'md':
        return 'px-4 py-[10px]';
      case '2xl':
        return 'px-6 py-3';
      case 'lg':
      default:
        return 'px-4 py-3';
    }
  }, [paddingSize]);

  // Set default button radius
  const buttonRadius = useMemo(() => {
    switch (radiusSize) {
      case 'md':
        return 'rounded-md';
      case 'lg':
        return 'rounded-lg';
      case 'xl':
        return 'rounded-xl';
      case '2xl':
        return 'rounded-2xl';
      default:
        return '';
    }
  }, [radiusSize]);

  const buttonColor = useMemo(() => {
    switch (color) {
      case 'primary':
        return 'bg-yellow-400 hover:bg-yellow-500';
      case 'secondary':
        return 'bg-lightBlue-600 hover:bg-lightBlue-700';
      case 'red':
        return 'bg-red-600 hover:bg-red-700';
      default:
        return 'bg-yellow-400 hover:bg-yellow-500';
    }
  }, [color]);

  // Button loading icon
  const loadingIcon = <Icon className='animate-spin mr-2' path={mdiLoading} size={0.8} />;

  //Set default button class styles
  const defaultClassStyles = `${buttonColor} text-white font-bold border border-gray-300`;

  // If href is passed, return a Link component
  // Else return a button component
  return (
    <>
      {href ? (
        <Link
          href={'/'}
          className={`${defaultClassStyles} ${buttonFont} ${buttonPadding} ${buttonRadius}`}
        >
          <div className='flex flex-row space-x-1 justify-center items-center'>
            {children}
          </div>
        </Link>
      ) : (
        <button
          type='button'
          disabled={loading || disabled}
          className={`${defaultClassStyles} ${buttonFont} ${buttonPadding} ${buttonRadius} ${className}`}
          {...otherProps}
        >
          <div className='flex flex-row space-x-1 justify-center drop-shadow-md items-center'>
            {loading && loadingIcon}
            {children}
          </div>
        </button>
      )}
    </>
  );
};

export default Button;
