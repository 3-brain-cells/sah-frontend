import React from "react";
import styled from "@emotion/styled";
import PageTitle from "../components/PageTitle";

const Styled = {
  VotingBlock: styled.div``,
  Title: styled(PageTitle)`
    font-size: 1.6rem;
    margin-bottom: 8px;
  `,
};

export type VotingBlockProps = {
  children: React.ReactNode;
  title: string;
  className?: string;
  style?: React.CSSProperties;
};

export default function VotingBlock({
  style,
  className,
  children,
  title,
}: VotingBlockProps) {
  return (
    <Styled.VotingBlock className={className} style={style}>
      <Styled.Title>{title}</Styled.Title>
      {children}
    </Styled.VotingBlock>
  );
}
