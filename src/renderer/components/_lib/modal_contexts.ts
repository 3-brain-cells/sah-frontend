import { createContext } from 'react';

export const AboutModalContext = createContext({
    showAboutModal: false,
    setShowAboutModal: (showAboutModal: boolean) => {
        // eslint-disable-next-line no-console
        console.warn(`No context set for AboutModalContext\nsetShowAboutModal(${showAboutModal})`);
    },
});
