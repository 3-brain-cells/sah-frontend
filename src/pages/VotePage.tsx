import React, { useEffect } from "react";
import DemoOuter from "../newcomponents/DemoOuter";
import { useParams } from "react-router-dom";
import DoneButton from "../newcomponents/DoneButton";
import LocationVotingBlock from "../newcomponents/LocationVotingBlock";
import TimeVotingBlock from "../newcomponents/TimeVotingBlock";
import { EventTime } from "../newtypes/voting";
import { API_ROOT } from "../newtypes/api";

export type VotePageProps = {
  className?: string;
  style?: React.CSSProperties;
};

export default function VotePage({ style, className }: VotePageProps) {
  const params = useParams();
  const eventId = params.eventId ?? "";

  // Fetch times and locations from the API
  const [times, setTimes] = React.useState<EventTime[]>([]);
  const [locations, setLocations] = React.useState<Location[]>([]);
  useEffect(() => {
    async function inner() {
      try {
        const response = await fetch(
          `${API_ROOT}/events/${eventId}/vote_options`,
          { method: "GET" }
        );
        const { times, locations } = await response.json();
        setTimes(times);
        setLocations(locations);
      } catch (e) {
        // Do nothing
      }
    }
    inner();
  }, [eventId]);

  // State
  const [selectedTimes, setSelectedTimes] = React.useState<number[]>([]);
  const [selectedLocations, setSelectedLocations] = React.useState<string[]>(
    []
  );
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const canSubmit =
    !isSubmitting && selectedTimes.length > 0 && selectedLocations.length > 0;
  const onSubmit = async () => {
    setIsSubmitting(true);
    // TODO implement
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
  };

  return (
    <DemoOuter className={className} style={style}>
      <TimeVotingBlock
        times={times}
        style={{ marginBottom: 24 }}
        selectedTimes={selectedTimes}
        setSelectedTimes={setSelectedTimes}
      />
      <LocationVotingBlock
        locations={locations}
        selectedLocations={selectedLocations}
        setSelectedLocations={setSelectedLocations}
      />
      <DoneButton onClick={onSubmit} text="Submit" disabled={!canSubmit} />
    </DemoOuter>
  );
}
