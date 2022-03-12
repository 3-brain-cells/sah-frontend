import React from 'react';
import styled from '@emotion/styled';

const Styled = {
    Italics: styled.em`
        font-style: italic;
    `,
};

export type ItalicsProps = {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
};

/**
 * Simple inline italics tag
 */
export default function Italics({ children, className, style }: ItalicsProps): React.ReactElement {
    return (
        <Styled.Italics className={className} style={style}>
            {children}
        </Styled.Italics>
    );
}
