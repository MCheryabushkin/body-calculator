import React from 'react';
import cn from 'classnames';

import CUSTOM_ICONS from './Icons';

import * as T from './icon.types';

function Icon(props: T.Props) {
  const { className, icon, type, ...rest } = props;
  const iconProps = {
    className: cn(className),
    role: 'img',
    ...rest,
  };
  // @ts-ignore
  const CustomIcon = icon || CUSTOM_ICONS[type];
  if (CustomIcon) return <CustomIcon {...iconProps} />;
}

Icon.defaultProps = {
  size: 'm' as T.IconSize,
};

export default Icon;
// @ts-ignore
export type IconTypes = T;
