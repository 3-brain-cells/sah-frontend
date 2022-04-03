import React from "react";
import styled from "@emotion/styled";
import Checkbox from "../components/Checkbox";
import { colors } from "../components/_lib/colors";
import { rgba, lighten } from "polished";

const Styled = {
  BaseVotingCard: styled.div`
    user-select: none;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;

    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 8px;

    &[data-selected="true"] {
      background-color: ${rgba(lighten(0.2, colors.secondary), 0.2)};
    }

    &[data-disabled="true"] {
      opacity: 0.5;
      pointer-events: none;
    }
  `,
  CardCheckbox: styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 8px;
    padding-left: 16px;
  `,
  CardContents: styled.div`
    text-align: left;
    flex-grow: 1;

    &:not([data-no-padding="true"]) {
      padding: 8px;
    }
  `,
};

export type BaseVotingCardProps = {
  children: React.ReactNode;
  noPadding?: boolean;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

export default function BaseVotingCard({
  children,
  noPadding = false,
  selected,
  onClick,
  disabled = false,
  className,
  style,
}: BaseVotingCardProps) {
  return (
    <Styled.BaseVotingCard
      className={className}
      style={style}
      onClick={onClick}
      data-selected={selected.toString()}
      data-disabled={disabled.toString()}
    >
      <Styled.CardCheckbox>
        <Checkbox selected={selected} style={{ pointerEvents: "none" }} />
      </Styled.CardCheckbox>
      <Styled.CardContents data-no-padding={noPadding.toString()}>
        {children}
      </Styled.CardContents>
    </Styled.BaseVotingCard>
  );
}
