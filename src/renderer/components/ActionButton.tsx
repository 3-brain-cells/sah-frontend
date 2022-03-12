import React from 'react';
import styled from '@emotion/styled';

import {
    AbstractButtonProps,
    ButtonIconColor,
    ButtonVariant,
    resolveButtonIconColor,
} from './_lib/button_types';
import { contrastFloor, Height, heightToBackground, useHeight } from './_lib/height';
import { colors, shadows } from './_lib/colors';

export type ActionButtonProps = AbstractButtonProps &
    Omit<StyledActionButtonProps, 'height'> & {
        icon: React.ReactNode;
    };

export type StyledActionButtonProps = {
    variant?: ButtonVariant;
    iconColor?: ButtonIconColor;
    height: Height;
    size?: 'normal' | 'small';
};

function resolveButtonVariantBackground(variant: ButtonVariant, height: Height): string {
    return {
        primary: colors['primary-10'],
        secondary: colors['secondary-10'],
        // Ensure the contrast is at least 1.5 full layers,
        // but default to height40
        background: heightToBackground(contrastFloor(height, Height.h40, 15)),
        danger: colors['red-30'],
    }[variant];
}

function resolveButtonVariantHover(variant: ButtonVariant, height: Height): string {
    return {
        primary: colors['primary-5'],
        secondary: colors['secondary-5'],
        // Ensure the contrast is at least 2 full layers,
        // but default to height45
        background: heightToBackground(contrastFloor(height, Height.h45, 20)),
        danger: colors['red-30'],
    }[variant];
}

function resolveButtonVariantActive(variant: ButtonVariant, height: Height): string {
    return {
        primary: colors.primary,
        secondary: colors['secondary-10'],
        // Ensure the contrast is at least 1.5 full layers,
        // but default to height40
        background: heightToBackground(contrastFloor(height, Height.h40, 15)),
        danger: colors['red-10'],
    }[variant];
}

const Styled = styled.button<StyledActionButtonProps>`
    background-color: ${(props) =>
        resolveButtonVariantBackground(props.variant ?? 'background', props.height)};
    --size: ${(props) => ((props.size ?? 'normal') === 'normal' ? '32px' : '28px')};
    --icon-size: ${(props) => ((props.size ?? 'normal') === 'normal' ? '20px' : '16px')};
    height: var(--size);
    width: var(--size);
    padding: 6px 6px 6px 6px;
    display: flex;
    border: none;
    justify-content: center;
    align-items: center;
    box-shadow: ${shadows.height10};
    border-radius: 4px;
    cursor: pointer;

    & > svg {
        color: ${(props) => resolveButtonIconColor(props.iconColor ?? 'primary')};
        width: var(--icon-size);
        height: var(--icon-size);
        filter: drop-shadow(0px 0px 4px rgba(0, 0, 0, 0.4));
    }

    &:hover {
        background-color: ${(props) =>
            resolveButtonVariantHover(props.variant ?? 'background', props.height)};
        box-shadow: ${shadows.height20};
        border: ${(props) =>
            props.variant === 'danger' ? `2px solid ${colors['red-10']}` : 'none'};
        padding: ${(props) => (props.variant === 'danger' ? '2px 2px 2px 2px' : '6px 6px 6px 6px')};
    }

    &:active {
        background-color: ${(props) =>
            resolveButtonVariantActive(props.variant ?? 'background', props.height)};
        box-shadow: ${shadows.height30};
    }

    &:disabled {
        opacity: 0.4;
        pointer-events: none;
    }

    &:focus {
        outline: none;
    }
`;

export default function ActionButton({
    onClick,
    disabled,
    icon,
    variant,
    iconColor,
    size,
}: ActionButtonProps): React.ReactElement {
    // Get the current UI height
    const height = useHeight();

    return (
        <Styled
            height={height}
            onClick={onClick}
            variant={variant}
            iconColor={iconColor}
            disabled={disabled}
            size={size}
        >
            {icon}
        </Styled>
    );
}
