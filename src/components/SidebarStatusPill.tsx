import React from 'react';
import styled from '@emotion/styled';
import { rgba } from 'polished';

import { colors } from './_lib/colors';

export type SidebarStatusPillProps = {
    numSuccess: number;
    numWarn: number;
    numDanger: number;
};

const Styled = styled.div`
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: max-content;
    user-select: none;
    margin-left: 8px;

    & > div {
        min-width: 18px;
        height: 22px;
        display: flex;
        justify-content: center;
        align-items: center;

        &[data-variant='success'] {
            background-color: ${rgba(colors['green-10'], 0.65)};
        }

        &[data-variant='warn'] {
            background-color: ${rgba(colors['yellow-10'], 0.65)};
        }

        &[data-variant='danger'] {
            background-color: ${rgba(colors['red-10'], 0.65)};
        }

        &:first-of-type {
            border-top-left-radius: 2000px;
            border-bottom-left-radius: 2000px;
            padding-left: 2px;
        }

        &:last-of-type {
            border-top-right-radius: 2000px;
            border-bottom-right-radius: 2000px;
            padding-right: 2px;
        }

        & > span {
            margin: 1px 6px 0px 6px;
            text-shadow: 0px 0px 4px rgba(0, 0, 0, 0.4);
            font-feature-settings: 'pnum' on, 'lnum' on;
            font-family: 'Roboto', sans-serif;
            font-style: normal;
            font-weight: bold;
            font-size: 14px;
            line-height: 19px;
            text-align: center;
            color: ${colors.foreground};
        }
    }
`;

function SidebarStatusPill({
    numSuccess,
    numWarn,
    numDanger,
}: SidebarStatusPillProps): React.ReactElement | null {
    // Skip displaying the component if all numbers are 0
    if (numSuccess === 0 && numWarn === 0 && numDanger === 0) return null;

    return (
        <Styled>
            <div data-variant="success">
                <span>{numSuccess}</span>
            </div>
            <div data-variant="warn">
                <span>{numWarn}</span>
            </div>
            <div data-variant="danger">
                <span>{numDanger}</span>
            </div>
        </Styled>
    );
}

export default SidebarStatusPill;
