import React from 'react';
import styled from '@emotion/styled';
import { FaCheck } from 'react-icons/all';
import { darken } from 'polished';

import { colors, shadows } from './_lib/colors';
import { Height, heightToBackground, contrastFloor, useHeight } from './_lib/height';

export type CheckboxProps = {
    disabled?: boolean;
    selected?: boolean;
    indeterminate?: boolean;
    onClick?: () => void;
    className?: string;
    style?: React.CSSProperties;
    label?: string;
};

const Styled = {
    Checkbox: styled.div`
        width: 20px;
        height: 20px;
        border: 1px solid ${colors.background30};
        color: ${colors.foreground};
        border-radius: 4px;
        box-shadow: none;
        position: relative;
        flex-shrink: 0;
        overflow: hidden;

        display: inline-flex;
        align-items: center;
        justify-content: center;
    `,
    CheckboxWrapper: styled.div<{
        disabled?: boolean;
        selected?: boolean;
        indeterminate?: boolean;
        height: Height;
    }>`
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 12px;

        & > .checkbox--main {
            background-color: ${(props) =>
                props.selected
                    ? colors.secondary
                    : // Ensure the contrast is at most 2 full layers,
                      // but default to height10
                      heightToBackground(contrastFloor(props.height, Height.h10, -20))};
            ${(props) => props.disabled && `opacity: 0.5;`}

            ${(props) => (props.indeterminate ? `border-color: ${colors.secondary}` : '')};
        }

        &:hover > .checkbox--main {
            ${(props) =>
                !props.disabled &&
                props.selected &&
                `
                    background-color: ${darken(0.1)(colors.secondary)};
                `}
            ${(props) =>
                !props.disabled &&
                (!props.selected || props.indeterminate) &&
                // Ensure the contrast is at most 3 full layers,
                // but default to height0
                `
                    background-color: ${heightToBackground(
                        contrastFloor(props.height, Height.h0, -30)
                    )};
                `}
        }
    `,
    IndeterminateInner: styled.div`
        width: 10px;
        height: 10px;
        background-color: ${colors.secondary};
        border-radius: 4px;
    `,
    Icon: styled(FaCheck)`
        position: absolute;
        filter: drop-shadow(${shadows.textContrastShadow});
    `,
    Label: styled.span`
        color: ${colors['foreground-light']};
        user-select: none;
        cursor: default;
    `,
};

/**
 * Renders an on/off checkbox, either bare or with a label to the right
 */
function Checkbox({
    disabled,
    selected,
    indeterminate,
    onClick,
    className,
    style,
    label,
}: CheckboxProps): React.ReactElement {
    // Get the current UI height
    const height = useHeight();

    return (
        <Styled.CheckboxWrapper
            className={className}
            style={style}
            disabled={disabled}
            selected={selected}
            onClick={!disabled ? onClick : undefined}
            indeterminate={indeterminate}
            height={height}
        >
            <Styled.Checkbox className="checkbox--main ">
                {selected && <Styled.Icon />}
                {indeterminate && <Styled.IndeterminateInner />}
            </Styled.Checkbox>
            {label != null && <Styled.Label>{label}</Styled.Label>}
        </Styled.CheckboxWrapper>
    );
}

export default Checkbox;
