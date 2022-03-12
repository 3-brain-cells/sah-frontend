import React, { useMemo, useState } from "react";
import styled from "@emotion/styled";
import { colors } from "../components/_lib/colors";
import PageTitle from "../components/PageTitle";
import { EventTime, Location } from "../newtypes/voting";
import TimeVotingCard from "../newcomponents/TimeVotingCard";
import DoneButton from "../newcomponents/DoneButton";

const Styled = {
  VotingDemo2: styled.div`
    background-color: ${colors.background20};
    padding: 4px 8px;
    height: 100vh;
    color: ${colors.foreground};
    text-align: left;
  `,
  TimeVotingCard: styled(TimeVotingCard)`
    &:not(:last-child) {
      margin-bottom: 8px;
    }
  `,
};

export type VotingDemo2Props = {
  data: EventTime[];
  className?: string;
  style?: React.CSSProperties;
};

type Time = Omit<EventTime, "bestLocations">;

export default function VotingDemo2({
  data,
  style,
  className,
}: VotingDemo2Props) {
  const times = useMemo<Time[]>(
    () => data.map(({ bestLocations, ...time }) => time),
    [data]
  );

  const [timesVotingState, setTimesVotingState] = useState<
    Record<string, boolean>
  >({});
  const makeTimeID = (time: Time): string =>
    `${time.start.toISOString()}-${time.end.toISOString()}`;

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

  return (
    <Styled.VotingDemo2 className={className} style={style}>
      <PageTitle>Vote on event time</PageTitle>
      {times.map((time) => {
        const id = makeTimeID(time);
        return (
          <Styled.TimeVotingCard
            key={id}
            time={time}
            selected={timesVotingState[id] ?? false}
            onClick={() => {
              setTimesVotingState((prev) => ({
                ...prev,
                [id]: !prev[id],
              }));
            }}
          />
        );
      })}
      <DoneButton />
    </Styled.VotingDemo2>
  );
}
