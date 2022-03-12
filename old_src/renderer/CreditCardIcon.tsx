import React from 'react';
import creditCardType from 'credit-card-type';
import styled from '@emotion/styled';
import visa from 'payment-icons/min/flat/visa.svg';
import amex from 'payment-icons/min/flat/amex.svg';
import diners from 'payment-icons/min/single/diners.svg';
import discover from 'payment-icons/min/single/discover.svg';
import elo from 'payment-icons/min/single/elo.svg';
import hipercard from 'payment-icons/min/flat/hipercard.svg';
import jcb from 'payment-icons/min/single/jcb.svg';
import maestro from 'payment-icons/min/single/maestro.svg';
import mastercard from 'payment-icons/min/single/mastercard.svg';
import unionpay from 'payment-icons/min/single/unionpay.svg';

const Styled = {
    IconWrapper: styled.div`
        height: 24px;
        width: 24px;
        display: inline-flex;
        align-items: center;
        justify-content: center;

        & svg {
            position: relative;
            width: auto;
            height: 2rem;
        }
    `,
};

const ccTypes: Record<string, React.FC<React.SVGAttributes<SVGElement>>> = {
    visa,
    mastercard,
    jcb,
    unionpay,
    discover,
    dinersclub: diners,
    'american-express': amex,
    hipercard,
    elo,
    maestro,
};

export type CreditCardIconProps = {
    card: string;
    className?: string;
    style?: React.CSSProperties;
};

/**
 * Renders an icon for a credit card based on its number.
 * If no icon can be matched, then it renders an empty space
 * that takes up the same amount of horizontal space as the icons.
 */
export default function CreditCardIcon({
    card,
    className,
    style,
}: CreditCardIconProps): React.ReactElement {
    const match = creditCardType(card.replace(/\D/g, ''));
    let ccType = '';
    let label = '';
    if (match.length > 0) {
        ccType = match[0].type;
        label = match[0].niceType;
    }

    let Icon = null;
    const isSupported = Object.prototype.hasOwnProperty.call(ccTypes, ccType);
    if (ccType !== '' && isSupported) Icon = ccTypes[ccType];

    return (
        <Styled.IconWrapper
            className={className}
            style={style}
            aria-label={isSupported ? label : undefined}
        >
            {Icon !== null && <Icon />}
        </Styled.IconWrapper>
    );
}
