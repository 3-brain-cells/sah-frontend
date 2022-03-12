import React from 'react';
import styled from '@emotion/styled';

import { colors } from './_lib/colors';

const Styled = {
    PageTitle: styled.h1`
        letter-spacing: -0.01em;
        font-weight: 500;
        font-size: 20px;
        line-height: 32.81px;
        color: ${colors.foreground};
        margin-top: 0;
        margin-bottom: 0;
    `,
};

export type PageTitleProps = {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
};

/**
 * <PageTitle> is used at the top of pages or navigation elements
 * to signify the main resource they are focused on
 */
export default function PageTitle({
    children,
    className,
    style,
}: PageTitleProps): React.ReactElement {
    return (
        <Styled.PageTitle className={className} style={style}>
            {children}
        </Styled.PageTitle>
    );
}
