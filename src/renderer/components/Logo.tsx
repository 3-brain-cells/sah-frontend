import React from 'react';
import styled from '@emotion/styled';

import { colors } from './_lib/colors';

const Styled = {
    Logo: styled.h1`
        letter-spacing: -0.01em;
        font-weight: 600;
        font-size: 27px;
        line-height: 31.16px;
        color: ${colors.foreground};
        margin-top: 0;
        margin-bottom: 0;
    `,
};

export type LogoProps = {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
};

/**
 * "Kairos" logo text styling
 */
export default function Logo({ children, className, style }: LogoProps): React.ReactElement {
    return (
        <Styled.Logo className={className} style={style}>
            {children}
        </Styled.Logo>
    );
}
