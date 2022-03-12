import React, { useCallback, useState } from 'react';

import BaseText from '../BaseText';
import ConfirmationModal from '../ConfirmationModal';
import { getStatusExecutionType, StatusExecutionType, Task } from '../../types/task';
import { Profile } from '../../types/profile';

export interface UseConfirmationOptions<T> {
    title: string;
    renderBody: (state: T) => React.ReactElement;
    onConfirm: (state: T) => void;
}

export interface UseConfirmationState<T> {
    isOpen: boolean;
    confirmationModal: React.ReactNode;
    handleClickWithConfirmation: (e: React.MouseEvent, state: T) => void;
    openConfirmation: (state: T) => void;
}

/**
 * Utility hook for expressing a common pattern with a confirmation modal
 * and an flow that can be initiated (or skipped with shift)
 * that may ultimately lead to a destructive action.
 */
export default function useConfirmation<T>({
    title,
    renderBody,
    onConfirm,
}: UseConfirmationOptions<T>): UseConfirmationState<T> {
    const [currentState, setCurrentState] = useState<T | null>(null);

    const confirmationModal = (
        <ConfirmationModal
            title={title}
            isOpen={currentState !== null}
            onClose={() => {
                setCurrentState(null);
            }}
            onConfirm={() => {
                if (currentState !== null) {
                    onConfirm(currentState);
                }
                setCurrentState(null);
            }}
        >
            {currentState !== null && renderBody(currentState)}
        </ConfirmationModal>
    );

    const handleClickWithConfirmation = useCallback(
        (e: React.MouseEvent, state: T) => {
            if (e?.shiftKey) {
                onConfirm(state);
            } else {
                setCurrentState(state);
            }
        },
        [onConfirm]
    );

    const openConfirmation = useCallback((state: T) => setCurrentState(state), []);

    return {
        isOpen: currentState !== null,
        confirmationModal,
        handleClickWithConfirmation,
        openConfirmation,
    };
}

// ===========================
// Common confirmation configs
// ===========================

type PartialConfirmationOptions<T> = Omit<UseConfirmationOptions<T>, 'onConfirm'>;

export const DELETE_TASK_CONFIRMATION: PartialConfirmationOptions<Task> = {
    title: 'Delete Task',
    // eslint-disable-next-line react/display-name
    renderBody: (task: Task) => (
        <>
            <BaseText variant="strong">
                Are you sure you want to delete task #{task.definition.number}?
            </BaseText>
            {getStatusExecutionType(task.status) === StatusExecutionType.RUNNING && (
                <BaseText>This will cancel the in-progress task</BaseText>
            )}
        </>
    ),
};

export const DELETE_PROFILE_CONFIRMATION: PartialConfirmationOptions<Profile> = {
    title: 'Delete Profile',
    // eslint-disable-next-line react/display-name
    renderBody: (profile: Profile) => (
        <BaseText variant="strong">
            Are you sure you want to delete profile &ldquo;{profile.name}&rdquo;?
        </BaseText>
    ),
};
