import React, { SyntheticEvent, useState } from 'react';
import styled from '@emotion/styled';
import { FaEllipsisV, FaPlus } from 'react-icons/all';

import IconButton from './IconButton';
import Button from './Button';
import { colors } from './_lib/colors';
import PageTitle from './PageTitle';
import Menu from './Menu';

export type SidebarProps = {
    title: string;
    children: React.ReactNode;
    menu: React.ReactNode;
    onAddClick: () => void;
    addText?: string;
    className?: string;
    style?: React.CSSProperties;
};

const Styled = {
    Container: styled.div`
        display: flex;
        flex-direction: column;
        align-items: stretch;
        position: relative;
        width: 300px;
        flex-shrink: 0;
    `,
    Header: styled.div`
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 12px;
        padding-top: 20px;
        padding-bottom: 12px;
        padding-left: 8px;
        padding-right: 12px;
        border-bottom: 2px solid ${colors.background15};
        position: relative;

        /* Create a pseudo-element for the drop shadow */
        &::after {
            content: '';
            position: absolute;
            z-index: -1;
            width: 100%;
            height: 100%;
            opacity: 0;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            border-radius: 5px;
            box-shadow: 0 12px 12px -12px rgba(0, 0, 0, 0.25);
            transition: opacity 0.3s ease-in-out;
        }

        &[data-container-scrolling] {
            &::after {
                opacity: 1;
            }
        }
    `,
    Title: styled(PageTitle)`
        display: inline;
        margin-right: 12px;
    `,
    ScrollContainer: styled.div`
        overflow-x: hidden;
        overflow-y: auto;
        flex-grow: 1;
        padding-bottom: 12px;

        &::-webkit-scrollbar {
            width: 0;
            background: transparent;
        }
    `,
};

function Sidebar({
    title,
    children,
    menu,
    onAddClick,
    addText,
    className,
    style,
}: SidebarProps): React.ReactElement {
    // Track whether the container has scrolled past a threshold
    // to display a small shadow on the bottom of the header
    const [containerScrolling, setContainerScrolling] = useState(false);
    const onContainerScroll = (e: SyntheticEvent) => {
        const target = e.target as HTMLDivElement;
        const currentPosition = target.scrollTop;
        if (currentPosition >= 20 && !containerScrolling) {
            setContainerScrolling(true);
        } else if (currentPosition < 20 && containerScrolling) {
            setContainerScrolling(false);
        }
    };

    return (
        <Styled.Container className={className} style={style}>
            <Styled.Header data-container-scrolling={containerScrolling ? true : undefined}>
                <Menu placement="bottom-start" contents={<>{menu}</>}>
                    {(ref) => <IconButton ref={ref} icon={<FaEllipsisV />} />}
                </Menu>
                <Styled.Title>{title}</Styled.Title>
                <Button onClick={onAddClick} text={addText ?? 'New'} icon={<FaPlus />} />
            </Styled.Header>
            <Styled.ScrollContainer onScroll={onContainerScroll}>{children}</Styled.ScrollContainer>
        </Styled.Container>
    );
}

export default Sidebar;
