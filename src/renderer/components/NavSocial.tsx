import React from 'react';
import { rgba } from 'polished';
import styled from '@emotion/styled';

import { colors } from './_lib/colors';
import { durations, easings } from './_lib/motion';

const Styled = {
    NavSocial: styled.a`
        width: 40px;
        height: 40px;
        display: flex;
        background: none;
        justify-content: center;
        align-items: center;
        border-radius: 8px;
        margin-right: 8px !important;
        margin-bottom: 12px !important;
        transition: background-color ${durations.short} ${easings.linear};

        & > svg {
            color: ${colors['foreground-extra-light']};
            width: 24px;
            height: 24px;
            transition: color ${durations.short} ${easings.linear};
        }

        &:hover {
            background: ${rgba(colors.foreground, 0.05)};
            filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
            & > svg {
                color: ${colors['foreground-light']};
            }
        }

        &:active {
            background: ${colors['foreground-ghost']};
            & > svg {
                color: ${colors.foreground};
            }
        }
    `,
};

export type NavSocialProps = {
    icon: React.ReactNode;
    link: string;
    className?: string;
    style?: React.CSSProperties;
};

function NavSocial({ icon, link, className, style }: NavSocialProps): React.ReactElement {
    return (
        <Styled.NavSocial href={link} className={className} style={style} target="_blank">
            {icon}
        </Styled.NavSocial>
    );
}

export default NavSocial;
