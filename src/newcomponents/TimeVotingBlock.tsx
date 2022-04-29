import React from "react";
import styled from "@emotion/styled";
import { EventTime } from "../newtypes/types";
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
  selectedTimes: number[];
  onChangeSelectedTimes: (next: number[]) => void;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

function fixDate(date: Date): Date {
  return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
}

export default function TimeVotingBlock({
  times,
  selectedTimes,
  onChangeSelectedTimes,
  disabled = false,
  style,
  className,
}: TimeVotingBlockProps) {
  const makeTimeID = (time: EventTime): string =>
    `${fixDate(time.start).toISOString()}-${fixDate(time.end).toISOString()}`;

  return (
    <VotingBlock title="Vote on event time" style={style} className={className}>
      {times.map((time, i) => {
        const id = makeTimeID(time);
        return (
          <Styled.TimeVotingCard
            key={id}
            time={time}
            selected={selectedTimes.includes(i)}
            onClick={() => {
              if (selectedTimes.includes(i)) {
                onChangeSelectedTimes(selectedTimes.filter((x) => x !== i));
              } else {
                onChangeSelectedTimes([...selectedTimes, i]);
              }
            }}
            disabled={disabled}
          />
        );
      })}
    </VotingBlock>
  );
}
