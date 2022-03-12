import React from 'react';
import styled from '@emotion/styled';

import { colors } from './_lib/colors';

export type SidebarTeaProps = {
    number: number;
};

const Styled = styled.div`
    background: ${colors['secondary-10']};
    border-radius: 1000px;
    padding: 6px;
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: max-content;

    & > span {
        margin: 1px 1px 0px 1px;
        text-shadow: 0px 0px 4px rgba(0, 0, 0, 0.4);
        font-feature-settings: 'pnum' on, 'lnum' on;
        font-family: 'Roboto', sans-serif;
        font-style: normal;
        font-weight: bold;
        font-size: 13px;
        line-height: 17px;
        text-align: center;
        color: ${colors.foreground};
    }
`;

function SidebarTea({ number }: SidebarTeaProps): React.ReactElement {
    return (
        <Styled>
            <span>{number}</span>
        </Styled>
    );
}

export default SidebarTea;
