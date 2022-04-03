import React from "react";
import styled from "@emotion/styled";
import { Location } from "../newtypes/types";
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
  selectedLocations: number[];
  onChangeSelectedLocations: (next: number[]) => void;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

export default function LocationVotingBlock({
  locations,
  selectedLocations,
  onChangeSelectedLocations,
  disabled = false,
  style,
  className,
}: LocationVotingBlockProps) {
  return (
    <VotingBlock title="Vote on location" style={style} className={className}>
      {locations.map((location, i) => {
        return (
          <Styled.LocationVotingCard
            key={location.name}
            location={location}
            selected={selectedLocations.includes(i) ?? false}
            onClick={() => {
              if (selectedLocations.includes(i)) {
                onChangeSelectedLocations(
                  selectedLocations.filter((x) => x !== i)
                );
              } else {
                onChangeSelectedLocations([...selectedLocations, i]);
              }
            }}
            disabled={disabled}
          />
        );
      })}
    </VotingBlock>
  );
}
