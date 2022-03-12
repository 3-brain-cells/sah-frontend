import React from 'react';
import styled from '@emotion/styled';

const Styled = {
    Container: styled.div`
        padding: 16px 32px;
    `,
};

function ProxiesPage(): React.ReactElement {
    return (
        <Styled.Container>
            <p>Proxies Page</p>
        </Styled.Container>
    );
}

export default ProxiesPage;
