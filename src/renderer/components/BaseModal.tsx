import React from 'react';
import styled from '@emotion/styled';
import Modal from 'react-overlays/Modal';
import { FaTimes } from 'react-icons/fa';

import IconButton from './IconButton';
import { colors, shadows } from './_lib/colors';
import DialogTitle from './DialogTitle';
import HeightLayer, { Height } from './_lib/height';

export type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title: string | React.ReactNode;
    showCloseButton?: boolean;
    width?: 'md' | 'lg';
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
};

const Styled = {
    Modal: styled(Modal)`
        position: fixed;
        width: 400px;
        z-index: 1040;
        background-color: ${colors.background20};
        box-shadow: ${shadows.height10};
        outline: none;
        border-radius: 16px;
        padding: 22px 32px 32px;
        top: 100px;
        left: calc(50% - (var(--width) / 2));
        width: var(--width);

        &[data-width='md'] {
            --width: 600px;
        }

        &[data-width='lg'] {
            --width: 800px;
        }
    `,
    Backdrop: styled.div`
        position: fixed;
        z-index: 1039;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: ${colors['dark-overlay']};
    `,
    CloseButton: styled(IconButton)`
        position: absolute;
        top: 24px;
        right: 24px;
    `,
    Title: styled(DialogTitle)`
        margin-bottom: 4px !important;
    `,
};

function BaseModal({
    isOpen,
    onClose,
    title,
    children,
    className,
    style,
    showCloseButton = false,
    width = 'md',
}: ModalProps): React.ReactElement {
    return (
        <Styled.Modal
            show={isOpen}
            onHide={onClose}
            keyboard
            style={style}
            className={className}
            // eslint-disable-next-line react/jsx-props-no-spreading
            renderBackdrop={(props) => <Styled.Backdrop {...props} />}
            data-width={width}
        >
            <HeightLayer height={Height.h20}>
                {showCloseButton && <Styled.CloseButton onClick={onClose} icon={<FaTimes />} />}
                <Styled.Title>{title}</Styled.Title>
                {children}
            </HeightLayer>
        </Styled.Modal>
    );
}

export default BaseModal;
