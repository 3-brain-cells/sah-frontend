import React from 'react';
import styled from '@emotion/styled';

import { colors } from './_lib/colors';
import { durations, easings } from './_lib/motion';
import Logo from './Logo';
import BaseText from './BaseText';
import LogoIcon from './_assets/Logo.svg';

const Styled = {
    KairosLogo: styled.div`
        display: flex;
        margin-left: 16px;
        margin-top: 9px;
    `,
    IconWrapper: styled.div`
        height: 62px;
        transform: scale(1) translateX(0) translateY(0);
        transition: transform ${durations.medium} ${easings.linear};
        -webkit-user-drag: none;
        user-select: none;

        svg {
            height: 100%;
            width: auto;
        }

        &[data-collapsed] {
            transform: scale(0.7) translateX(-10px) translateY(-10px);
        }
    `,
    TextContainer: styled.div`
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        padding-left: 14px;
        overflow: hidden;
    `,
    LogoText: styled(Logo)`
        margin-bottom: -2px;
    `,
    Version: styled(BaseText)`
        font-size: 13px;
        line-height: 16px;
        padding-left: 2px;
        color: ${colors['foreground-light']};
    `,
};

export type KairosLogoProps = {
    open: boolean;
    className?: string;
    style?: React.CSSProperties;
};

/**
 * Combined Kairos logo,icon, and version information
 */
export default function KairosLogo({
    open,
    className,
    style,
}: KairosLogoProps): React.ReactElement {
    return (
        <Styled.KairosLogo className={className} style={style}>
            <Styled.IconWrapper data-collapsed={!open ? true : undefined}>
                <LogoIcon />
            </Styled.IconWrapper>
            <Styled.TextContainer>
                <Styled.LogoText>Kairos</Styled.LogoText>
                <Styled.Version>Version {process.env.VERSION_NUMBER}</Styled.Version>
            </Styled.TextContainer>
        </Styled.KairosLogo>
    );
}
