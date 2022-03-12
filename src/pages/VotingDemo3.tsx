import React from "react";
import { EventTime } from "../newtypes/voting";
import DoneButton from "../newcomponents/DoneButton";
import TimeVotingBlock from "../newcomponents/TimeVotingBlock";
import LocationVotingBlock from "../newcomponents/LocationVotingBlock";
import DemoOuter from "../newcomponents/DemoOuter";
import { Routes, Route, useNavigate } from "react-router-dom";

export type VotingDemo3Props = {
  data: EventTime[];
  className?: string;
  style?: React.CSSProperties;
};

export default function VotingDemo3({
  data,
  style,
  className,
}: VotingDemo3Props) {
  let navigate = useNavigate();
  return (
    <DemoOuter className={className} style={style}>
      <Routes>
        <Route
          path="time"
          element={
            <>
              <TimeVotingBlock data={data} />
              <DoneButton text="Next" onClick={() => navigate("location")} />
            </>
          }
        />
        <Route
          path="location"
          element={
            <>
              <LocationVotingBlock data={data} />
              <DoneButton />
            </>
          }
        />
      </Routes>
    </DemoOuter>
  );
}
