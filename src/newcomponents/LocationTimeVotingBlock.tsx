import React, { useMemo, useState } from "react";
import styled from "@emotion/styled";
import { EventTime, Location } from "../newtypes/voting";
import VotingBlock from "./VotingBlock";
import LocationTimeVotingCard from "./LocationTimeVotingCard";

const Styled = {
  LocationTimeVotingCard: styled(LocationTimeVotingCard)`
    &:not(:last-child) {
      margin-bottom: 8px;
    }
  `,
};

export type LocationTimeVotingBlockProps = {
  data: EventTime[];
  className?: string;
  style?: React.CSSProperties;
};

interface LocationTimePair {
  location: Location;
  time: EventTime;
}

export default function LocationVotingBlock({
  data,
  style,
  className,
}: LocationTimeVotingBlockProps) {
  const locations = useMemo<LocationTimePair[]>(() => {
    const locations = new Map<string, LocationTimePair>();
    for (const eventTime of data) {
      for (const location of eventTime.bestLocations) {
        let r = (Math.random() + 1).toString(36).substring(7);
        let pair = { location: location, time: eventTime };
        locations.set(r, pair);
        // if (!locations.has(location.name)) {

        //   locations.set(location.name, location);
        // }
      }
    }
    return Array.from(locations.values());
  }, [data]);

  const [votingState, setVotingState] = useState<Record<string, boolean>>({});
  const makeTimeID = (time: EventTime): string =>
    `${time.start.toISOString()}-${time.end.toISOString()}`;

  type Time = Omit<EventTime, "bestLocations">;

  return (
    <VotingBlock
      title="Vote on time and location"
      style={style}
      className={className}
    >
      {locations.map((location) => {
        const id = `${makeTimeID(location.time)} ${location.location.name}`;
        // remove the location from the time

        return (
          <Styled.LocationTimeVotingCard
            key={id}
            location={location.location}
            time={location.time}
            selected={votingState[id] ?? false}
            onClick={() => {
              setVotingState((prev) => ({
                ...prev,
                [id]: !prev[id],
              }));
            }}
          />
          // <Styled.TimeVotingCard
          //   key={id}
          //   time={time}
          //   selected={votingState[id] ?? false}
          //   onClick={() => {
          //     setVotingState((prev) => ({
          //       ...prev,
          //       [id]: !prev[id],
          //     }));
          //   }}
          // />
        );
      })}
    </VotingBlock>
  );
}
