import React from 'react';
import styled from '@emotion/styled';

import FormLabel from './FormLabel';

export type WithLabelProps = {
    label: string;
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
};

const Styled = {
    WithLabel: styled.div`
        & > * {
            width: 100%;
        }
    `,
    FormLabel: styled(FormLabel)`
        margin-bottom: 6px;
    `,
};

/**
 * Wraps an existing form element to add a label on the top
 */
export default function WithLabel({
    label,
    children,
    className,
    style,
}: WithLabelProps): React.ReactElement {
    return (
        <Styled.WithLabel className={className} style={style}>
            <Styled.FormLabel>{label}</Styled.FormLabel>
            {children}
        </Styled.WithLabel>
    );
}
