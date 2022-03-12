import React from "react";
import styled from "@emotion/styled";
import { EventTime, Person } from "../newtypes/voting";
import Heading from "../components/Heading";
import BaseText from "../components/BaseText";
import Checkbox from "../components/Checkbox";
import {
  FaCaretDown,
  FaChevronCircleDown,
  FaChevronDown,
} from "react-icons/fa";
import { colors } from "../components/_lib/colors";

const Styled = {
  TimeVotingCard: styled.div`
    user-select: none;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;

    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 8px;
  `,
  CardCheckbox: styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-left: 8px;
  `,
  CardContents: styled.div`
    text-align: left;
    padding-left: 16px;
    flex-grow: 1;
  `,
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
  className?: string;
  style?: React.CSSProperties;
};

export default function TimeVotingCard({
  time,
  selected,
  onClick,
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
    time.available.length === 1
      ? `${time.available.length} person is available`
      : `${time.available.length} people are available`;

  return (
    <Styled.TimeVotingCard
      className={className}
      style={style}
      onClick={onClick}
    >
      <Styled.CardCheckbox>
        <Checkbox selected={selected} style={{ pointerEvents: "none" }} />
      </Styled.CardCheckbox>
      <Styled.CardContents>
        <Heading>
          {dateShort} {timeStart} - {timeEnd}
        </Heading>
        <Styled.AvailabilityText>{availabilityText}</Styled.AvailabilityText>
        <AvailabilityDropdown people={time.available} />
      </Styled.CardContents>
    </Styled.TimeVotingCard>
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
        style={{ backgroundColor: person.profileColor }}
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
              <Styled.PersonIcon
                style={{ backgroundColor: person.profileColor }}
              />
              <Styled.PersonName>{person.name}</Styled.PersonName>
            </Styled.Person>
          ))}
        </Styled.AvailabilityList>
      )}
    </Styled.AvailabilityDropdown>
  );
}
