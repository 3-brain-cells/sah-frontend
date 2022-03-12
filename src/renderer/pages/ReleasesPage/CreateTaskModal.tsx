import React, { useEffect, useRef, useState, KeyboardEvent } from 'react';
import styled from '@emotion/styled';
import { FaPlus, FaTimes } from 'react-icons/fa';

import BaseModal from '../../components/BaseModal';
import Button from '../../components/Button';
import Checkbox from '../../components/Checkbox';
import WithLabel from '../../components/WithLabel';
import { MultiSelect, SelectItem, SingleSelect } from '../../components/Select';
import NumericEntry from '../../components/NumericEntry';

export type CreateTaskModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onCreate: () => void;
};

const Styled = {
    BottomRow: styled.div`
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;
        gap: 12px;
        margin-top: 20px;
    `,
    Checkbox: styled(Checkbox)`
        margin-right: 24px;
    `,
    Form: styled.div`
        display: grid;
        grid-template-columns: 0.5fr 0.5fr;
        grid-auto-rows: auto;
        align-items: center;
        gap: 16px;

        & > * {
            flex-grow: 1;
            flex-shrink: 1;
        }
    `,
};

/**
 * Renders an (optionally-open) modal that contains the
 * fields needed when creating a new Task.
 */
export default function CreateTaskModal({
    isOpen,
    onClose,
    onCreate,
}: CreateTaskModalProps): React.ReactElement {
    // Store controlled form state
    const [createAnother, setCreateAnother] = useState(false);
    const [taskQuantity, setTaskQuantity] = useState(1);
    const [selectedProfileGroup, setSelectedProfileGroup] =
        useState<{ label: string; value: string } | null>(null);

    const [selectedProfile, setSelectedProfile] =
        useState<{ label: string; value: string } | null>(null);

    // Store a ref of the textbox
    const nameTextbox = useRef<HTMLInputElement | null>(null);
    const [selectedSizes, setSelectedSizes] = React.useState<SelectItem[]>([]);

    // Handle validating inputs before closing
    const onCreateRaw = () => {
        onCreate();
        if (!createAnother) {
            onClose();
            setImmediate(() => {
                setTaskQuantity(1);
                setSelectedProfileGroup(null);
                setSelectedProfile(null);
                setSelectedSizes([]);
            });
        }
    };

    // Automatically focus the textbox upon mounting
    useEffect(() => {
        if (isOpen) {
            nameTextbox.current?.focus();
            nameTextbox.current?.select();
        }
    }, [isOpen]);

    // Confirm the creation when pressing enter
    const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === 'NumpadEnter') {
            event.preventDefault();
            onCreateRaw();
        }
    };

    // Gets all formatted options
    const options: SelectItem[] = [];

    return (
        <BaseModal title="Create New Task" isOpen={isOpen} onClose={onClose}>
            {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
            <div onKeyDown={onKeyDown}>
                <Styled.Form>
                    <WithLabel label="Profile Group" style={{ flexBasis: 1 }}>
                        <SingleSelect
                            options={options}
                            onSelect={setSelectedProfileGroup}
                            selectedOption={selectedProfileGroup}
                        />
                    </WithLabel>
                    <WithLabel label="Profile" style={{ flexBasis: 1 }}>
                        <SingleSelect
                            options={options}
                            onSelect={setSelectedProfile}
                            selectedOption={selectedProfile}
                        />
                    </WithLabel>
                    <WithLabel label="Task Quantity" style={{ flexBasis: 1 }}>
                        <NumericEntry
                            value={taskQuantity}
                            setValue={(next?: number) => setTaskQuantity(next ?? 0)}
                            style={{ flexGrow: 1 }}
                        />
                    </WithLabel>
                    <WithLabel label="Sizes" style={{ flexBasis: 1 }}>
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
                    </WithLabel>
                </Styled.Form>
                <Styled.BottomRow>
                    <Styled.Checkbox
                        label="Create another"
                        selected={createAnother}
                        onClick={() => setCreateAnother(!createAnother)}
                    />
                    <Button text="Create" onClick={onCreateRaw} icon={<FaPlus />} />
                    <Button
                        text="Cancel"
                        onClick={onClose}
                        variant="background"
                        icon={<FaTimes />}
                        iconColor="danger"
                    />
                </Styled.BottomRow>
            </div>
        </BaseModal>
    );
}
