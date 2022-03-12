import React, { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { FaCheck, FaPencilAlt, FaTimes } from 'react-icons/fa';

import ActionButton from './ActionButton';
import { colors } from './_lib/colors';

const Styled = {
    Wrapper: styled.div``,
    Layout: styled.div`
        display: none;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        gap: 12px;
        height: 32px;

        &[data-shown] {
            display: flex;
        }
    `,
    Editable: styled.div`
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        --indicator-color: ${colors['foreground-extra-light']};
        --underline-color: transparent;
        gap: 16px;
        cursor: text;
        width: 100%;

        &:hover {
            --indicator-color: ${colors['foreground-light']};
            --underline-color: ${colors['foreground-extra-light']};
        }
    `,
    Title: styled.h1`
        font-weight: 500;
        font-size: 22px;
        line-height: 25px;
        letter-spacing: -0.01em;
        border-bottom: 2px solid var(--underline-color);
        color: ${colors.foreground};
        transition: border-bottom-color 0.1s linear;
        margin-top: 0;
        margin-bottom: 0;

        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    `,
    EditBoxWrapper: styled.div`
        display: inline-block;
        position: relative;
        width: fit-content;
        min-width: 36px;
        height: 27.5px;

        font-weight: 500;
        font-size: 22px;
        line-height: 25px;
        letter-spacing: -0.01em;
        color: ${colors.foreground};
        border-bottom: 2px solid var(--underline-color);

        &::after {
            content: attr(data-value) ' ';
            visibility: hidden;
            white-space: pre;
        }
    `,
    EditBox: styled.input`
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        font: inherit;
        padding: inherit;
        margin: 0;
        appearance: none;
        border: none;
        letter-spacing: inherit;
        line-height: inherit;
        color: inherit;

        background-color: transparent;
        outline: none;
    `,
    Indicator: styled(FaPencilAlt)`
        font-size: 18px;
        color: var(--indicator-color);
        flex-shrink: 0;
        transition: color 0.1s linear;
    `,
};

export type EditableTitleProps = {
    value: string;
    onCommit: (next: string) => void;
    className?: string;
    style?: React.CSSProperties;
};

/**
 * Simple presentation component that shows a title that can be edited
 * by hovering+clicking on it and typing in to the in-line text field.
 */
export default function EditableTitle({
    value,
    onCommit,
    className,
    style,
}: EditableTitleProps): React.ReactElement {
    const [editValue, setEditValue] = useState<null | string>(null);
    const editBoxRef = useRef<HTMLInputElement>(null);

    const [focusNextRender, setFocusNextRender] = useState(false);
    useEffect(() => {
        if (focusNextRender) {
            editBoxRef.current?.focus();
            editBoxRef.current?.select();
            setFocusNextRender(false);
        }
    }, [focusNextRender]);

    const onStartEdit = () => {
        setEditValue(value);
        setFocusNextRender(true);
    };

    const onAccept = () => {
        if (editValue !== value) {
            onCommit(editValue ?? '');
        }
        setEditValue(null);
    };

    const onReject = () => {
        setEditValue(null);
    };

    const onEditBoxChange = (e: ChangeEvent<HTMLInputElement>) => setEditValue(e.target.value);

    const onEditBoxKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            onAccept();
        } else if (e.key === 'Escape') {
            onReject();
        }
    };

    // Reject the edit once the focus escapes the edit layout
    const editLayoutRef = useRef<HTMLDivElement | null>(null);
    const onEditLayoutBlur = () => {
        // Use setImmediate since the focus isn't updated
        // until after the onBlur event
        window.setImmediate(() => {
            if (!editLayoutRef.current?.matches(':focus-within')) {
                onReject();
            }
        });
    };

    return (
        <Styled.Wrapper className={className} style={style}>
            <Styled.Layout
                data-shown={editValue === null ? 'true' : undefined}
                onClick={onStartEdit}
            >
                <Styled.Editable>
                    <Styled.Title>{value}</Styled.Title>
                    <Styled.Indicator />
                </Styled.Editable>
            </Styled.Layout>
            <Styled.Layout
                data-shown={editValue !== null ? 'true' : undefined}
                onBlur={onEditLayoutBlur}
                ref={editLayoutRef}
                style={
                    {
                        '--underline-color': colors['foreground-light'],
                    } as React.CSSProperties
                }
            >
                <Styled.EditBoxWrapper data-value={editValue ?? ''}>
                    <Styled.EditBox
                        ref={editBoxRef}
                        value={editValue ?? ''}
                        onChange={onEditBoxChange}
                        onKeyDown={onEditBoxKeyDown}
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"
                    />
                </Styled.EditBoxWrapper>
                <ActionButton icon={<FaCheck />} iconColor="success" onClick={onAccept} />
                <ActionButton icon={<FaTimes />} iconColor="danger" onClick={onReject} />
            </Styled.Layout>
        </Styled.Wrapper>
    );
}
