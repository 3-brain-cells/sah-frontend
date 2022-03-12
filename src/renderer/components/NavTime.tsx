import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { cx } from '@emotion/css';

import { colors } from './_lib/colors';
import { durations, easings } from './_lib/motion';
import BaseText from './BaseText';

const Styled = {
    NavTime: styled.div`
        margin-left: 16px;
        height: 86px; /* Computed from padding + content */
        overflow: hidden;
        transition: height ${durations.medium} ${easings.ease};

        & .text {
            color: ${colors['foreground-light']};
            font-size: 15px;
            margin-bottom: -1px;
        }

        &.collapsed {
            height: 0;
        }
    `,
    Label: styled(BaseText)`
        color: ${colors['foreground-light']};
        font-size: 15px;
        margin-bottom: -1px;
    `,
    Time: styled.h4`
        letter-spacing: -0.01em;
        font-weight: 400;
        font-size: 16px;
        line-height: 23.44px;
        color: rgb(241, 245, 252);
        color: ${colors.foreground};
        margin-top: 0;
        margin-bottom: 0;
    `,
    InnerContent: styled.div`
        padding-top: 24px;
        padding-bottom: 16px;
    `,
};

export type NavTimeProps = {
    open: boolean;
    className?: string;
    style?: React.CSSProperties;
};

function formatTime(date: Date): string {
    let hr = date.getHours();
    const min = date.getMinutes();
    const sec = date.getSeconds();

    // Pad the minutes as appropriate
    let minStr: string;
    if (min < 10) {
        minStr = `0${min}`;
    } else {
        minStr = min.toString();
    }

    // Pad the seconds as appropriate
    let secStr: string;
    if (sec < 10) {
        secStr = `0${sec}`;
    } else {
        secStr = sec.toString();
    }

    // Determine the correct AM/PM term
    // and correct the hours as needed
    let amPm = 'AM';
    if (hr > 12) {
        hr -= 12;
        amPm = 'PM';
    }
    if (hr === 0) {
        hr = 12;
    }

    return `${hr}:${minStr}:${secStr} ${amPm}`;
}

function NavTime({ open, className, style }: NavTimeProps): React.ReactElement {
    const [currentTime, setCurrentTime] = useState(() => formatTime(new Date()));
    useEffect(() => {
        let interval: number | null = null;

        if (open) {
            // Periodically update the time every second
            setCurrentTime(formatTime(new Date()));
            interval = window.setInterval(() => setCurrentTime(formatTime(new Date())), 1000);
        }

        return () => {
            if (interval != null) {
                window.clearInterval(interval);
            }
        };
    }, [open]);

    return (
        <Styled.NavTime
            className={cx(open && 'open', !open && 'collapsed', className)}
            style={style}
        >
            <Styled.InnerContent>
                <Styled.Label>Current Time</Styled.Label>
                <Styled.Time>{currentTime}</Styled.Time>
            </Styled.InnerContent>
        </Styled.NavTime>
    );
}

export default NavTime;
