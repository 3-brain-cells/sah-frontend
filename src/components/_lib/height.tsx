import React, { useContext } from 'react';

import { colors } from './colors';

/**
 * Opaque type used to store height data
 */
export type Height = number & { __tag__: void };

// Private: don't export
function makeHeight(rawHeight: number): Height {
    return rawHeight as Height;
}

/**
 * Valid height values
 */
export const Height = {
    h0: makeHeight(0),
    h5: makeHeight(5),
    h10: makeHeight(10),
    h15: makeHeight(15),
    h20: makeHeight(20),
    h25: makeHeight(25),
    h30: makeHeight(30),
    h35: makeHeight(35),
    h40: makeHeight(40),
    h45: makeHeight(45),
    h50: makeHeight(50),
    h55: makeHeight(55),
    h60: makeHeight(60),
};

export const MIN_HEIGHT = Height.h0;
export const MAX_HEIGHT = Height.h60;

// Private: don't export
const HeightContext = React.createContext<Height>(Height.h20);

/**
 * Raises a height value a full amount (+10)
 */
export function raiseFull(base: Height): Height {
    return Math.min(base + 10, MAX_HEIGHT) as Height;
}

/**
 * Raises a height value a half amount (+5)
 */
export function raiseHalf(base: Height): Height {
    return Math.min(base + 5, MAX_HEIGHT) as Height;
}

/**
 * Lowers a height value a full amount (-10)
 */
export function lowerFull(base: Height): Height {
    return Math.max(base + 10, MIN_HEIGHT) as Height;
}

/**
 * Lowers a height value a half amount (-5)
 */
export function lowerHalf(base: Height): Height {
    return Math.max(base + 5, MIN_HEIGHT) as Height;
}

/**
 * Gets the higher height between the two provided
 */
export function higher(a: Height, b: Height): Height {
    return Math.max(a, b) as Height;
}

/**
 * Gets the lower height between the two provided
 */
export function lower(a: Height, b: Height): Height {
    return Math.min(a, b) as Height;
}

/**
 * Attempts to ensure a minimum contrast between the current height and calculated height,
 * but starts at a minimum desired height floor.
 * For example, with floor = 40 and contrast = 10:
 *   - contrastFloor(20, ...) = 40
 *   - contrastFloor(30, ...) = 40
 *   - contrastFloor(40, ...) = 50
 *   - contrastFloor(45, ...) = 55
 * @param height - Current UI height;
 * @param floor - Height floor
 * @param contrast - Desired contrast, in height units
 */
export function contrastFloor(height: Height, floor: Height, contrast: number): Height {
    const contrastRounded = Math.round(contrast / 5) * 5;
    return higher((height + contrastRounded) as Height, floor);
}

export type HeightLayerProps = {
    height: Height;
    children: React.ReactNode;
};

/**
 * HeightLayer is used to specify the current height of a subtree
 */
export default function HeightLayer({ height, children }: HeightLayerProps): React.ReactElement {
    return <HeightContext.Provider value={height}>{children}</HeightContext.Provider>;
}

/**
 * Gets the current height
 */
export function useHeight(): Height {
    return useContext(HeightContext);
}

/**
 * Converts a height value to the corresponding background color
 */
export function heightToBackground(height: Height): string {
    return (
        {
            0: colors.background0,
            5: colors.background5,
            10: colors.background10,
            15: colors.background15,
            20: colors.background20,
            25: colors.background25,
            30: colors.background30,
            35: colors.background35,
            40: colors.background40,
            45: colors.background45,
            50: colors.background50,
            55: colors.background55,
            60: colors.background60,
        }[height as number] ?? '#FF00FF' // Bright magenta
    );
}
