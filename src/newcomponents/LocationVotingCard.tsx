import React from "react";
import styled from "@emotion/styled";

const Styled = {
  LocationVotingCard: styled.div``,
};

export type LocationVotingCardProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

export default function LocationVotingCard({
  style,
  className,
  children,
}: LocationVotingCardProps) {
  return (
    <Styled.LocationVotingCard className={className} style={style}>
      {children}
    </Styled.LocationVotingCard>
  );
}
