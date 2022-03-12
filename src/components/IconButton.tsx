import React from 'react';
import styled from '@emotion/styled';
import { rgba } from 'polished';

import { AbstractButtonProps } from './_lib/button_types';
import { colors } from './_lib/colors';

export type IconButtonProps = AbstractButtonProps & {
    icon: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
};

const Styled = {
    IconButton: styled.button`
        width: 36px;
        height: 36px;
        display: flex;
        background: none;
        justify-content: center;
        align-items: center;
        border-radius: 100px;
        border-width: 0;
        cursor: pointer;

        & > svg {
            color: ${colors['foreground-extra-light']};
            width: 65%;
            height: 65%;
        }
        &:hover {
            background: ${rgba(colors.foreground, 0.05)};
            filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
            & > svg {
                color: ${colors['foreground-light']};
            }
        }
        &:active {
            background: ${colors['foreground-ghost']};
            & > svg {
                color: ${colors.foreground};
            }
        }
        &:focus {
            outline: none;
        }
    `,
};

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
    ({ onClick, icon, className, style }, ref) => (
        <Styled.IconButton ref={ref} className={className} style={style} onClick={onClick}>
            {icon}
        </Styled.IconButton>
    )
);
IconButton.displayName = 'IconButton';
export default IconButton;
