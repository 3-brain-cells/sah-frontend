import React from 'react';
import styled from '@emotion/styled';
import { useDispatch } from 'react-redux';
import { Redirect, Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';

import { colors, shadows } from '../../components/_lib/colors';
import ProfilesSidebar from './ProfilesSidebar';
import { useSelector } from '../../store';
import ProfileGroupContent from './ProfileGroupContent';
import WindowEmpty from '../../components/WindowEmpty';
import HeightLayer, { Height } from '../../components/_lib/height';
import useRouteId from '../../components/_lib/use_route_id';
import {
    allProfileGroupHeaders,
    createProfileGroup,
    deleteProfileGroup,
} from '../../slices/profiles';

const Styled = {
    PageContainer: styled.div`
        padding-left: 0;
        display: flex;
        flex-direction: row;
        align-items: stretch;
        justify-content: flex-start;
        flex-grow: 1;
        overflow: hidden;
    `,
    PageContent: styled.div`
        flex-grow: 1;
        background-color: ${colors.background30};
        border-radius: 24px 0px 0px 0px;
        display: flex;
        flex-direction: row;
        align-items: stretch;
        overflow: hidden;
        box-shadow: ${shadows.height20};
    `,
};

type ActiveProfileGroupProps = { id: string; parentUrl: string };

/**
 * Router match component that conditionally shows a release if it exists in the store
 */
function ActiveProfileGroup({ id, parentUrl }: ActiveProfileGroupProps): React.ReactElement {
    // Subscribe to the store to determine if the profile group exists or not
    const profileGroupExists = useSelector((state) =>
        Object.prototype.hasOwnProperty.call(state.profiles.groups, id)
    );

    if (!profileGroupExists) {
        // Redirect to the root
        return <Redirect to={parentUrl} />;
    }

    return <ProfileGroupContent id={id} />;
}

/**
 * Router-powered component that handles showing the active profile group
 * when there exists at least 1 valid, loaded profile group from the store
 */
function SomeProfileGroups(): React.ReactElement {
    // Subscribe to the store to get the list of profile groups in the order of the nav
    const profileGroups = useSelector(allProfileGroupHeaders);

    // Get the current base path/url
    const { path, url } = useRouteMatch();

    return (
        <Switch>
            {/* Redirect to the first profile group if on the root path */}
            <Redirect exact from={path} to={`${url}/${profileGroups[0].id}`} />
            <Route
                path={`${path}/:id`}
                render={({ match }) => (
                    <ActiveProfileGroup id={(match.params as { id: string }).id} parentUrl={url} />
                )}
            />
        </Switch>
    );
}

/**
 * Placeholder page that shows when there are no profile groups
 */
function NoProfileGroups(): React.ReactElement {
    // Get the current base path/url
    const { path, url } = useRouteMatch();

    return (
        <>
            <WindowEmpty text="No profile group selected" />
            <Switch>
                {/* Redirect back to the base URL if the first Route doesn't match
                    (ensures that we will be at the relative path "/" */}
                <Route exact path={path} />
                <Redirect to={url} />
            </Switch>
        </>
    );
}

export default function ProfilesPage(): React.ReactElement {
    // Obtain the store's dispatch function
    const dispatch = useDispatch();

    // Subscribe to the store to see if there are any profile groups
    const anyProfileGroups = useSelector((store) => Object.keys(store.profiles.groups).length > 0);

    // Subscribe to the store to determine if the list of profile groups has loaded
    const hasLoaded = useSelector((store) => store.profiles.loaded);

    // Get the current base url and access to the history
    const { url } = useRouteMatch();
    const history = useHistory();

    // Determine what the active profile group is
    const activeProfileGroupId = useRouteId();

    return (
        <Styled.PageContainer>
            <ProfilesSidebar
                currentProfileGroup={activeProfileGroupId}
                onProfileGroupClick={(id) => {
                    if (id !== activeProfileGroupId) {
                        history.push(`${url}/${id}`);
                    }
                }}
                onRemoveClick={(id: string) => dispatch(deleteProfileGroup(id))}
                onNewClick={() => dispatch(createProfileGroup({ name: 'New profile group' }))}
            />
            <Styled.PageContent>
                <HeightLayer height={Height.h30}>
                    {hasLoaded && anyProfileGroups && <SomeProfileGroups />}
                    {hasLoaded && !anyProfileGroups && <NoProfileGroups />}
                </HeightLayer>
            </Styled.PageContent>
        </Styled.PageContainer>
    );
}
