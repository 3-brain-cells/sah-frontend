import React from 'react';
import styled from '@emotion/styled';
import { FaTimes, FaTrash } from 'react-icons/fa';

import BaseModal, { ModalProps } from './BaseModal';
import Button from './Button';
import Bold from './Bold';
import BaseText from './BaseText';

const Styled = {
    Dialog: styled(BaseModal)`
        display: flex;
        flex-direction: column;
    `,
    ButtonRow: styled.div`
        display: flex;
        flex-direction: row;
        gap: 12px;
        margin-top: 20px;
        justify-content: flex-end;
    `,
    TipText: styled(BaseText)`
        padding-top: 10px;
        line-height: 20px;
        opacity: 0.7;
    `,
};

export type ConfirmationModalProps = ModalProps & {
    onConfirm: () => void;
};

/**
 * ConfirmationModal creates a modal to cornfirm or deny an action
 */
export default function ConfirmationModal({
    onClose,
    children,
    onConfirm,
    ...rest
}: ConfirmationModalProps): React.ReactElement {
    return (
        <Styled.Dialog {...rest} onClose={onClose}>
            {children}
            <Styled.TipText className="text">
                <Bold>Hint:</Bold> You can bypass this confirmation by holding down{' '}
                <Bold>shift</Bold> when you click the button that pulled up this dialog.
            </Styled.TipText>
            <Styled.ButtonRow>
                <Button variant="danger" text="Delete" onClick={onConfirm} icon={<FaTrash />} />
                <Button text="Cancel" onClick={onClose} variant="background" icon={<FaTimes />} />
            </Styled.ButtonRow>
        </Styled.Dialog>
    );
}
