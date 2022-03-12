import React from "react";
import styled from "@emotion/styled";
import { colors } from "../components/_lib/colors";
import Heading from "../components/Heading";
import PageTitle from "../components/PageTitle";
import { EventTime } from "../newtypes/voting";

const Styled = {
  VotingDemo3: styled.div`
    background-color: ${colors.background20};
    padding: 4px 8px;
    height: 100vh;
    color: ${colors.foreground};
    text-align: left;
  `,
};

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
  return (
    <Styled.VotingDemo3 className={className} style={style}>
      <PageTitle>Vote on event time</PageTitle>
      <Heading>Vote on event time</Heading>
      Voting demo 3
    </Styled.VotingDemo3>
  );
}
