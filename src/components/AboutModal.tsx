import React from 'react';

import BaseModal from './BaseModal';

export type AboutModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

function AboutModal({ isOpen, onClose }: AboutModalProps): React.ReactElement {
    return (
        <BaseModal isOpen={isOpen} onClose={onClose} showCloseButton title="Welcome to Kairos">
            <h2>About</h2>
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed egestas velit vel urna
                pharetra rutrum. Suspendisse ut nisl sapien. Ut quis semper ipsum. Pellentesque urna
                nisl, commodo in faucibus et, imperdiet id erat. Quisque a est ipsum. Nulla et
                pharetra ante, at vestibulum arcu.
            </p>
            <h2>About Kairos</h2>
            <p>
                Vestibulum sem tellus, efficitur id facilisis non, euismod et est. Praesent vitae
                tristique purus. Donec ut elit id lectus luctus vehicula at eu nunc. Nulla pulvinar
                est libero. Donec fringilla sed lectus quis porttitor. Vestibulum ante ipsum primis
                in faucibus orci luctus et ultrices posuere cubilia curae; Morbi convallis pretium
                velit, sed fermentum dui molestie et.
            </p>
            <h2>Support</h2>
            <p>
                Duis et arcu eget leo sagittis luctus et mattis nunc. Curabitur eu semper leo.
                Nullam finibus faucibus felis, a egestas massa cursus id. Vivamus semper risus id
                enim molestie, vel condimentum felis maximus. Pellentesque nec aliquam massa, non
                laoreet est.
            </p>
            <h2>Changelog</h2>
        </BaseModal>
    );
}

export default AboutModal;
