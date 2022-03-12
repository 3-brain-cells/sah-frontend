import React, { useEffect, useMemo, useState } from 'react';
import styled from '@emotion/styled';
import { DateTime } from 'luxon';
import { CSSTransition } from 'react-transition-group';

import { WaitingData } from '../../types/task';
import { colors } from '../../components/_lib/colors';

const barTransition = 'bar-anim';

const Styled = {
    BarOuter: styled.span`
        height: 8px;
        background: black;
        border-radius: 1000px;
        width: 100px;
        flex-grow: 1;
        flex-shrink: 1;
    `,
    Bar: styled.div<{ startFraction: number; duration: number }>`
        height: 100%;
        background: ${colors['orange+10']};
        transition: linear width ${(props) => props.duration}ms;
        border-radius: 1000px;
        --initial-width: ${(props) => props.startFraction * 100}%;
        width: var(--initial-width);

        &.${barTransition}-enter {
            width: var(--initial-width);
        }

        &.${barTransition}-enter-active {
            width: 100%;
        }
    `,
};

export type TaskStatusWaitingBarProps = WaitingData & {
    className?: string;
    style?: React.CSSProperties;
};

/**
 * Displays a small loading bar that had a start and end timestamp
 * and animates from 0 to 1, ending at 1 when the end timestamp is reached.
 * Should not be re-used after rendering with a start/end value.
 */
export default function TaskStatusWaitingBar({
    start,
    end,
    className,
    style,
}: TaskStatusWaitingBarProps): React.ReactElement | null {
    // Control the `in` property of the CSSTransition component
    const [animating, setAnimating] = useState(false);
    useEffect(() => {
        setAnimating(true);
    }, []);

    // Calculate the initial value/duration only once upon first render
    const [startFraction, durationRemaining] = useMemo(() => {
        try {
            const nowDate = DateTime.now();
            const startDate = DateTime.fromISO(start);
            const endDate = DateTime.fromISO(end);
            const durationMillis = endDate.diff(startDate).toMillis();
            const progressMillis = nowDate.diff(startDate).toMillis();
            const durationRemainingMillis = endDate.diff(nowDate).toMillis();

            if (durationMillis < 0) {
                // Bounds invalid; should not happen
                return [0, 0];
            }

            if (progressMillis < 0) {
                // Bounds have not started
                return [0, durationMillis];
            }

            if (durationRemainingMillis < 0) {
                // Bounds have already elapsed
                return [1, 0];
            }

            // Otherwise: bound>s are nominal w.r.t now
            const progressFraction = progressMillis / durationMillis;
            return [progressFraction, durationRemainingMillis];
        } catch (_err) {
            return [0, 0];
        }
    }, [start, end]);

    try {
        return (
            <Styled.BarOuter className={className} style={style}>
                <CSSTransition
                    in={animating}
                    timeout={durationRemaining}
                    classNames={barTransition}
                >
                    <Styled.Bar startFraction={startFraction} duration={durationRemaining} />
                </CSSTransition>
            </Styled.BarOuter>
        );
    } catch (_err) {
        return null;
    }
}
