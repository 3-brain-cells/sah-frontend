import React from 'react';
import styled from '@emotion/styled';

import { colors } from './_lib/colors';

const Styled = {
    Heading: styled.h2`
        letter-spacing: -0.01em;
        font-weight: 400;
        font-size: 18px;
        line-height: 26px;
        color: ${colors.foreground};
        margin-top: 0;
        margin-bottom: 0;
    `,
};

export type HeadingProps = {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
};

/**
 * Section heading component used in locations other than at the top of the page
 */
export default function Heading({ children, className, style }: HeadingProps): React.ReactElement {
    return (
        <Styled.Heading className={className} style={style}>
            {children}
        </Styled.Heading>
    );
}
