import React, { useMemo } from 'react';
import styled from '@emotion/styled';
import { Column, AutoSizer } from 'react-virtualized';
import { useRouteMatch } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FaTrash } from 'react-icons/fa';

import BaseText from '../../components/BaseText';
import InlineLink from '../../components/InlineLink';
import ProfileGroupGridActionBar from './ProfileGroupGridActionBar';
import Empty from '../../components/Empty';
import useSelection from '../../components/_lib/use_selection';
import DataGrid, {
    SortableHeaderRenderer,
    TextCellRenderer,
    TextHeaderRenderer,
} from '../../components/DataGrid';
import useConfirmation, {
    DELETE_PROFILE_CONFIRMATION,
} from '../../components/_lib/use_confirmation';
import { getEffectiveShippingAddress, Profile, streetAddressToString } from '../../types/profile';
import { addProfiles, removeProfiles } from '../../slices/profiles';
import ActionButton from '../../components/ActionButton';
import CreditCardIcon from '../../components/CreditCardIcon';

const Styled = {
    Wrapper: styled.div`
        display: flex;
        flex-direction: column;
        align-items: stretch;
    `,
    ActionsCell: styled.div`
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 16px;
    `,
    CreditCardCell: styled.div`
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 8px;
    `,
};

export type ProfileGroupGridProps = {
    profiles: Profile[];
    profileGroupId: string;
    onCreateNewProfile: () => void;
    className?: string;
    style?: React.CSSProperties;
};

/**
 * Extension of Profile that contains pre-computed fields
 * used for sorting, displaying, and (potentially) filtering.
 */
type TransformedProfile = Profile & {
    combinedShippingAddress: string;
    effectiveEmail: string;
    lastCardDigits: string;
};

enum SortColumns {
    NAME = 'name',
    EMAIL = 'email',
    CARD = 'card',
    SHIPPING = 'shipping',
}

function extractProfileId(profile: unknown): string {
    return (profile as TransformedProfile).id;
}

function extractSortKey(profile: unknown, sortColumn: string): string | number {
    const typedProfile = profile as TransformedProfile;
    switch (sortColumn) {
        case SortColumns.NAME:
            return typedProfile.name;
        case SortColumns.EMAIL:
            return typedProfile.effectiveEmail;
        case SortColumns.CARD:
            return typedProfile.lastCardDigits;
        case SortColumns.SHIPPING:
            return typedProfile.combinedShippingAddress;
        default:
            // Unreachable
            throw new Error(`unknown sort column ${sortColumn}`);
    }
}

/**
 * Renders the inner profile group content with each profile organized in a table
 * with selectable rows and sortable columns,
 * as well as the toolbar at the top for performing actions on subsets of profiles.
 */
