import React from 'react';
import styled from '@emotion/styled';

const Styled = {
    Container: styled.div`
        padding: 16px 32px;
    `,
};

function SettingsPage(): React.ReactElement {
    return (
        <Styled.Container>
            <p>Settings Page</p>
        </Styled.Container>
    );
}

export default SettingsPage;
