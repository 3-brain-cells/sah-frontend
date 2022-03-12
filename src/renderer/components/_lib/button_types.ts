import React from 'react';

import { colors } from './colors';

export type AbstractButtonProps = {
    onClick?: (event: React.MouseEvent) => void;
    disabled?: boolean;
};

export type ButtonIconColor =
    | 'light'
    | 'primary'
    | 'success'
    | 'warn'
    | 'danger'
    | 'blue'
    | 'green'
    | 'red';

export type ButtonVariant = 'primary' | 'secondary' | 'background' | 'danger';

/**
 * Utility function that resolves the CSS color string
 * from a ButtonIconColor variant
 */
export function resolveButtonIconColor(color: ButtonIconColor): string {
    return {
        light: colors.foreground,
        primary: colors['blue+10'],
        success: colors['green+10'],
        warn: colors['yellow+10'],
        danger: colors['red+10'],
        blue: colors['blue+10'],
        green: colors['green+10'],
        red: colors['red+10'],
    }[color];
}
