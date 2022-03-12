import React from "react";
import { EventTime } from "../newtypes/voting";
import DoneButton from "../newcomponents/DoneButton";
import TimeVotingBlock from "../newcomponents/TimeVotingBlock";
import LocationVotingBlock from "../newcomponents/LocationVotingBlock";
import DemoOuter from "../newcomponents/DemoOuter";

export type VotingDemo2Props = {
  data: EventTime[];
  className?: string;
  style?: React.CSSProperties;
};

export default function VotingDemo2({
  data,
  style,
  className,
}: VotingDemo2Props) {
  return (
    <DemoOuter className={className} style={style}>
      <TimeVotingBlock data={data} style={{ marginBottom: 24 }} />
      <LocationVotingBlock data={data} />
      <DoneButton />
    </DemoOuter>
  );
}
