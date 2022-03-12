import React from "react";
import styled from "@emotion/styled";
import { Location } from "../newtypes/voting";
import BaseVotingCard from "./BaseVotingCard";

const Styled = {};

export type LocationVotingCardProps = {
  location: Location;
  selected: boolean;
  onClick: () => void;
  className?: string;
  style?: React.CSSProperties;
};

export default function LocationVotingCard({
  location,
  selected,
  onClick,
  className,
  style,
}: LocationVotingCardProps) {
  return (
    <BaseVotingCard
      className={className}
      style={style}
      onClick={onClick}
      selected={selected}
    >
      TODO implement
      {location.name}
    </BaseVotingCard>
  );
}
