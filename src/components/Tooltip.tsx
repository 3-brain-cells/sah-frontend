import React from 'react';
import ReactDOM from 'react-dom';
import styled from '@emotion/styled';
import { cx } from '@emotion/css';
import { usePopperTooltip, Config as ReactPopperTooltipConfig } from 'react-popper-tooltip';
import { animated, useTransition } from 'react-spring';

import { colors, shadows } from './_lib/colors';

const Styled = {
    // Base styles come from:
    // https://github.com/mohsinulhaq/react-popper-tooltip/blob/83b162e5fc6fd9c5ccd5e02b3ea780a6554a2ca4/src/styles.css
    Animated: styled(animated.div)<{ noPadding: boolean; tooltipBackground: string }>`
        --tooltipBackground: ${(props) => props.tooltipBackground};
        --tooltipBorder: transparent;
        --tooltipBorderRadius: 8px;
        --tooltipPadding: ${(props) => (props.noPadding ? '0' : '4px 8px')};

        background-color: var(--tooltipBackground);
        border-radius: var(--tooltipBorderRadius);
        border: 1px solid var(--tooltipBorder);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.18);
        color: #000;
        display: flex;
        flex-direction: column;
        padding: var(--tooltipPadding);
        transition: opacity 0.3s;
        z-index: 9999;
        box-shadow: ${shadows.height40};

        &[data-ignore-events='true'] {
            pointer-events: none;
        }

        .tooltip-arrow {
            height: 1rem;
            position: absolute;
            width: 1rem;
            pointer-events: none;
        }

        .tooltip-arrow::before {
            border-style: solid;
            content: '';
            display: block;
            height: 0;
            margin: auto;
            width: 0;
        }

        .tooltip-arrow::after {
            border-style: solid;
            content: '';
            display: block;
            height: 0;
            margin: auto;
            position: absolute;
            width: 0;
        }

        &[data-popper-placement*='bottom'] .tooltip-arrow {
            left: 0;
            margin-top: -0.4rem;
            top: 0;
        }

        &[data-popper-placement*='bottom'] .tooltip-arrow::before {
            border-color: transparent transparent var(--tooltipBorder) transparent;
            border-width: 0 0.5rem 0.4rem 0.5rem;
            position: absolute;
            top: -1px;
        }

        &[data-popper-placement*='bottom'] .tooltip-arrow::after {
            border-color: transparent transparent var(--tooltipBackground) transparent;
            border-width: 0 0.5rem 0.4rem 0.5rem;
        }

        &[data-popper-placement*='top'] .tooltip-arrow {
            bottom: 0;
            left: 0;
            margin-bottom: -1rem;
        }

        &[data-popper-placement*='top'] .tooltip-arrow::before {
            border-color: var(--tooltipBorder) transparent transparent transparent;
            border-width: 0.4rem 0.5rem 0 0.5rem;
            position: absolute;
            top: 1px;
        }

        &[data-popper-placement*='top'] .tooltip-arrow::after {
            border-color: var(--tooltipBackground) transparent transparent transparent;
            border-width: 0.4rem 0.5rem 0 0.5rem;
        }

        &[data-popper-placement*='right'] .tooltip-arrow {
            left: 0;
            margin-left: -0.7rem;
        }

        &[data-popper-placement*='right'] .tooltip-arrow::before {
            border-color: transparent var(--tooltipBorder) transparent transparent;
            border-width: 0.5rem 0.4rem 0.5rem 0;
        }

        &[data-popper-placement*='right'] .tooltip-arrow::after {
            border-color: transparent var(--tooltipBackground) transparent transparent;
            border-width: 0.5rem 0.4rem 0.5rem 0;
            left: 6px;
            top: 0;
        }

        &[data-popper-placement*='left'] .tooltip-arrow {
            margin-right: -0.7rem;
            right: 0;
        }

        &[data-popper-placement*='left'] .tooltip-arrow::before {
            border-color: transparent transparent transparent var(--tooltipBorder);
            border-width: 0.5rem 0 0.5rem 0.4em;
        }

        &[data-popper-placement*='left'] .tooltip-arrow::after {
            border-color: transparent transparent transparent var(--tooltipBackground);
            border-width: 0.5rem 0 0.5rem 0.4em;
            left: 3px;
            top: 0;
        }
    `,
};

