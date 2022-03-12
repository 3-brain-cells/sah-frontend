import React from 'react';
import styled from '@emotion/styled';
import { useHistory } from 'react-router-dom';
import { FaTimes, FaTrash } from 'react-icons/fa';
import { useDispatch } from 'react-redux';

import Drawer from '../../components/Drawer';
import IconButton from '../../components/IconButton';
import ActionButton from '../../components/ActionButton';
import BaseText from '../../components/BaseText';
import { useSelector } from '../../store';
import useConfirmation, {
    DELETE_PROFILE_CONFIRMATION,
} from '../../components/_lib/use_confirmation';
import PageTitle from '../../components/PageTitle';
import { removeProfiles } from '../../slices/profiles';

const TOP_PADDING = 20;
const SIDE_PADDING = 24;

const Styled = {
    Drawer: styled(Drawer)`
        display: flex;
        flex-direction: column;
        align-items: stretch;
        padding-top: ${TOP_PADDING - 2}px;
        flex-shrink: 0;
        gap: 20px;
    `,
    TitleRow: styled.div`
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 12px;
        /* Use an offset of -10px to visually align the X icon
           with the rest of the drawer*/
        padding-left: ${SIDE_PADDING - 10}px;
        padding-right: ${SIDE_PADDING}px;
        padding-bottom: 12px;
    `,
    Title: styled.div`
        position: relative;
        flex-grow: 1;
    `,
    SubTitleText: styled(BaseText)`
        position: absolute;
        left: 0;
        right: 0;
        top: calc(100% - 4px);
    `,
};

export type ProfileDrawerProps = {
    profileGroupId: string;
    id: string;
    className?: string;
    style?: React.CSSProperties;
};

/**
 * Renders the profile drawer that is used
 * to view and edit details about a single profile.
 */
export default function ProfileDrawer({
    profileGroupId,
    id,
    className,
    style,
}: ProfileDrawerProps): React.ReactElement {
    const profile = useSelector(
        (state) => state.profiles.groups[profileGroupId].profiles[id] ?? null
    );

    const history = useHistory();
    const dispatch = useDispatch();
    const deleteProfile = () => {
        dispatch(
            removeProfiles({
                profileGroupId,
                profileIds: [id],
            })
        );
        history.push('..');
    };
    const deleteConfirmation = useConfirmation({
        ...DELETE_PROFILE_CONFIRMATION,
        onConfirm: deleteProfile,
    });

    const returnToProfileGroup = () => history.push('..');

    return (
        <Styled.Drawer className={className} style={style}>
            <Styled.TitleRow>
                <IconButton onClick={returnToProfileGroup} icon={<FaTimes />} />
                <Styled.Title>
                    <PageTitle>Profile Details</PageTitle>
                    <Styled.SubTitleText variant="faded">
                        Profile {profile?.name}
                    </Styled.SubTitleText>
                </Styled.Title>
                <ActionButton
                    variant="danger"
                    iconColor="danger"
                    onClick={(e) => {
                        if (profile !== null) {
                            deleteConfirmation.handleClickWithConfirmation(e, profile);
                        }
                    }}
                    icon={<FaTrash />}
                />
            </Styled.TitleRow>
        </Styled.Drawer>
    );
}
