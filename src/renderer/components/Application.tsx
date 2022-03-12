import React, { useMemo, useEffect } from 'react';
import { Global, css } from '@emotion/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { hot } from 'react-hot-loader/root';
import styled from '@emotion/styled';
import { HashRouter, Redirect, Route, Switch, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ipcRenderer } from 'electron';

import MainNav from './MainNav';
import AboutModal from './AboutModal';
import { AboutModalContext } from './_lib/modal_contexts';
import AccountsPage from '../pages/AccountsPage/AccountsPage';
import ReleasesPage from '../pages/ReleasesPage/ReleasesPage';
import CaptchasPage from '../pages/CaptchasPage/CatchasPage';
import ProfilesPage from '../pages/ProfilesPage/ProfilesPage';
import ProxiesPage from '../pages/ProxiesPage/ProxiesPage';
import SettingsPage from '../pages/SettingsPage/SettingsPage';
import DesignSystemPage, {
    isDesignSystemPageEnabled,
} from '../pages/DesignSystemPage/DesignSystemPage';
import { colors, shadows } from './_lib/colors';
import { loadReleases, loadStatuses } from '../slices/tasks';
import { StatusUpdate } from '../types/task';
import { STATUS_UPDATE_CHANNEL } from '../../ipc';
import { globalStyles } from './_lib/global';
import HeightLayer, { Height } from './_lib/height';
import Titlebar, { TITLEBAR_HEIGHT } from './Titlebar';
import { loadProfileGroups } from '../slices/profiles';

import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const Styled = {
    Root: styled.div`
        background: ${colors.background10};
        height: 100vh;
    `,
    ContentRoot: styled.div`
        display: flex;
        flex-direction: row;
        background: ${colors.background10};
        height: calc(100vh - ${TITLEBAR_HEIGHT}px);
    `,
    Content: styled.main`
        flex-grow: 1;
        overflow: auto;
        z-index: 1;
        position: relative;
        background-color: ${colors.background20};
        box-shadow: ${shadows.height20};
        border-top-left-radius: 24px;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        justify-content: stretch;
    `,
};

/**
 * Begins initial API fetching logic.
 */
function DataLoader(): null {
    // Upon mounting, populate the store will all initial values from the API
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(loadReleases());
        dispatch(loadProfileGroups());
    }, [dispatch]);

    // Upon mounting, subscribe to status updates from the main process
    useEffect(() => {
        ipcRenderer.on(STATUS_UPDATE_CHANNEL, (event, arg: StatusUpdate[]) =>
            dispatch(loadStatuses(arg))
        );

        return () => {
            ipcRenderer.removeAllListeners(STATUS_UPDATE_CHANNEL);
        };
    }, [dispatch]);

    return null;
}

/**
 * Contains each top-level page in the application
 */
function PagesSwitch(): React.ReactElement {
    const { pathname } = useLocation();
    return (
        <Switch>
            <Redirect from="/:url*(/+)" to={pathname.slice(0, -1)} />
            <Redirect exact from="/" to="/releases" />
            <Route path="/releases" component={ReleasesPage} />
            <Route path="/profile_groups" component={ProfilesPage} />
            <Route path="/proxy_lists" component={ProxiesPage} />
            <Route path="/accounts" component={AccountsPage} />
            <Route path="/captchas" component={CaptchasPage} />
            <Route path="/settings" component={SettingsPage} />
            {isDesignSystemPageEnabled && (
                <Route path="/design_system" component={DesignSystemPage} />
            )}
        </Switch>
    );
}

function Application(): React.ReactElement {
    const [showAboutModal, setShowAboutModal] = React.useState(false);
    const aboutModalContext = useMemo(
        () => ({ showAboutModal, setShowAboutModal }),
        [showAboutModal, setShowAboutModal]
    );

    return (
        <HashRouter>
            <Global
                styles={css`
                    ${globalStyles}
                `}
            />
            <DataLoader />
            <Styled.Root>
                <Titlebar />
                <Styled.ContentRoot>
                    <HeightLayer height={Height.h10}>
                        <AboutModalContext.Provider value={aboutModalContext}>
                            <AboutModal
                                isOpen={showAboutModal}
                                onClose={() => setShowAboutModal(false)}
                            />
                            <MainNav />
                        </AboutModalContext.Provider>
                        <Styled.Content>
                            <HeightLayer height={Height.h20}>
                                <PagesSwitch />
                            </HeightLayer>
                        </Styled.Content>
                    </HeightLayer>
                </Styled.ContentRoot>
            </Styled.Root>
        </HashRouter>
    );
}

export default hot(Application);
