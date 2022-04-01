import React, { useState } from "react";
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
  times: EventTime[];
  className?: string;
  style?: React.CSSProperties;
};

export default function TimeVotingBlock({
  times,
  style,
  className,
}: TimeVotingBlockProps) {
  const [votingState, setVotingState] = useState<Record<string, boolean>>({});
  const makeTimeID = (time: EventTime): string =>
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