export type TooltipProps = {
    tooltipContent: React.ReactNode;
    children: (ref: React.Dispatch<React.SetStateAction<HTMLElement | null>>) => React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    backgroundColor?: string;
    noPadding?: boolean;
    // Pass through options directly to the react-popper-tooltip Config
    closeOnTriggerHidden?: ReactPopperTooltipConfig['closeOnTriggerHidden'];
    trigger?: ReactPopperTooltipConfig['trigger'];
    followCursor?: ReactPopperTooltipConfig['followCursor'];
    closeOnOutsideClick?: ReactPopperTooltipConfig['closeOnOutsideClick'];
    interactive?: ReactPopperTooltipConfig['interactive'];
    placement?: ReactPopperTooltipConfig['placement'];
    offset?: ReactPopperTooltipConfig['offset'];
};

export type ControlledTooltipProps = TooltipProps & {
    visible: boolean;
    onVisibleChange: (next: boolean) => void;
};

/**
 * Renders the base of the <Tooltip /> component,
 * but allows users to explicitly **control** the visibility state.
 *
 */
export function ControlledTooltip({
    visible,
    onVisibleChange,
    children,
    tooltipContent,
    className,
    style,
    backgroundColor = colors.background0,
    noPadding = false,
    closeOnTriggerHidden = false,
    trigger = 'hover',
    followCursor = false,
    closeOnOutsideClick = true,
    interactive = false,
    placement = 'bottom',
    offset = [0, 6],
}: ControlledTooltipProps): React.ReactElement {
    const { getArrowProps, getTooltipProps, setTooltipRef, setTriggerRef } = usePopperTooltip({
        visible,
        onVisibleChange,
        closeOnTriggerHidden,
        trigger,
        followCursor,
        closeOnOutsideClick,
        // Always set interactive to false if triggered only by click;
        // otherwise, when hovering over the tooltip and then away,
        // the tooltip will be dismissed despite not being triggered by hovers.
        interactive: trigger === 'click' ? false : interactive,
        placement,
        offset,
    });

    // See https://react-spring.io/hooks/use-transition
    const transition = useTransition(visible, {
        from: {
            opacity: 0,
            scale: 0.7,
        },
        enter: {
            opacity: 1,
            scale: 1,
            config: { duration: 120 },
        },
        leave: {
            opacity: 0,
            scale: 1,
            config: { duration: 180 },
        },
    });

    return (
        <>
            {children(setTriggerRef)}
            {transition((transitionStyle, item) => {
                if (item) {
                    // We need to explicitly merge the transform
                    // so that the transform origin isn't at 0,0,0
                    const { style: tooltipStyle, ...tooltipProps } = getTooltipProps({
                        className: cx('tooltip-container', className),
                        style,
                    });

                    // Merge together the animated scale from react-spring
                    // with the transform from the tooltip
                    // (which ultimately just includes a translate)
                    const { scale: transitionScale, ...transitionStyleRest } = transitionStyle;
                    const { transform: tooltipTransform, ...tooltipStyleRest } = tooltipStyle;
                    const derivedTransform = transitionScale.to(
                        (scale) => `${tooltipTransform} scale(${scale})`
                    );
                    const mergedStyle = {
                        ...transitionStyleRest,
                        ...tooltipStyleRest,
                        transform: derivedTransform,
                    };

                    return ReactDOM.createPortal(
                        <Styled.Animated
                            {...tooltipProps}
                            noPadding={noPadding}
                            tooltipBackground={backgroundColor}
                            ref={setTooltipRef}
                            style={mergedStyle}
                            data-ignore-events={!interactive}
                        >
                            {tooltipContent}
                            <div {...getArrowProps({ className: 'tooltip-arrow' })} />
                        </Styled.Animated>,
                        document.body
                    );
                }

                return null;
            })}
        </>
    );
}

/**
 * Renders a simple animated tooltip around a trigger element
 * (passed in as the children render function) whenever it is hovered.
 * The content of the tooltip is customizable
 * and is provided in the `tooltipContent` prop.
 *
 * **Note:** Any styles applied to this component
 * are applied instead to the tooltip itself,
 * and will not be available in the local DOM
 * due to the tooltip being rendered in a portal
 */
export default function Tooltip(props: TooltipProps): React.ReactElement {
    const [controlledVisible, setControlledVisible] = React.useState(false);
    return (
        <ControlledTooltip
            {...props}
            backgroundColor={colors.background0}
            visible={controlledVisible}
            onVisibleChange={setControlledVisible}
        />
    );
}
