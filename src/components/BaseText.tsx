import React from 'react';
import styled from '@emotion/styled';

import { colors } from './_lib/colors';

const Styled = {
    BaseText: styled.p`
        margin-bottom: 0;
        margin-top: 0;
        font-weight: 400;
        font-size: 15px;
        line-height: 22px;
        color: ${colors['foreground-light']};

        &[data-variant='strong'] {
            color: ${colors['foreground-weak']};
        }

        &[data-variant='faded'] {
            color: ${colors['foreground-extra-light']};
        }
    `,
};

export type TextProps = {
    children: React.ReactNode;
    variant?: 'strong' | 'faded';
    className?: string;
    style?: React.CSSProperties;
};

/**
 * Standard foreground body text
 */
export default function BaseText({
    children,
    variant,
    className,
    style,
}: TextProps): React.ReactElement {
    return (
        <Styled.BaseText className={className} style={style} data-variant={variant}>
            {children}
        </Styled.BaseText>
    );
}
