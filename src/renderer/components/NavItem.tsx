import { cx } from '@emotion/css';
import styled from '@emotion/styled';
import { mix } from 'polished';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { colors } from './_lib/colors';
import { topLevelNavExpandedWidth } from './_lib/layout';
import { durations, easings } from './_lib/motion';

const Styled = {
    NavItem: styled.button`
        height: 40px;
        display: flex;
        overflow: hidden;
        align-items: center;
        margin-top: 8px;
        cursor: pointer;
        background-color: transparent;
        outline: none;
        border: none;
        margin-right: 12px;
        transition: background-color ${durations.short} ${easings.linear},
            width ${durations.medium} ${easings.ease},
            margin-left ${durations.medium} ${easings.ease};

        & > p {
            letter-spacing: -0.01em;
            font-size: 17px;
            line-height: 32.81px;
            color: ${colors['foreground-extra-light']};
            margin-top: 0;
            margin-bottom: 0;
            overflow: hidden;
            transition: color ${durations.short} ${easings.linear};
        }

        & > svg {
            fill: currentColor;
            width: 1em;
            height: 1em;
            display: inline-block;
            font-size: 1.5rem;
            flex-shrink: 0;
            user-select: none;

            color: ${colors['foreground-ghost']} !important;
            margin-right: 16px;
            transition: color ${durations.short} ${easings.linear},
                margin-left ${durations.medium} ${easings.ease};
        }

        &:hover {
            background-color: ${mix(0.75, colors.background20, colors.background30)};

            & > p {
                color: ${colors['foreground-weak']} !important;
            }

            & > svg {
                color: ${colors['foreground-extra-light']} !important;
            }
        }

        &.active {
            background-color: ${mix(0.25, colors.background40, colors.background30)};

            & > p {
                color: ${colors.foreground} !important;
            }

            & > svg {
                color: ${colors['foreground-weak']} !important;
            }
        }

        &.open {
            margin-left: 0;
            border-radius: 0px 100px 100px 0px;
            width: calc(${topLevelNavExpandedWidth} - 12px);

            & > svg {
                margin-left: 12px;
            }
        }

        &.collapsed {
            margin-left: 8px;
            border-radius: 50px;
            width: 40px;

            & > svg {
                margin-left: 2px;
            }
        }
    `,
};

export type NavItemProps = {
    onClick: () => void;
    label: string;
    open: boolean;
    selected: boolean;
    icon: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
};

/**
 * Renders a single top-level navigation button
 * that can be clicked to make itself active.
 * Each button contains an icon and some text
 * that is displayed when the NavItem is expanded.
 */
function NavItem({
    onClick,
    label,
    open,
    selected,
    icon,
    className,
    style,
}: RouteComponentProps & NavItemProps): React.ReactElement {
    return (
        <Styled.NavItem
            onClick={onClick}
            className={cx(open && 'open', !open && 'collapsed', selected && 'active', className)}
            style={style}
        >
            {icon}
            <p>{label}</p>
        </Styled.NavItem>
    );
}

export default withRouter(NavItem);
