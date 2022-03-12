import React from 'react';
import styled from '@emotion/styled';

import { colors } from './_lib/colors';

const Styled = {
    FormLabel: styled.div`
        color: ${colors['foreground-light']};
        user-select: none;
        font-size: 15px;
    `,
};

export type FormLabelProps = {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
};

/**
 * Text style for a small form label
 */
export default function FormLabel({
    children,
    className,
    style,
}: FormLabelProps): React.ReactElement {
    return (
        <Styled.FormLabel className={className} style={style}>
            {children}
        </Styled.FormLabel>
    );
}
