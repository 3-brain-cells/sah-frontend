import React from 'react';

import { allReleaseHeaderGroups, ReleaseHeaderGroup } from '../../slices/tasks';
import { useSelector } from '../../store';
import { formatSite } from '../../util';
import Sidebar from '../../components/Sidebar';
import Empty from '../../components/Empty';
import ReleasesSidebarItem from './ReleasesSidebarItem';
import SidebarSectionHeading from '../../components/SidebarSectionHeading';
import BaseText from '../../components/BaseText';
import useConfirmation from '../../components/_lib/use_confirmation';
import MenuItem from '../../components/MenuItem';

export type ReleasesSidebarProps = {
    currentRelease: string | null;
    onReleaseClick: (id: string) => void;
    onRemoveClick: (id: string) => void;
    onNewClick: () => void;
    className?: string;
    style?: React.CSSProperties;
};

/**
 * Store-connected component that displays the Sidebar and all sidebar items
 * for the releases page
 */
export default function ReleasesSidebar({
    currentRelease,
    onReleaseClick,
    onRemoveClick,
    onNewClick,
    className,
    style,
}: ReleasesSidebarProps): React.ReactElement {
    // Subscribe to the store
    const groups: ReleaseHeaderGroup[] = useSelector(allReleaseHeaderGroups);

    const deleteConfirmation = useConfirmation({
        title: 'Delete Release',
        onConfirm: (partialRelease: { id: string; name: string }) =>
            onRemoveClick(partialRelease.id),
        // eslint-disable-next-line react/display-name
        renderBody: (partialRelease: { id: string; name: string }) => (
            <BaseText variant="strong">
                Are you sure you want to delete release {partialRelease.name}?
            </BaseText>
        ),
    });

    let sidebarChildren = null;
    if (groups.length === 0) {
        sidebarChildren = (
            <Empty text="No Releases Found" linkText="create a new release" onClick={onNewClick} />
        );
    } else {
        sidebarChildren = (
            <>
                {groups.map(({ site, items }) => (
                    <React.Fragment key={site}>
                        <SidebarSectionHeading>
                            {formatSite(site).toUpperCase()}
                        </SidebarSectionHeading>
                        {items.map(({ id, name }) => (
                            <ReleasesSidebarItem
                                key={id}
                                id={id}
                                name={name}
                                selected={currentRelease === id}
                                onRemove={(e: React.MouseEvent) =>
                                    deleteConfirmation.handleClickWithConfirmation(e, { id, name })
                                }
                                onClick={() => onReleaseClick(id)}
                            />
                        ))}
                    </React.Fragment>
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
            title="Releases"
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
