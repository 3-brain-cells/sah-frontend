import React from "react";
import { EventTime, Location } from "../newtypes/voting";
import DoneButton from "../newcomponents/DoneButton";
import TimeVotingBlock from "../newcomponents/TimeVotingBlock";
import LocationVotingBlock from "../newcomponents/LocationVotingBlock";
import DemoOuter from "../newcomponents/DemoOuter";

export type VotingDemo2Props = {
  times: EventTime[];
  locations: Location[];
  className?: string;
  style?: React.CSSProperties;
};

export default function VotingDemo2({
  times,
  locations,
  style,
  className,
}: VotingDemo2Props) {
  return (
    <DemoOuter className={className} style={style}>
      <TimeVotingBlock times={times} style={{ marginBottom: 24 }} />
      <LocationVotingBlock locations={locations} />
      <DoneButton />
    </DemoOuter>
  );
}
