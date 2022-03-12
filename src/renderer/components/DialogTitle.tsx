import React from 'react';
import styled from '@emotion/styled';

import { colors } from './_lib/colors';

const Styled = {
    DialogTitle: styled.h1`
        color: ${colors.foreground};
        margin-top: 0;
        margin-bottom: 0;
        letter-spacing: -0.01em;
        font-weight: 500;
        font-size: 25px;
        line-height: 42.19px;
    `,
};

export type DialogTitleProps = {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
};

/**
 * Title at the top of a dialog component
 */
export default function DialogTitle({
    children,
    className,
    style,
}: DialogTitleProps): React.ReactElement {
    return (
        <Styled.DialogTitle className={className} style={style}>
            {children}
        </Styled.DialogTitle>
    );
}
