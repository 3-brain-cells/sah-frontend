import React from 'react';
import styled from '@emotion/styled';
import { rgba } from 'polished';
import { cx } from '@emotion/css';
import { FaTrash } from 'react-icons/all';

import IconButton from './IconButton';
import { colors } from './_lib/colors';

const Styled = {
    SidebarItem: styled.div`
        display: flex;
        background: none;
        align-items: center;
        outline: none;
        border: none;
        border-radius: 0px 100px 100px 0px;
        margin-right: 12px;
        padding-top: 2px;
        padding-bottom: 2px;
        padding-right: 7px;
        cursor: pointer;

        & > button {
            pointer-events: none;
            visibility: hidden;
            margin-right: 8px;
            margin-left: 1px;
            flex-shrink: 0;
            cursor: pointer;
        }

        &:hover {
            & > button {
                pointer-events: initial;
                visibility: visible;
            }
        }

        & > .text {
            display: block;
            margin-right: auto;
            text-align: left;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            color: ${colors['foreground-extra-light']};
            user-select: none;
        }

        &:hover {
            background-color: ${rgba(colors.secondary, 0.1)};
            & > .text {
                color: ${colors['foreground-light']};
            }
        }

        &.active,
        &:active {
            background-color: ${rgba(colors.secondary, 0.2)};
            & > .text {
                color: ${colors.foreground};
            }
        }
    `,
};

export type SidebarItemsProps = {
    onRemove?: (event: React.MouseEvent) => void; // Bubble up MouseEvent to detect if shift key was held
    onClick: () => void;
    selected: boolean;
    label: string;
    pill?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
};

function SidebarItem({
    onRemove,
    onClick,
    selected,
    label,
    pill,
    className,
    style,
}: SidebarItemsProps): React.ReactElement {
    function removeEvent(event?: React.MouseEvent) {
        if (event == null) {
            return;
        }
        if (onRemove) onRemove(event);
        event.stopPropagation();
    }

    return (
        <Styled.SidebarItem
            onClick={onClick}
            className={cx(selected && 'active', className)}
            style={style}
        >
            {onRemove && (
                <IconButton
                    style={{ height: '32px', width: '32px' }}
                    onClick={removeEvent}
                    icon={<FaTrash />}
                />
            )}
            <span className="text">{label}</span>
            {pill}
        </Styled.SidebarItem>
    );
}

export default SidebarItem;
