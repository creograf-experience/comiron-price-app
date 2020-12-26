import styled from 'styled-components';
import { moderateScale, scale } from 'react-native-size-matters';

import { BodyText } from '../BodyText';

import { colors } from '../../constants';

export const TextInputErrorText = styled(BodyText)`
  font-size: ${moderateScale(14)};
  color: ${colors.textColorPrimary};
  margin-top:${scale(5)};
`;
