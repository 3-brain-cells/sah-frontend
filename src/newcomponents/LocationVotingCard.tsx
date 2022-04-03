import React from "react";
import styled from "@emotion/styled";
import { Location } from "../newtypes/types";
import BaseVotingCard from "./BaseVotingCard";
import Heading from "../components/Heading";
import { colors } from "../components/_lib/colors";
import { FaStar } from "react-icons/fa";

const Styled = {
  Layout: styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: stretch;
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

    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
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
};

export type LocationVotingCardProps = {
  location: Location;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

export default function LocationVotingCard({
  location,
  selected,
  onClick,
  disabled = false,
  className,
  style,
}: LocationVotingCardProps) {
  return (
    <BaseVotingCard
      className={className}
      style={style}
      onClick={onClick}
      selected={selected}
      noPadding
      disabled={disabled}
    >
      <Styled.Layout>
        <Styled.LocationText>
          <Styled.Heading>{location.name}</Styled.Heading>
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
    </BaseVotingCard>
  );
}
