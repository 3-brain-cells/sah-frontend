import React from "react";
import styled from "@emotion/styled";
import PageTitle from "../components/PageTitle";
import { EventTime, Location } from "../newtypes/voting";
import DoneButton from "../newcomponents/DoneButton";

const Styled = {
  VotingDemo1: styled.div`
    display: flex;
    flex-direction: column;
    padding: 20px;
  `,
};

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
    // take time and location pairs and create list

    <Styled.VotingDemo1 className={className} style={style}>
      <PageTitle>Vote on Hangout</PageTitle>

      <DoneButton></DoneButton>
    </Styled.VotingDemo1>
  );
}
