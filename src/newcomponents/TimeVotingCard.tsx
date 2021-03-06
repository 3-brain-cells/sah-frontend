import React from "react";
import styled from "@emotion/styled";
import { EventTime, User } from "../newtypes/types";
import Heading from "../components/Heading";
import BaseText from "../components/BaseText";
import { FaChevronDown } from "react-icons/fa";
import { colors } from "../components/_lib/colors";
import BaseVotingCard from "./BaseVotingCard";

const Styled = {
  AvailabilityText: styled(BaseText)`
    margin-bottom: 8px;
  `,
  AvailabilityDropdown: styled.div`
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 8px;
  `,
  AvailabilityList: styled.div`
    padding: 4px 12px 8px;
  `,
  AvailabilityHeader: styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 8px;
    cursor: pointer;
  `,
  DropdownButton: styled.button`
    /* Create a circle button with a white icon */
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.2);
    color: ${colors.foreground};
    outline: none;
    border: none;

    font-size: 16px;

    &:hover {
      background-color: rgba(0, 0, 0, 0.4);
    }

    &:active {
      background-color: rgba(0, 0, 0, 0.6);
    }
  `,
  Person: styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;

    &:not(:last-child) {
      margin-bottom: 4px;
    }
  `,
  PersonIcon: styled.div`
    width: 16px;
    height: 16px;
    border-radius: 50%;
  `,
  PersonName: styled(BaseText)`
    margin-left: 8px;
    flex-grow: 1;
  `,
  ProfileRow: styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    padding-left: 8px;
  `,
  Profile: styled.div`
    width: 24px;
    height: 24px;
    border-radius: 50%;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.2);
    margin-left: -8px;
  `,
  MorePeople: styled.div`
    width: 24px;
    height: 24px;
    border-radius: 50%;
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.2);
    background-color: black;
    font-size: 12px;
    margin-left: -8px;
    display: flex;
    align-items: center;
    justify-content: center;
  `,
};

export type TimeVotingCardProps = {
  time: Omit<EventTime, "bestLocations">;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

export default function TimeVotingCard({
  time,
  selected,
  onClick,
  disabled = false,
  className,
  style,
}: TimeVotingCardProps) {
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
    time.users.length === 1
      ? `${time.users.length} person is available`
      : `${time.users.length} people are available`;

  return (
    <BaseVotingCard
      className={className}
      style={style}
      onClick={onClick}
      selected={selected}
      disabled={disabled}
    >
      <Heading>
        {dateShort} {timeStart} - {timeEnd}
      </Heading>
      <Styled.AvailabilityText>{availabilityText}</Styled.AvailabilityText>
      <AvailabilityDropdown people={time.users} />
    </BaseVotingCard>
  );
}

// ? ==============
// ? Sub-components
// ? ==============

type AvailabilityDropdownProps = {
  people: User[];
  className?: string;
  style?: React.CSSProperties;
};

function AvailabilityDropdown({
  style,
  className,
  people,
}: AvailabilityDropdownProps) {
  const [open, setOpen] = React.useState(false);

  // Display the first 2 people
  // with stacked profile circles,
  // and if there are more,
  // show a '+' sign with the number of remaining people
  const peopleToDisplay = people.slice(0, 2);
  const remainingPeople = people.length - peopleToDisplay.length;
  const peopleHeader: React.ReactNode[] = [];
  peopleToDisplay.forEach((person) => {
    peopleHeader.push(
      <Styled.Profile
        key={person.name}
        style={{ backgroundColor: person.color }}
      />
    );
  });
  if (remainingPeople > 0) {
    peopleHeader.push(
      <Styled.MorePeople key="#===-more-people">
        +{remainingPeople}
      </Styled.MorePeople>
    );
  }

  return (
    <Styled.AvailabilityDropdown style={style} className={className}>
      <Styled.AvailabilityHeader
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation();
          e.preventDefault();
          setOpen(!open);
        }}
      >
        <Styled.ProfileRow>{peopleHeader}</Styled.ProfileRow>
        <Styled.DropdownButton
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          <FaChevronDown />
        </Styled.DropdownButton>
      </Styled.AvailabilityHeader>
      {open && (
        <Styled.AvailabilityList>
          {people.map((person) => (
            <Styled.Person key={person.name}>
              <Styled.PersonIcon style={{ backgroundColor: person.color }} />
              <Styled.PersonName>{person.name}</Styled.PersonName>
            </Styled.Person>
          ))}
        </Styled.AvailabilityList>
      )}
    </Styled.AvailabilityDropdown>
  );
}
