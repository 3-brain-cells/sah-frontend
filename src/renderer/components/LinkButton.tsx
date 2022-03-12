import styled from '@emotion/styled';

import { linkStyles } from './InlineLink';

const Styled = {
    LinkButton: styled.a`
        ${linkStyles}
    `,
};

/**
 * Creates a button that looks like a hyperlink
 */
export default Styled.LinkButton;
