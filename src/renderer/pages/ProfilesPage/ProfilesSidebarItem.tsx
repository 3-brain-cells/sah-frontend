import React from 'react';

import { profileGroupProfileCount } from '../../slices/profiles';
import { useSelector } from '../../store';
import SidebarItem from '../../components/SidebarItem';
import SidebarTea from '../../components/SidebarTea';

export type ProfilesSidebarItemProps = {
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
 * and subscribes to any updates to the number of included profiles in the group
 * displayed in the pill to the right of the profile group name
 */
export default function ProfilesSidebarItem({
    id,
    name,
    selected,
    onRemove,
    onClick,
    className,
    style,
}: ProfilesSidebarItemProps): React.ReactElement {
    // Subscribe to the store
    const numberOfProfiles = useSelector((state) => profileGroupProfileCount(state, { id }));

    return (
        <SidebarItem
            label={name}
            selected={selected}
            onRemove={onRemove}
            onClick={onClick}
            className={className}
            style={style}
            pill={numberOfProfiles === 0 ? null : <SidebarTea number={numberOfProfiles} />}
        />
    );
}
