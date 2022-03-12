import styled from '@emotion/styled';
import React from 'react';

import {
    AbstractButtonProps,
    ButtonIconColor,
    ButtonVariant,
    resolveButtonIconColor,
} from './_lib/button_types';
import { colors, shadows } from './_lib/colors';
import { Height, heightToBackground, contrastFloor, useHeight } from './_lib/height';

export type ButtonProps = AbstractButtonProps &
    Omit<StyledButtonProps, 'height'> & {
        className?: string;
        style?: React.CSSProperties;
        icon?: React.ReactNode;
        text: string;
    };

export type StyledButtonProps = {
    variant?: ButtonVariant;
    iconColor?: ButtonIconColor;
    height: Height;
};

function resolveButtonVariantBackground(variant: ButtonVariant, height: Height): string {
    return {
        primary: colors['primary-10'],
        secondary: colors['secondary-10'],
        // Ensure the contrast is at least 1 full layer,
        // but default to height40
        background: heightToBackground(contrastFloor(height, Height.h40, 10)),
        danger: colors['red-30'],
    }[variant];
}

function resolveButtonVariantHover(variant: ButtonVariant, height: Height): string {
    return {
        primary: colors['primary-5'],
        secondary: colors['secondary-5'],
        // Ensure the contrast is at least 1.5 full layers,
        // but default to height45
        background: heightToBackground(contrastFloor(height, Height.h45, 15)),
        danger: colors['red-30'],
    }[variant];
}

function resolveButtonVariantActive(variant: ButtonVariant, height: Height): string {
    return {
        primary: colors.primary,
        secondary: colors['secondary-10'],
        // Ensure the contrast is at least 1 full layer,
        // but default to height40
        background: heightToBackground(contrastFloor(height, Height.h40, 10)),
        danger: colors['red-10'],
    }[variant];
}

const StyledButton = styled.button<StyledButtonProps>`
    background-color: ${(props) =>
        resolveButtonVariantBackground(props.variant ?? 'primary', props.height)};
    padding: 4px 14px 4px 14px;
    border-radius: 8px;
    box-shadow: ${shadows.height10};
    border: none;
    color: ${colors.foreground};
    display: flex;
    align-items: center;
    justify-content: center;
    height: 32px;
    cursor: pointer;

    &:hover {
        background-color: ${(props) =>
            resolveButtonVariantHover(props.variant ?? 'primary', props.height)};
        box-shadow: ${shadows.height20};
        border: ${(props) =>
            props.variant === 'danger' ? `2px solid ${colors['red-10']}` : 'none'};
        padding: ${(props) =>
            props.variant === 'danger' ? '2px 12px 2px 12px' : '4px 14px 4px 14px'};
    }

    &:active {
        background-color: ${(props) =>
            resolveButtonVariantActive(props.variant ?? 'primary', props.height)};
        box-shadow: ${shadows.height30};
    }

    &:disabled {
        opacity: 0.4;
        pointer-events: none;
    }

    & > svg {
        width: 16px;
        height: 16px;
        margin-right: 6px;
        color: ${(props) => resolveButtonIconColor(props.iconColor ?? 'light')};
    }

    & > span {
        margin-top: 2px;
    }

    &:focus {
        outline: none;
    }

    & > .text {
        font-size: 14px;
        user-select: none;
    }
`;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, style, onClick, icon, iconColor, variant, text, disabled }, ref) => {
        // Get the current UI height
        const height = useHeight();

        return (
            <StyledButton
                className={className}
                style={style}
                ref={ref}
                height={height}
                onClick={onClick}
                variant={variant}
                disabled={disabled}
                iconColor={iconColor}
            >
                {icon}
                <span className="text">{text}</span>
            </StyledButton>
        );
    }
);
Button.displayName = 'Button';
export default Button;
