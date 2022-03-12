import React from 'react';
import styled from '@emotion/styled';

const Styled = {
    Container: styled.div`
        padding: 16px 32px;
    `,
};

function AccountsPage(): React.ReactElement {
    return (
        <Styled.Container>
            <p>Accounts Page</p>
        </Styled.Container>
    );
}

export default AccountsPage;
