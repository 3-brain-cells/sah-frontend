import React from 'react';

import { releaseTaskStatusOverview, TaskStatusOverview } from '../../slices/tasks';
import { useSelector } from '../../store';
import SidebarItem from '../../components/SidebarItem';
import SidebarStatusPill from '../../components/SidebarStatusPill';

export type ReleasesSidebarItemProps = {
    id: string;
    name: string;
    selected: boolean;
    onRemove: (event: React.MouseEvent) => void; // Bubble up MouseEvent to detect if shift key was held
    onClick: () => void;
    className?: string;
    style?: React.CSSProperties;
};

/**
 * Store-connected component that displays a single SidebarItem
 * and subscribes to any updates to the status overview information
 * displayed in the pill to the right of the release name
 */
export default function ReleasesSidebarItem({
    id,
    name,
    selected,
    onRemove,
    onClick,
    className,
    style,
}: ReleasesSidebarItemProps): React.ReactElement {
    // Subscribe to the store
    const statusOverview: TaskStatusOverview = useSelector((state) =>
        releaseTaskStatusOverview(state, { id })
    );

    return (
        <SidebarItem
            label={name}
            selected={selected}
            onRemove={onRemove}
            onClick={onClick}
            className={className}
            style={style}
            pill={
                <SidebarStatusPill
                    numSuccess={statusOverview.finished}
                    numWarn={statusOverview.running}
                    numDanger={statusOverview.stopped}
                />
            }
        />
    );
}
