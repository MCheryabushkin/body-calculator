import { ReactChild } from 'react';
import { IconName } from '@fortawesome/fontawesome-svg-core';

import CUSTOM_ICONS from './Icons';

export type IconSize = 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl';

export type IconType = keyof typeof CUSTOM_ICONS | IconName;

export type Props = {
  className?: string;
  icon?: ReactChild;
  type?: IconType;
  size: IconSize;
};
