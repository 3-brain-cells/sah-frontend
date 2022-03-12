import React from 'react';
import styled from '@emotion/styled';
import { Link, LinkProps } from 'react-router-dom';

import { colors } from './_lib/colors';

export const linkStyles = `
    font-style: normal;
    font-weight: normal;
    font-size: 15px;
    line-height: 22px;
    color: ${colors['secondary+10']};
    opacity: 0.8;
    text-decoration: none;
    cursor: pointer;

    &:hover {
        text-decoration: underline;
        opacity: 1;
    }
`;

const Styled = {
    InlineLink: styled(Link)`
        ${linkStyles}
    `,
};

export type InlineLinkProps = {
    children: React.ReactNode;
    to: LinkProps['to'];
    replace?: boolean;
    className?: string;
    style?: React.CSSProperties;
};

/**
 * Standard textual link that can be used to navigate to another in-app page
 */
export default function InlineLink({
    children,
    to,
    replace,
    className,
    style,
}: InlineLinkProps): React.ReactElement {
    return (
        <Styled.InlineLink to={to} replace={replace} className={className} style={style}>
            {children}
        </Styled.InlineLink>
    );
}
