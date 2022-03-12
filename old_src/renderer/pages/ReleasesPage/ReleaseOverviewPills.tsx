import React from 'react';
import styled from '@emotion/styled';
import { FaCheck, FaShoppingCart, FaStop } from 'react-icons/fa';
import { rgba } from 'polished';

import { TaskStatusOverview } from '../../slices/tasks';
import { colors } from '../../components/_lib/colors';

const Styled = {
    Wrapper: styled.div`
        height: 22px;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        user-select: none;
        gap: 8px;
    `,
    Pill: styled.span`
        min-width: 18px;
        height: 26px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 800rem;
        padding: 1px 10px 1px 10px;

        &[data-variant='finished'] {
            background-color: ${rgba(colors['green-10'], 0.65)};
            & > svg {
                color: ${colors['green+20']};
            }
        }

        &[data-variant='running'] {
            background-color: ${rgba(colors['yellow-10'], 0.65)};
            & > svg {
                color: ${colors['yellow+20']};
            }
        }

        &[data-variant='stopped'] {
            background-color: ${rgba(colors['red-10'], 0.65)};
            & > svg {
                color: ${colors['red+20']};
            }
        }

        & > svg {
            margin-right: 6px;
        }
    `,
    Text: styled.strong`
        font-weight: 700;
        color: ${colors.foreground};
        text-shadow: 0px 0px 4px rgba(0, 0, 0, 0.4);
        font-size: 14px;
    `,
};

export type ReleaseOverviewPillsProps = {
    className?: string;
    style?: React.CSSProperties;
} & TaskStatusOverview;

/**
 * Simple presentation component that shows 3 pills (finished, running, & stopped)
 * indicating the task status overview for a release
 */
export default function ReleaseOverviewPills({
    className,
    style,
    finished,
    running,
    stopped,
}: ReleaseOverviewPillsProps): React.ReactElement {
    return (
        <Styled.Wrapper className={className} style={style}>
            <Styled.Pill data-variant="finished">
                <FaCheck /> <Styled.Text>{finished}</Styled.Text>
            </Styled.Pill>
            <Styled.Pill data-variant="running">
                <FaShoppingCart /> <Styled.Text>{running}</Styled.Text>
            </Styled.Pill>
            <Styled.Pill data-variant="stopped">
                <FaStop /> <Styled.Text>{stopped}</Styled.Text>
            </Styled.Pill>
        </Styled.Wrapper>
    );
}
