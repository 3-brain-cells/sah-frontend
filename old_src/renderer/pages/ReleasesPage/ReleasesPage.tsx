import React, { useCallback, useState } from 'react';
import styled from '@emotion/styled';
import { useDispatch } from 'react-redux';
import { Redirect, Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';

import { colors, shadows } from '../../components/_lib/colors';
import ReleasesSidebar from './ReleasesSidebar';
import { allFlattenedReleaseHeaders, createRelease, deleteRelease } from '../../slices/tasks';
import { useSelector } from '../../store';
import ReleaseContent from './ReleaseContent';
import CreateReleaseModal from './CreateReleaseModal';
import WindowEmpty from '../../components/WindowEmpty';
import HeightLayer, { Height } from '../../components/_lib/height';
import useRouteId from '../../components/_lib/use_route_id';

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

type ActiveReleaseProps = { id: string; parentUrl: string };

/**
 * Router match component that conditionally shows a release if it exists in the store
 */
function ActiveRelease({ id, parentUrl }: ActiveReleaseProps): React.ReactElement {
    // Subscribe to the store to determine if the release exists or not
    const releaseExists = useSelector((state) =>
        Object.prototype.hasOwnProperty.call(state.tasks.releases, id)
    );

    if (!releaseExists) {
        // Redirect to the root
        return <Redirect to={parentUrl} />;
    }

    return <ReleaseContent id={id} />;
}

/**
 * Router-powered component that handles showing the active release
 * when there exists at least 1 valid, loaded release from the store
 */
function SomeReleases(): React.ReactElement {
    // Subscribe to the store to get the list of releases in the order of the nav
    const releases = useSelector(allFlattenedReleaseHeaders);

    // Get the current base path/url
    const { path, url } = useRouteMatch();

    return (
        <Switch>
            {/* Redirect to the first release if on the root path */}
            <Redirect exact from={path} to={`${url}/${releases[0].id}`} />
            <Route
                path={`${path}/:id`}
                render={({ match }) => (
                    <ActiveRelease id={(match.params as { id: string }).id} parentUrl={url} />
                )}
            />
        </Switch>
    );
}

/**
 * Placeholder page that shows when there are no releases
 */
function NoReleases(): React.ReactElement {
    // Get the current base path/url
    const { path, url } = useRouteMatch();

    return (
        <>
            <WindowEmpty text="No release selected" />
            <Switch>
                {/* Redirect back to the base URL if the first Route doesn't match
                    (ensures that we will be at the relative path "/" */}
                <Route exact path={path} />
                <Redirect to={url} />
            </Switch>
        </>
    );
}

export default function ReleasesPage(): React.ReactElement {
    // Obtain the store's dispatch function
    const dispatch = useDispatch();

    // Subscribe to the store to see if there are any releases
    const anyReleases = useSelector((store) => Object.keys(store.tasks.releases).length > 0);

    // Subscribe to the store to determine if the list of releases has loaded
    const hasLoaded = useSelector((store) => store.tasks.loaded);

    // Get the current base url and access to the history
    const { url } = useRouteMatch();
    const history = useHistory();

    // Determine what the active release is
    const activeReleaseId = useRouteId();

    // Handle modal logic
    const [createReleaseModalOpen, setCreateReleaseModalOpen] = useState(false);
    const onCreate = useCallback(
        (name: string, site: string) => dispatch(createRelease({ name, site })),
        [dispatch]
    );
    const onRemove = useCallback((id: string) => dispatch(deleteRelease(id)), [dispatch]);

    return (
        <Styled.PageContainer>
            <ReleasesSidebar
                currentRelease={activeReleaseId}
                onReleaseClick={(id) => {
                    if (id !== activeReleaseId) {
                        history.push(`${url}/${id}`);
                    }
                }}
                onRemoveClick={onRemove}
                onNewClick={() => setCreateReleaseModalOpen(true)}
            />
            <Styled.PageContent>
                <HeightLayer height={Height.h30}>
                    {hasLoaded && anyReleases && <SomeReleases />}
                    {hasLoaded && !anyReleases && <NoReleases />}
                </HeightLayer>
            </Styled.PageContent>
            <CreateReleaseModal
                isOpen={createReleaseModalOpen}
                onClose={() => setCreateReleaseModalOpen(false)}
                onCreate={onCreate}
            />
        </Styled.PageContainer>
    );
}
