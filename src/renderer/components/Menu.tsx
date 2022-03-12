import React, { useMemo } from 'react';
import styled from '@emotion/styled';

import { ControlledTooltip, ControlledTooltipProps } from './Tooltip';
import { contrastFloor, Height, heightToBackground, useHeight } from './_lib/height';

const Styled = {
    Layout: styled.div`
        padding: 4px 0;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        justify-content: flex-start;
    `,
};

export type MenuContextValue = {
    onDismiss: () => void;
};

export const MenuContext = React.createContext<MenuContextValue>({ onDismiss: () => {} });

export type MenuProps = {
    children: ControlledTooltipProps['children'];
    contents: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    placement?: ControlledTooltipProps['placement'];
    offset?: ControlledTooltipProps['offset'];
};

/**
 * Popover-style menu that wraps around a clickable trigger element
 * (passed in as the children render function).
 * Designed to contain multiple <MenuItem> components
 * within its "contents" prop
 */
export default function Menu({
    children,
    contents,
    className,
    style,
    placement,
    offset,
}: MenuProps): React.ReactElement {
    const [controlledVisible, setControlledVisible] = React.useState(false);
    const contextValue = useMemo<MenuContextValue>(
        () => ({ onDismiss: () => setControlledVisible(false) }),
        []
    );

    // Obtain the current height value
    // with which to derive the menu background color
    const height = useHeight();
    const backgroundColor = contrastFloor(height, Height.h40, 20);

    return (
        <ControlledTooltip
            trigger="click"
            interactive
            className={className}
            style={style}
            noPadding
            tooltipContent={
                <MenuContext.Provider value={contextValue}>
                    <Styled.Layout>{contents}</Styled.Layout>
                </MenuContext.Provider>
            }
            placement={placement}
            offset={offset}
            backgroundColor={heightToBackground(backgroundColor)}
            visible={controlledVisible}
            onVisibleChange={setControlledVisible}
        >
            {children}
        </ControlledTooltip>
    );
}
