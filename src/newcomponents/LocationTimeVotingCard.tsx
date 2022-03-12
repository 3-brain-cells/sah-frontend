import React from "react";
import styled from "@emotion/styled";
import { EventTime, Location, Person } from "../newtypes/voting";
import BaseVotingCard from "./BaseVotingCard";
import BaseText from "../components/BaseText";
import Heading from "../components/Heading";
import { FaChevronDown } from "react-icons/fa";
import { colors } from "../components/_lib/colors";
import { FaStar } from "react-icons/fa";

const Styled = {
  Layout: styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: stretch;
    padding: 12px 8px;
    padding-bottom: 8px;
  `,
  LocationText: styled.div`
    flex-grow: 1;
    flex-shrink: 1;
    padding: 12px 8px;
  `,
  LocationIcon: styled.div`
    width: 120px;
    flex-grow: 0;
    flex-shrink: 0;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    border-radius: 8px;
  `,
  Heading: styled(Heading)`
    line-height: 1.2;
    margin-bottom: 4px;
  `,
  InfoRow: styled.div`
    margin-bottom: 4px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
  `,
  Address: styled.div`
    font-size: 0.9rem;
    color: ${colors["foreground-light"]};
  `,
  YelpLink: styled.a`
    font-style: normal;
    font-weight: normal;
    font-size: 15px;
    line-height: 22px;
    color: ${colors["secondary+10"]};
    opacity: 0.8;
    text-decoration: none;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
      opacity: 1;
    }

    margin-right: 16px;
  `,
  StarRating: styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: nowrap;

    margin-right: 16px;
    color: #fcff81;
  `,
  StarRatingIcon: styled(FaStar)`
    margin-right: 4px;
  `,
  StarRatingText: styled.p`
    margin: 0;
  `,
  Distance: styled.p`
    margin: 0;
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

export type LocationTimeVotingCardProps = {
  location: Location;
  time: EventTime;
  selected: boolean;
  onClick: () => void;
  className?: string;
  style?: React.CSSProperties;
};

export default function LocationTimeVotingCard({
  location,
  time,
  selected,
  onClick,
  className,
  style,
}: LocationTimeVotingCardProps) {
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

  const availabilityText =
    time.available.length === 1
      ? `${time.available.length} person is available`
      : `${time.available.length} people are available`;

  return (
    <BaseVotingCard
      className={className}
      style={style}
      onClick={onClick}
      selected={selected}
      noPadding
    >
      <Styled.Layout>
        <Styled.LocationText>
          <Styled.Heading>{location.name}</Styled.Heading>
          <Styled.Heading>
            {dateShort} {timeStart} - {timeEnd}
          </Styled.Heading>
          <Styled.InfoRow>
            <Styled.YelpLink
              href={location.yelpUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Yelp
            </Styled.YelpLink>
            <Styled.StarRating>
              <Styled.StarRatingIcon />
              <Styled.StarRatingText>
                {location.stars.toFixed(1)}
              </Styled.StarRatingText>
            </Styled.StarRating>
            <Styled.Distance>
              <strong>{location.distanceFromCurrentUser}</strong> mi away
            </Styled.Distance>
          </Styled.InfoRow>
          <Styled.Address>{location.address}</Styled.Address>
        </Styled.LocationText>
        <Styled.LocationIcon
          style={{ backgroundImage: `url(${location.previewImageUrl})` }}
        ></Styled.LocationIcon>
      </Styled.Layout>
      <Styled.AvailabilityText>{availabilityText}</Styled.AvailabilityText>
      <AvailabilityDropdown people={time.available} />
    </BaseVotingCard>
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
