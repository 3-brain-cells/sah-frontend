import React, { useCallback, useMemo } from 'react';
import styled from '@emotion/styled';
import { useDispatch } from 'react-redux';
import { Switch, Route, useRouteMatch } from 'react-router-dom';

import { useSelector } from '../../store';
import ProfileGroupHeader from './ProfileGroupHeader';
import { addProfiles, updateProfileGroup } from '../../slices/profiles';
import HeightLayer, { Height } from '../../components/_lib/height';
import { colors, shadows } from '../../components/_lib/colors';
import ProfileGroupGrid from './ProfileGroupGrid';
import ProfileDrawer from './ProfileDrawer';

const Styled = {
    PageContent: styled.div`
        overflow: hidden;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        padding-top: 20px;
        padding-left: 24px;
        gap: 16px;
    `,
    Wrapper: styled.div`
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        width: 100%;
    `,
    Header: styled(ProfileGroupHeader)`
        padding-right: 28px;
    `,
    Grid: styled(ProfileGroupGrid)`
        flex-grow: 1;
        background-color: ${colors.background20};
        border-top-left-radius: 16px;
        position: relative;

        &::after {
            z-index: 1;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            content: ' ';
            box-shadow: ${shadows.topLeftInner};
            border-top-left-radius: 16px;
            pointer-events: none;
        }
    `,
};

export type ProfileGroupContentProps = {
    id: string;
    className?: string;
    style?: React.CSSProperties;
};

/**
 * Displays all of the content in the right-most pane of the profiles page,
 * handling showing content for the single actively selected profile group
 */
export default function ProfileGroupContent({
    id,
    style,
    className,
}: ProfileGroupContentProps): React.ReactElement {
    // Subscribe to the store to get the current release
    const profileGroup = useSelector((state) => state.profiles.groups[id]);

    const { path } = useRouteMatch();

    // Obtain the store's dispatch function
    const dispatch = useDispatch();

    const onChangeName = useCallback(
        (next: string) => dispatch(updateProfileGroup({ id, partial: { name: next.trim() } })),
        [dispatch, id]
    );

    const profileCount = useMemo(
        () => Object.keys(profileGroup.profiles).length,
        [profileGroup.profiles]
    );

    const profiles = useMemo(() => Object.values(profileGroup.profiles), [profileGroup.profiles]);

    return (
        <Styled.Wrapper>
            <Styled.PageContent className={className} style={style}>
                <Styled.Header
                    name={profileGroup.name}
                    profileCount={profileCount}
                    onChangeName={onChangeName}
                />
                <HeightLayer height={Height.h20}>
                    <Styled.Grid
                        profiles={profiles}
                        profileGroupId={id}
                        onCreateNewProfile={() => {
                            // TODO create real implementation
                            dispatch(
                                addProfiles({
                                    profileGroupId: id,
                                    profiles: [
                                        {
                                            name: 'Sample profile',
                                            shipping: {
                                                name: 'Joe Buckman',
                                                one: '123 Henson Lane',
                                                two: '',
                                                zip: '30132',
                                                city: 'Rome',
                                                state: 'GA',
                                                country: 'United States',
                                                phone: '12953921123',
                                                email: 'jbuckman@gmail.com',
                                                sameAsBilling: false,
                                            },
                                            billing: {
                                                name: '',
                                                one: '',
                                                two: '',
                                                zip: '',
                                                city: '',
                                                state: '',
                                                country: '',
                                                phone: '',
                                                email: '',
                                            },
                                            card: {
                                                cardName: "Mom's card",
                                                number: '4932103212931044',
                                                month: '09',
                                                year: '2031',
                                                cvv: '239',
                                            },
                                        },
                                    ],
                                })
                            );
                        }}
                    />
                </HeightLayer>
            </Styled.PageContent>
            <Switch>
                <Route exact path={path} />
                <Route
                    path={`${path}/profiles/:profileId`}
                    render={({ match }) => (
                        <ProfileDrawer
                            profileGroupId={id}
                            id={(match.params as { profileId: string }).profileId}
                        />
                    )}
                />
            </Switch>
        </Styled.Wrapper>
    );
}
