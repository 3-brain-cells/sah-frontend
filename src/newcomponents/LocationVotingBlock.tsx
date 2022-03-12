import React, { useMemo, useState } from "react";
import styled from "@emotion/styled";
import { EventTime, Location } from "../newtypes/voting";
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
  data: EventTime[];
  className?: string;
  style?: React.CSSProperties;
};

export default function LocationVotingBlock({
  data,
  style,
  className,
}: LocationVotingBlockProps) {
  const locations = useMemo<Location[]>(() => {
    const locations = new Map<string, Location>();
    for (const eventTime of data) {
      for (const location of eventTime.bestLocations) {
        if (!locations.has(location.name)) {
          locations.set(location.name, location);
        }
      }
    }
    return Array.from(locations.values());
  }, [data]);

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
