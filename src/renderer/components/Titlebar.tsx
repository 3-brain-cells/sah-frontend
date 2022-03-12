import React, { useState, useLayoutEffect } from 'react';
import { remote } from 'electron';
import { rgba } from 'polished';
import styled from '@emotion/styled';
import {
    VscChromeClose,
    VscChromeMaximize,
    VscChromeMinimize,
    VscChromeRestore,
} from 'react-icons/vsc';

import { colors } from './_lib/colors';

export const TITLEBAR_HEIGHT = 28;

const Styled = {
    Titlebar: styled.div`
        height: ${TITLEBAR_HEIGHT}px;
        display: flex;
        background-color: ${colors.background10};
        flex-direction: row;
        align-items: stretch;
    `,
    DragRegion: styled.div`
        flex-grow: 1;
        -webkit-app-region: drag;
    `,
    WindowButton: styled.button`
        padding: 0;
        outline: none;
        border: none;
        background-color: transparent;
        color: ${rgba(colors.foreground, 0.65)};
        width: 40px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;

        &:hover {
            background-color: ${rgba(colors.foreground, 0.075)};
        }

        &:active {
            background-color: ${rgba(colors.foreground, 0.15)};
        }

        &:last-child {
            padding-right: 4px;
            width: 44px;
        }
    `,
};

export type TitlebarProps = {
    className?: string;
    style?: React.CSSProperties;
};

/**
 * Custom titlebar implemented from scratch loosely using tutorial at:
 * https://github.com/binaryfunt/electron-seamless-titlebar-tutorial
 */
export default function Titlebar({ style, className }: TitlebarProps): React.ReactElement {
    const [maximized, setMaximized] = useState(false);

    useLayoutEffect(() => {
        const win = remote.getCurrentWindow();

        function updateMaxRestoreButtons() {
            if (win.isMaximized()) {
                setMaximized(true);
            } else {
                setMaximized(false);
            }
        }

        updateMaxRestoreButtons();
        win.addListener('maximize', updateMaxRestoreButtons);
        win.addListener('unmaximize', updateMaxRestoreButtons);

        return () => {
            win.removeListener('maximize', updateMaxRestoreButtons);
            win.removeListener('unmaximize', updateMaxRestoreButtons);
        };
    }, []);

    const win = remote.getCurrentWindow();

    return (
        <Styled.Titlebar className={className} style={style}>
            <Styled.DragRegion />
            <Styled.WindowButton onClick={() => win.minimize()}>
                <VscChromeMinimize />
            </Styled.WindowButton>
            {!maximized && (
                <Styled.WindowButton onClick={() => win.maximize()}>
                    <VscChromeMaximize />
                </Styled.WindowButton>
            )}
            {maximized && (
                <Styled.WindowButton onClick={() => win.restore()}>
                    <VscChromeRestore />
                </Styled.WindowButton>
            )}
            <Styled.WindowButton onClick={() => win.close()}>
                <VscChromeClose />
            </Styled.WindowButton>
        </Styled.Titlebar>
    );
}
