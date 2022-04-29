import React, { useEffect, useState } from "react";
import PageOuter from "../newcomponents/PageOuter";
import { useParams } from "react-router-dom";
import DoneButton from "../newcomponents/DoneButton";
import LocationVotingBlock from "../newcomponents/LocationVotingBlock";
import TimeVotingBlock from "../newcomponents/TimeVotingBlock";
import {
  API_ROOT,
  PopulateEventBody,
  EventTime,
  Location,
  GetVoteOptionsBody,
} from "../newtypes/types";
import { getUserID, redirectToLogin } from "../oauth";

export type VotePageProps = {
  className?: string;
  style?: React.CSSProperties;
};

function fixDate(dateString: string): Date {
  const rawDate = new Date(dateString);
  return new Date(rawDate.getTime() + rawDate.getTimezoneOffset() * 60000);
}

export default function VotePage({ style, className }: VotePageProps) {
  const params = useParams();
  const eventId = params.eventId ?? "";

  const userID = getUserID();
  useEffect(() => {
    if (userID === null) {
      // Redirect to the oauth flow
      redirectToLogin({ src: "vote", event_id: eventId });
    }
  }, [eventId, userID]);

  // Fetch times and locations from the API
  const [times, setTimes] = useState<EventTime[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  useEffect(() => {
    async function inner() {
      try {
        const response = await fetch(
          `${API_ROOT}/api/v1/events/${eventId}/vote_options?user_id=${userID}`,
          { method: "GET" }
        );
        const { times, locations } =
          (await response.json()) as GetVoteOptionsBody;
        // Convert the time strings in times to Date objects
        setTimes(
          times.map(({ start, end, ...rest }) => ({
            start: fixDate(start),
            end: fixDate(end),
            ...rest,
          }))
        );
        setLocations(locations);
      } catch (e) {
        // Do nothing
      }
    }
    inner();
  }, [eventId, userID]);

  // State
  const [selectedTimes, setSelectedTimes] = useState<number[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<number[]>([]);

  const canSubmit = selectedTimes.length > 0 && selectedLocations.length > 0;

  // Handle submitting before closing
  const [isSubmitting, setIsSubmitting] = useState(false);
  const onSubmit = async () => {
    if (canSubmit) {
      setIsSubmitting(true);
      try {
        const body: PopulateEventBody = {
          user_id: userID ?? "",
          location_votes: selectedTimes,
          time_votes: selectedLocations,
        };

        // Ignore errors
        await fetch(`${API_ROOT}/api/v1/events/${eventId}/votes`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });
      } catch (ex) {
        // Ignore errors
      }
      setIsSubmitting(false);
      window.close();
    }
  };

  return (
    <PageOuter className={className} style={style}>
      <TimeVotingBlock
        times={times}
        style={{ marginBottom: 24 }}
        selectedTimes={selectedTimes}
        onChangeSelectedTimes={setSelectedTimes}
        disabled={isSubmitting}
      />
      <LocationVotingBlock
        locations={locations}
        selectedLocations={selectedLocations}
        onChangeSelectedLocations={setSelectedLocations}
        disabled={isSubmitting}
      />
      <DoneButton
        onClick={onSubmit}
        text="Submit"
        disabled={!canSubmit || isSubmitting}
      />
    </PageOuter>
  );
}
