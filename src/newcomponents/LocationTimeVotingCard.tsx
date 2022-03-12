import React from "react";
import styled from "@emotion/styled";
import { EventTime, Person, Location } from "../newtypes/voting";
import Heading from "../components/Heading";
import BaseText from "../components/BaseText";
import Checkbox from "../components/Checkbox";

const Styled = {
  TimeLocationVotingCard: styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  `,
  CardCheckbox: styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  `,
  CardContents: styled.div`
    text-align: left;
  `,
  AvailabilityDropdown: styled.div``,
};

export type TimeLocationVotingCardProps = {
  time: Omit<EventTime, "bestLocations">;
  selected: boolean;
  onClick: () => void;
  className?: string;
  style?: React.CSSProperties;
};

export default function TimeLocationVotingCard({
  time,
  selected,
  onClick,
  className,
  style,
}: TimeLocationVotingCardProps) {
  // Format the date as "M/D"
  const dateShort = time.start.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  // Format the start and end times as
  // H:MM AM/PM
  const timeStart = time.start.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  const timeEnd = time.end.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  // Format the availability as
  // either '1 person is available'
  // or '2 people are available'
  const availabilityText =
    time.available.length === 1
      ? `${time.available.length} person is available`
      : `${time.available.length} people are available`;

  return (
    <Styled.TimeLocationVotingCard
      className={className}
      style={style}
      // onClick={onClick}
    >
      <Styled.CardCheckbox>
        <Checkbox selected={selected} onClick={onClick} disabled={false} />
      </Styled.CardCheckbox>
      <Styled.CardContents>
        <Heading>
          {dateShort} {timeStart} - {timeEnd}
        </Heading>
        <BaseText>{availabilityText}</BaseText>
        <AvailabilityDropdown people={time.available} />
      </Styled.CardContents>
    </Styled.TimeLocationVotingCard>
  );
}

// ? ==============
// ? Sub-components
// ? ==============

type AvailabilityDropdownProps = {
  people: Person[];
  className?: string;
  style?: React.CSSProperties;
};

function AvailabilityDropdown({
  style,
  className,
  people,
}: AvailabilityDropdownProps) {
  // TODO implement
  return (
    <Styled.AvailabilityDropdown className={className} style={style}>
      Hi
    </Styled.AvailabilityDropdown>
  );
}
