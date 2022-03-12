import React, { useContext } from 'react';
import styled from '@emotion/styled';
import { rgba } from 'polished';

import { MenuContext } from './Menu';
import { colors } from './_lib/colors';
import BaseText from './BaseText';

const Styled = {
    MenuItem: styled.button`
        background: none;
        outline: none;
        border: none;
        padding: 4px 8px;
        cursor: pointer;
        text-align: left;

        &:hover {
            background-color: ${rgba(colors.secondary, 0.1)};
            & .menu-label {
                color: ${colors['foreground-light']};
            }
        }

        &.active,
        &:active {
            background-color: ${rgba(colors.secondary, 0.2)};
            & .menu-label {
                color: ${colors.foreground};
            }
        }
    `,
};

export type MenuItemProps = {
    children: React.ReactNode;
    onClick: () => void;
    className?: string;
    style?: React.CSSProperties;
};

/**
 * Single menu button, designed to be used as the root-level children
 * of the <Menu> component's `contents` field.
 */
export default function MenuItem({
    children,
    onClick,
    className,
    style,
}: MenuItemProps): React.ReactElement {
    const { onDismiss } = useContext(MenuContext);
    return (
        <Styled.MenuItem
            className={className}
            style={style}
            onClick={() => {
                onDismiss();
                onClick();
            }}
        >
            <BaseText className="menu-label">{children}</BaseText>
        </Styled.MenuItem>
    );
}
