import React from 'react';
import styled from '@emotion/styled';
import { useHistory } from 'react-router-dom';
import { FaSave, FaTimes } from 'react-icons/fa';

import Drawer from '../../components/Drawer';
import IconButton from '../../components/IconButton';
import Heading from '../../components/Heading';
import { MultiSelect, SelectItem, SingleSelect } from '../../components/Select';
import Button from '../../components/Button';
import FormLabel from '../../components/FormLabel';
import InlineLink from '../../components/InlineLink';
import BaseText from '../../components/BaseText';

const Styled = {
    ReleaseMassEditDrawer: styled(Drawer)`
        display: flex;
        flex-direction: column;
        align-items: stretch;
        padding-top: 40px;
        flex-shrink: 0;
        gap: 16px;
        & > * {
            padding-left: 24px;
            padding-right: 40px;
        }
    `,
    TitleRow: styled.div`
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: flex-start;
        gap: 12px;
    `,
    Title: styled.div`
        padding-top: 6px;
        padding-left: 12px;
        padding-right: 12px;
    `,
    InputFields: styled.div`
        display: grid;
        grid-template-columns: 80px 210px;
        grid-auto-rows: auto;
        row-gap: 16px;
        column-gap: 12px;
        align-self: flex-end;
        align-items: center;
    `,
    Label: styled.div`
        display: flex;
        flex-direction: column;
        align-items: flex-end;
    `,
    ActionButtonRow: styled.div`
        display: flex;
        flex-direction: row;
        gap: 12px;
        align-self: flex-end;
    `,
};

export type ReleaseMassEditDrawerProps = {
    className?: string;
    style?: React.CSSProperties;
    selectedTaskIds: string[];
};

/*
 * Create mass edit drawer for bulk editing releases
 */
export default function ReleaseMassEditDrawer({
    style,
    className,
    selectedTaskIds,
}: ReleaseMassEditDrawerProps): React.ReactElement {
    const history = useHistory();
    const returnToRelease = () => history.push('/');

    const [selectedSizes, setSelectedSizes] = React.useState<SelectItem[]>([]);

    const profiles = ['1', '2', '3'].map((profile) => ({
        value: profile,
        label: profile,
    }));
    const [selectedProfile, setSelectedProfile] = React.useState<SelectItem>(profiles[0]);

    return (
        <Styled.ReleaseMassEditDrawer className={className} style={style}>
            <Styled.TitleRow>
                <IconButton onClick={returnToRelease} icon={<FaTimes />} />
                <Styled.Title>
                    <Heading>Mass Edit</Heading>
                </Styled.Title>
            </Styled.TitleRow>
            <Styled.InputFields>
                <Styled.Label>
                    <FormLabel>Size</FormLabel>
                </Styled.Label>
                <MultiSelect
                    clearable
                    selectedOptions={selectedSizes}
                    onAdd={(next) => {
                        setSelectedSizes([...next]);
                    }}
                    onRemove={(next) => {
                        setSelectedSizes([...next]);
                    }}
                    onClear={() => {
                        setSelectedSizes([]);
                    }}
                    options={[]}
                />
                <Styled.Label>
                    <FormLabel>Profile</FormLabel>
                    <InlineLink to="/">(Configure)</InlineLink>
                </Styled.Label>

                <SingleSelect
                    selectedOption={selectedProfile}
                    onSelect={(item) => {
                        setSelectedProfile(item);
                    }}
                    options={profiles}
                />
            </Styled.InputFields>

            <Styled.ActionButtonRow>
                <Button variant="secondary" text="Save" onClick={() => {}} icon={<FaSave />} />
                <Button
                    text="Discard Changes"
                    onClick={returnToRelease}
                    variant="background"
                    icon={<FaTimes />}
                    iconColor="danger"
                />
            </Styled.ActionButtonRow>
            {selectedTaskIds.map((id) => (
                <BaseText key={id}>{id}</BaseText>
            ))}
        </Styled.ReleaseMassEditDrawer>
    );
}
