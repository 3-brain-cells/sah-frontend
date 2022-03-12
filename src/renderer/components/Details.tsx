import React from 'react';
import styled from '@emotion/styled';

import { colors } from './_lib/colors';

const Styled = {
    Details: styled.p`
        margin-bottom: 0;
        margin-top: 0;
        font-weight: 400;
        font-size: 13px;
        line-height: 16px;
        color: ${colors['foreground-light']};
    `,
};

export type DetailsProps = {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
};

/**
 * Small, faded details text used when less visual emphasis is desired
 * compared to the standard <BaseText> component
 */
export default function Details({ children, className, style }: DetailsProps): React.ReactElement {
    return (
        <Styled.Details className={className} style={style}>
            {children}
        </Styled.Details>
    );
}
