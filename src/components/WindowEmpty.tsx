import React from 'react';
import styled from '@emotion/styled';

import PageTitle from './PageTitle';

const Styled = {
    Container: styled.div`
        padding-top: 20px;
        padding-left: 24px;
    `,
};

export type WindowEmptyProps = {
    className?: string;
    text: string;
    style?: React.CSSProperties;
};

/**
 * Creates an "empty" message and icon for when there is nothing in the Window
 */
function WindowEmpty({ className, text, style }: WindowEmptyProps): React.ReactElement {
    return (
        <Styled.Container style={style} className={className}>
            <PageTitle>{text}</PageTitle>
        </Styled.Container>
    );
}

export default WindowEmpty;
