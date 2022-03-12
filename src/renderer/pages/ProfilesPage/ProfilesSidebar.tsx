import React from 'react';

import { useSelector } from '../../store';
import Sidebar from '../../components/Sidebar';
import Empty from '../../components/Empty';
import BaseText from '../../components/BaseText';
import useConfirmation from '../../components/_lib/use_confirmation';
import MenuItem from '../../components/MenuItem';
import { allProfileGroupHeaders, ProfileGroupHeader } from '../../slices/profiles';
import ProfilesSidebarItem from './ProfilesSidebarItem';

export type ProfilesSidebarProps = {
    currentProfileGroup: string | null;
    onProfileGroupClick: (id: string) => void;
    onRemoveClick: (id: string) => void;
    onNewClick: () => void;
    className?: string;
    style?: React.CSSProperties;
};

/**
 * Store-connected component that displays the Sidebar and all sidebar items
 * for the profiles page
 */
export default function ProfilesSidebar({
    currentProfileGroup,
    onProfileGroupClick,
    onRemoveClick,
    onNewClick,
    className,
    style,
}: ProfilesSidebarProps): React.ReactElement {
    // Subscribe to the store
    const headers: ProfileGroupHeader[] = useSelector(allProfileGroupHeaders);

    const deleteConfirmation = useConfirmation({
        title: 'Delete Profile Group',
        onConfirm: (partialProfileGroup: { id: string; name: string }) =>
            onRemoveClick(partialProfileGroup.id),
        // eslint-disable-next-line react/display-name
        renderBody: (partialProfileGroup: { id: string; name: string }) => (
            <BaseText variant="strong">
                Are you sure you want to delete profile group {partialProfileGroup.name}?
            </BaseText>
        ),
    });

    let sidebarChildren = null;
    if (headers.length === 0) {
        sidebarChildren = (
            <Empty
                text="No Profile Groups Found"
                linkText="create a new profile group"
                onClick={onNewClick}
            />
        );
    } else {
        sidebarChildren = (
            <>
                <div style={{ height: 12 }} />
                {headers.map(({ id, name }) => (
                    <ProfilesSidebarItem
                        key={id}
                        id={id}
                        name={name}
                        selected={currentProfileGroup === id}
                        onRemove={(e: React.MouseEvent) =>
                            deleteConfirmation.handleClickWithConfirmation(e, { id, name })
                        }
                        onClick={() => onProfileGroupClick(id)}
                    />
                ))}
                {deleteConfirmation.confirmationModal}
            </>
        );
    }

    return (
        <Sidebar
            className={className}
            style={style}
            onAddClick={onNewClick}
            title="Profiles"
            addText="Group"
            menu={
                <>
                    <MenuItem onClick={onNewClick}>New...</MenuItem>
                </>
            }
        >
            {sidebarChildren}
        </Sidebar>
    );
}
