import React, { useEffect, useState } from "react";
import PageOuter from "../newcomponents/PageOuter";
import { useParams } from "react-router-dom";
import { getUserID, redirectToLogin } from "../oauth";
import {
  GetAvailabilityResponseBody,
  DayAvailability,
  API_ROOT,
  PutAvailabilityRequestBody,
} from "../newtypes/types";
import DoneButton from "../newcomponents/DoneButton";
import AvailabilityGrid from "../newcomponents/AvailabilityGrid";
import styled from "@emotion/styled";
import PageTitle from "../components/PageTitle";

const Styled = {
  PageOuter: styled(PageOuter)`
    display: flex;
    flex-direction: column;

    & > * {
      flex: 1;
    }
  `,
  Title: styled(PageTitle)`
    font-size: 1.6rem;
    margin-bottom: 8px;
  `,
};

export type AvailabilityPageProps = {
  className?: string;
  style?: React.CSSProperties;
};

type AvailabilityInfo = Omit<GetAvailabilityResponseBody, "days">;

function makeFakeData(): { days: DayAvailability[]; info: AvailabilityInfo } {
  // Get the beginning of today
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const info = {
    earliest_date: today.toISOString(),
    // Set the latest date to be 7 days from today
    latest_date: new Date(
      today.getTime() + 7 * 24 * 60 * 60 * 1000
    ).toISOString(),
    start_time_hour: 9,
    start_time_minute: 0,
    end_time_hour: 17,
    end_time_minute: 30,
  };

  const days: DayAvailability[] = [];
  for (let i = 0; i < 7; i++) {
    days.push({
      date: new Date(today.getTime() + i * 24 * 60 * 60 * 1000).toISOString(),
      available_blocks: [
        { start_hour: 9, start_minute: 30, end_hour: 10, end_minute: 0 },
        { start_hour: 10, start_minute: 0, end_hour: 10, end_minute: 30 },
        { start_hour: 10, start_minute: 30, end_hour: 11, end_minute: 0 },
      ],
    });
  }

  return { days, info };
}

export default function AvailabilityPage({
  style,
  className,
}: AvailabilityPageProps) {
  const params = useParams();
  const eventId = params.eventId ?? "";

  const userID = getUserID();
  useEffect(() => {
    if (userID === null) {
      // Redirect to the oauth flow
      redirectToLogin({ src: "availability", event_id: eventId });
    }
  }, [eventId, userID]);

  // Once the user ID is available, fetch the info
  // & previously-submitted availability, if any
  const [info, setInfo] = useState<AvailabilityInfo | null>(null);
  const [days, setDays] = useState<DayAvailability[]>([]);
  const [hadPriorAvailability, setHadPriorAvailability] = useState(false);
  useEffect(() => {
    async function inner() {
      if (userID !== null) {
        try {
          // const response = await fetch(
          //   `${API_ROOT}/api/v1/events/${eventId}/availability/${userID}}`,
          //   { method: "GET" }
          // );
          // const { days: newDays, ...newInfo } =
          //   (await response.json()) as GetAvailabilityResponseBody;

          const { info: newInfo, days: newDays } = makeFakeData();
          setInfo(newInfo);
          setDays(newDays ?? []);
          setHadPriorAvailability(newDays !== null);
        } catch (e) {
          // Do nothing
        }
      }
    }
    inner();
  }, [eventId, userID]);

  const canSubmit =
    info !== null &&
    days.length > 0 &&
    days.every((day) => day.available_blocks.length > 0);

  // Handle submitting before closing
  const [isSubmitting, setIsSubmitting] = useState(false);
  const onSubmit = async () => {
    if (canSubmit) {
      setIsSubmitting(true);
      try {
        const body: PutAvailabilityRequestBody = {
          days: days ?? [],
        };

        // Ignore errors
        await fetch(
          `${API_ROOT}/api/v1/events/${eventId}/availability/${userID}}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          }
        );
      } catch (ex) {
        // Ignore errors
      }
      setIsSubmitting(false);
      window.close();
    }
  };

  return (
    <Styled.PageOuter className={className} style={style}>
      {info !== null && (
        <>
          <Styled.Title>
            {hadPriorAvailability ? "Edit" : "Enter"} availability
          </Styled.Title>
          <AvailabilityGrid
            state={days}
            onChange={setDays}
            earliestDate={new Date(info.earliest_date)}
            latestDate={new Date(info.latest_date)}
            startTimeHour={info.start_time_hour}
            startTimeMinute={info.start_time_minute}
            endTimeHour={info.end_time_hour}
            endTimeMinute={info.end_time_minute}
          />
        </>
      )}
      <DoneButton
        onClick={onSubmit}
        text="Submit"
        disabled={!canSubmit || isSubmitting}
      />
    </Styled.PageOuter>
  );
}
