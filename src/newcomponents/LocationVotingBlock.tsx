import React, { useState } from "react";
import styled from "@emotion/styled";
import { Location } from "../newtypes/voting";
import VotingBlock from "./VotingBlock";
import LocationVotingCard from "./LocationVotingCard";

const Styled = {
  LocationVotingCard: styled(LocationVotingCard)`
    &:not(:last-child) {
      margin-bottom: 8px;
    }
  `,
};

export type LocationVotingBlockProps = {
  locations: Location[];
  className?: string;
  style?: React.CSSProperties;
};

export default function LocationVotingBlock({
  locations,
  style,
  className,
}: LocationVotingBlockProps) {
  const [votingState, setVotingState] = useState<Record<string, boolean>>({});

  return (
    <VotingBlock title="Vote on location" style={style} className={className}>
      {locations.map((location) => {
        return (
          <Styled.LocationVotingCard
            key={location.name}
            location={location}
            selected={votingState[location.name] ?? false}
            onClick={() => {
              setVotingState((prev) => ({
                ...prev,
                [location.name]: !prev[location.name],
              }));
            }}
          />
        );
      })}
    </VotingBlock>
  );
}
