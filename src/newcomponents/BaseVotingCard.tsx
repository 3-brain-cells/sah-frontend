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
    padding: 8px;

    &[data-selected="true"] {
      background-color: ${rgba(lighten(0.2, colors.secondary), 0.2)};
    }
  `,
  CardCheckbox: styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-left: 8px;
  `,
  CardContents: styled.div`
    text-align: left;
    padding-left: 16px;
    flex-grow: 1;
  `,
};

export type BaseVotingCardProps = {
  children: React.ReactNode;
  selected: boolean;
  onClick: () => void;
  className?: string;
  style?: React.CSSProperties;
};

export default function BaseVotingCard({
  children,
  selected,
  onClick,
  className,
  style,
}: BaseVotingCardProps) {
  return (
    <Styled.BaseVotingCard
      className={className}
      style={style}
      onClick={onClick}
      data-selected={selected.toString()}
    >
      <Styled.CardCheckbox>
        <Checkbox selected={selected} style={{ pointerEvents: "none" }} />
      </Styled.CardCheckbox>
      <Styled.CardContents>{children}</Styled.CardContents>
    </Styled.BaseVotingCard>
  );
}
