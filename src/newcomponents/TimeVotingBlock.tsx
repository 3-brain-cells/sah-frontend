import React, { useMemo, useState } from "react";
import styled from "@emotion/styled";
import { EventTime } from "../newtypes/voting";
import VotingBlock from "./VotingBlock";
import TimeVotingCard from "./TimeVotingCard";

const Styled = {
  TimeVotingCard: styled(TimeVotingCard)`
    &:not(:last-child) {
      margin-bottom: 8px;
    }
  `,
};

export type TimeVotingBlockProps = {
  data: EventTime[];
  className?: string;
  style?: React.CSSProperties;
};

type Time = Omit<EventTime, "bestLocations">;

export default function TimeVotingBlock({
  data,
  style,
  className,
}: TimeVotingBlockProps) {
  const times = useMemo<Time[]>(
    () => data.map(({ bestLocations, ...time }) => time),
    [data]
  );

  const [votingState, setVotingState] = useState<Record<string, boolean>>({});
  const makeTimeID = (time: Time): string =>
    `${time.start.toISOString()}-${time.end.toISOString()}`;

  return (
    <VotingBlock title="Vote on event time" style={style} className={className}>
      {times.map((time) => {
        const id = makeTimeID(time);
        return (
          <Styled.TimeVotingCard
            key={id}
            time={time}
            selected={votingState[id] ?? false}
            onClick={() => {
              setVotingState((prev) => ({
                ...prev,
                [id]: !prev[id],
              }));
            }}
          />
        );
      })}
    </VotingBlock>
  );
}
