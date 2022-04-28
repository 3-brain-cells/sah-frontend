import React, { useEffect } from "react";
import DemoOuter from "../newcomponents/DemoOuter";
import { useParams } from "react-router-dom";
import { getUserID, redirectToLogin } from "../oauth";
import {
  GetAvailabilityInfoResponseBody,
  API_ROOT,
  GetVoteOptionsBody,
} from "../newtypes/types";

const Styled = {};

export type AvailabilityPageProps = {
  className?: string;
  style?: React.CSSProperties;
};

export default function AvailabilityPage({
  style,
  className,
}: AvailabilityPageProps) {
  const params = useParams();
  const eventId = params.eventId ?? "";

  const userID = getUserID();
  console.log(`AvailabilityPage(): userID='${userID}' eventId='${eventId}'`);
  useEffect(() => {
    if (userID === null) {
      // Redirect to the oauth flow
      redirectToLogin({ src: "availability", event_id: eventId });
    }
  }, [eventId, userID]);

  // If the user ID is available, fetch the options & current state
  const [info, setInfo] = React.useState<AvailabilityInfo | null>(null);
  const [days, setDays] = React.useState<DayAvailability[]>([]);
  useEffect(() => {
    async function inner() {
      if (userID !== null) {
        try {
          const response = await fetch(
            `${API_ROOT}/api/v1/events/${eventId}/availability/${userID}}`,
            { method: "GET" }
          );
          const { info, days } =
            (await response.json()) as GetAvailabilityInfoResponseBody;
          setOptions(availabilityInfo);
        } catch (e) {
          // Do nothing
        }
      }
    }
    inner();
  }, [eventId, userID]);

  // TODO implement option painting
  // TODO implement retrieving previous vote

  return (
    <DemoOuter className={className} style={style}>
      {options === null ? "loading" : <>ready to display</>}
    </DemoOuter>
  );
}
