import React from 'react';
import styled from '@emotion/styled';

import LinkButton from './LinkButton';
import BaseText from './BaseText';
import PageTitle from './PageTitle';
import EmptyIcon from './_assets/Empty.svg';

const Styled = {
    Container: styled.div`
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 100px;
    `,
};

export type EmptyProps = {
    className?: string;
    text: string;
    linkText: string;
    onClick: () => void;
    style?: React.CSSProperties;
};

/**
 * Creates an "empty" message and icon for when there is nothing in a container
 */
function Empty({ className, text, linkText, onClick, style }: EmptyProps): React.ReactElement {
    return (
        <Styled.Container className={className} style={style}>
            <EmptyIcon />
            <PageTitle style={{ marginTop: 12 }}>{text}</PageTitle>
            <BaseText variant="faded">
                To get started, <LinkButton onClick={onClick}> {linkText}</LinkButton>
            </BaseText>
        </Styled.Container>
    );
}

export default Empty;
