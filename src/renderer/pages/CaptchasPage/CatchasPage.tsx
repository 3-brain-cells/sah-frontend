import React from 'react';
import styled from '@emotion/styled';

const Styled = {
    Container: styled.div`
        padding: 16px 32px;
    `,
};

function CaptchasPage(): React.ReactElement {
    return (
        <Styled.Container>
            <p>Captchas Page</p>
        </Styled.Container>
    );
}

export default CaptchasPage;
