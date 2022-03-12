import React from 'react';
import styled from '@emotion/styled';

const Styled = {
    Bold: styled.strong`
        font-weight: 500;
    `,
};

export type BoldProps = {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
};

/**
 * Simple inline bold tag
 */
export default function Bold({ children, className, style }: BoldProps): React.ReactElement {
    return (
        <Styled.Bold className={className} style={style}>
            {children}
        </Styled.Bold>
    );
}
