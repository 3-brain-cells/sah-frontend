import React from "react";
import { EventTime } from "../newtypes/voting";
import DoneButton from "../newcomponents/DoneButton";
import LocationTimeVotingBlock from "../newcomponents/LocationTimeVotingBlock";
import DemoOuter from "../newcomponents/DemoOuter";

export type VotingDemo1Props = {
  data: EventTime[];
  className?: string;
  style?: React.CSSProperties;
};

export default function VotingDemo1({
  data,
  style,
  className,
}: VotingDemo1Props) {
  return (
    <DemoOuter className={className} style={style}>
      <LocationTimeVotingBlock data={data} style={{ marginBottom: 24 }} />
      <DoneButton />
    </DemoOuter>
  );
}
