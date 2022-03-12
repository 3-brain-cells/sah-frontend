import React, { useEffect, useMemo, useRef, useState, KeyboardEvent } from 'react';
import styled from '@emotion/styled';
import { FaPlus, FaTimes } from 'react-icons/fa';

import BaseModal from '../../components/BaseModal';
import Button from '../../components/Button';
import Checkbox from '../../components/Checkbox';
import TextBox from '../../components/TextBox';
import WithLabel from '../../components/WithLabel';
import { formatSite, siteIds } from '../../util';
import { SingleSelect } from '../../components/Select';

export type CreateReleaseModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (name: string, site: string) => void;
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
        display: flex;
        flex-direction: row;
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
 * "site" and "name" fields needed when creating a new release.
 */
export default function CreateReleaseModal({
    isOpen,
    onClose,
    onCreate,
}: CreateReleaseModalProps): React.ReactElement {
    // Store controlled form state
    const [createAnother, setCreateAnother] = useState(false);
    const [nameValue, setNameValue] = useState('');
    const [selectedSite, setSelectedSite] = useState<{ label: string; value: string } | null>(null);

    // Store a ref of the textbox
    const nameTextbox = useRef<HTMLInputElement | null>(null);

    // Handle validating inputs before closing
    const onCreateRaw = () => {
        if (selectedSite !== null && nameValue !== '') {
            onCreate(nameValue, selectedSite.value);
            if (!createAnother) {
                onClose();
                setImmediate(() => {
                    setNameValue('');
                    setSelectedSite(null);
                });
            } else {
                nameTextbox.current?.focus();
                nameTextbox.current?.select();
            }
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
    const options = useMemo(() => siteIds.map((id) => ({ value: id, label: formatSite(id) })), []);

    return (
        <BaseModal title="Create New Release" isOpen={isOpen} onClose={onClose}>
            {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
            <div onKeyDown={onKeyDown}>
                <Styled.Form>
                    <WithLabel label="Name" style={{ flexBasis: 1 }}>
                        <TextBox
                            ref={nameTextbox}
                            value={nameValue}
                            setValue={(next?: string) => setNameValue(next ?? '')}
                        />
                    </WithLabel>
                    <WithLabel label="Site" style={{ flexBasis: 1 }}>
                        <SingleSelect
                            options={options}
                            onSelect={setSelectedSite}
                            selectedOption={selectedSite}
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