export default function ProfileGroupGrid({
    profiles,
    profileGroupId,
    className,
    style,
    onCreateNewProfile,
}: ProfileGroupGridProps): React.ReactElement {
    const dispatch = useDispatch();
    const { url } = useRouteMatch();

    // Transform each profile to eagerly attach metadata
    const transformedProfiles = useMemo<TransformedProfile[]>(
        () =>
            profiles.map((profile) => ({
                ...profile,
                combinedShippingAddress: streetAddressToString(
                    getEffectiveShippingAddress(profile)
                ),
                effectiveEmail: profile.shipping.sameAsBilling
                    ? profile.billing.email
                    : profile.shipping.email,
                lastCardDigits: profile.card.number.replace(/\D/g, '').slice(-4),
            })),
        [profiles]
    );

    // Use the useSelection hook to manage selection state management
    const selectionState = useSelection({
        source: transformedProfiles,
        extractId: extractProfileId,
    });

    const deleteProfiles = (profileIds: string[]) => {
        // Remove the profiles from the selection state if they are selected
        selectionState.removeSelection(profileIds);
        dispatch(removeProfiles({ profileGroupId, profileIds }));
    };
    const duplicateSelectedProfiles = () => {
        // Collect the profiles that have been selected for duplication
        const profileMap: Record<string, TransformedProfile> = {};
        transformedProfiles.forEach((profile) => {
            profileMap[profile.id] = profile;
        });
        const toDuplicateProfiles: TransformedProfile[] = [];
        Object.keys(selectionState.selectedIds).forEach((id) => {
            if (Object.prototype.hasOwnProperty.call(profileMap, id)) {
                toDuplicateProfiles.push(profileMap[id]);
            }
        });

        dispatch(
            addProfiles({
                profileGroupId,
                profiles: toDuplicateProfiles.map((profile) => {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { id, ...partialProfile } = profile;
                    return partialProfile;
                }),
            })
        );
    };

    const deleteProfileConfirmation = useConfirmation({
        ...DELETE_PROFILE_CONFIRMATION,
        onConfirm: (profile: Profile) => deleteProfiles([profile.id]),
    });
    const batchDeleteProfileConfirmation = useConfirmation({
        title: 'Delete Profiles',
        onConfirm: (profileIds: string[]) => deleteProfiles(profileIds),
        // eslint-disable-next-line react/display-name
        renderBody: (profileIds: string[]) => (
            <BaseText variant="strong">
                Are you sure you want to delete {profileIds.length} profile
                {profileIds.length === 1 ? '' : 's'}? Any tasks using the profile will continue to
                run but won&apos;t be able to be restarted.
            </BaseText>
        ),
    });

    // CellRenderer for the "Actions" column
    const ActionsCellRenderer = ({ rowData }: { rowData: TransformedProfile }) => (
        <Styled.ActionsCell>
            <ActionButton
                icon={<FaTrash />}
                onClick={(e: React.MouseEvent) =>
                    deleteProfileConfirmation.handleClickWithConfirmation(e, rowData)
                }
                iconColor="danger"
                variant="danger"
                size="small"
            />
            <InlineLink to={`${url}/profiles/${rowData.id}`}>View Details</InlineLink>
        </Styled.ActionsCell>
    );

    return (
        <Styled.Wrapper className={className} style={style}>
            <ProfileGroupGridActionBar
                hasAnySelected={selectionState.anySelected}
                onNew={onCreateNewProfile}
                onDuplicate={duplicateSelectedProfiles}
                onDelete={(e) => {
                    const taskIds = Object.keys(selectionState.selectedIds);
                    batchDeleteProfileConfirmation.handleClickWithConfirmation(e, taskIds);
                }}
            />
            <div style={{ flexGrow: 1 }}>
                <AutoSizer>
                    {({ width, height }) => (
                        <DataGrid
                            width={width}
                            height={height}
                            items={transformedProfiles}
                            extractId={extractProfileId}
                            selectionState={selectionState}
                            extractSortKey={extractSortKey}
                            defaultSortColumn={SortColumns.NAME}
                            noRowsRenderer={() => (
                                <Empty
                                    text="No profiles found"
                                    linkText="create a new profile"
                                    onClick={onCreateNewProfile}
                                />
                            )}
                        >
                            {/* The selection column is automatically included by <DataGrid /> */}
                            <Column
                                dataKey={SortColumns.NAME}
                                label="Name"
                                width={120}
                                headerRenderer={SortableHeaderRenderer}
                                cellRenderer={TextCellRenderer}
                                cellDataGetter={({ rowData }: { rowData: TransformedProfile }) =>
                                    String(rowData.name)
                                }
                            />
                            <Column
                                dataKey={SortColumns.EMAIL}
                                label="Email"
                                width={160}
                                headerRenderer={SortableHeaderRenderer}
                                cellRenderer={TextCellRenderer}
                                cellDataGetter={({ rowData }: { rowData: TransformedProfile }) =>
                                    rowData.effectiveEmail
                                }
                            />
                            <Column
                                dataKey={SortColumns.CARD}
                                label="Card"
                                width={85}
                                headerRenderer={SortableHeaderRenderer}
                                headerStyle={{ paddingLeft: 30 }}
                                // eslint-disable-next-line react/no-unused-prop-types
                                cellRenderer={({ rowData }: { rowData: TransformedProfile }) => (
                                    <Styled.CreditCardCell>
                                        <CreditCardIcon card={rowData.card.number} />
                                        <BaseText>{rowData.lastCardDigits}</BaseText>
                                    </Styled.CreditCardCell>
                                )}
                            />
                            <Column
                                dataKey={SortColumns.SHIPPING}
                                label="Shipping"
                                width={260}
                                headerRenderer={SortableHeaderRenderer}
                                cellRenderer={TextCellRenderer}
                                cellDataGetter={({ rowData }: { rowData: TransformedProfile }) =>
                                    rowData.combinedShippingAddress
                                }
                            />
                            <Column
                                dataKey="actions"
                                label="Actions"
                                width={180}
                                disableSort
                                headerRenderer={TextHeaderRenderer}
                                cellRenderer={ActionsCellRenderer}
                            />
                        </DataGrid>
                    )}
                </AutoSizer>
            </div>

            {deleteProfileConfirmation.confirmationModal}
            {batchDeleteProfileConfirmation.confirmationModal}
        </Styled.Wrapper>
    );
}
