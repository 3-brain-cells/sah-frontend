import React, { useEffect, useMemo, useRef, useState } from "react";
import DemoOuter from "../newcomponents/DemoOuter";
import { useParams } from "react-router-dom";
import styled from "@emotion/styled";
import { SingleSelect, SelectItem } from "../components/Select";
import WithLabel from "../components/WithLabel";
import DoneButton from "../newcomponents/DoneButton";
import TextBox from "../components/TextBox";
import TextArea from "../components/TextArea";
import { API_ROOT, CreateEventBody, LocationCategory } from "../newtypes/types";
import { getUserID, redirectToLogin } from "../oauth";

const Styled = {
  Form: styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;

    & > * {
      margin-bottom: 16px;
    }
  `,
  SplitRow: styled.div``,
};

export type CreateEventPageProps = {
  className?: string;
  style?: React.CSSProperties;
};

// Create the time options based on the locale
// (between 8 AM and midnight)
const timeOptions: SelectItem[] = [];
for (let i = 8; i < 24; i++) {
  const addTime = (hour: number, minute: number) => {
    // Use Date.toLocaleTimeString to get the time in the current locale
    const time = new Date(0, 0, 0, hour, minute).toLocaleTimeString();
    timeOptions.push({
      // Pad minute with a leading zero if needed
      value: `${hour}:${minute < 10 ? "0" + minute : minute}`,
      label: time,
    });
  };
  addTime(i, 0);
  addTime(i, 30);
}

// Create the location category options statically
const locationCategoryOptions: { label: string; value: LocationCategory }[] = [
  { label: "General", value: "General" },
];

export default function CreateEventPage({
  style,
  className,
}: CreateEventPageProps) {
  const params = useParams();
  const eventId = params.eventId ?? "";

  const userID = getUserID();
  console.log(`CreateEventPage(): userID='${userID}' eventId='${eventId}'`);
  useEffect(() => {
    if (userID === null) {
      // Redirect to the oauth flow
      redirectToLogin({ src: "new", event_id: eventId });
    }
  }, [eventId, userID]);

  // Create the date options based on the current date
  const dateOptions = useMemo(() => {
    const date = new Date();
    const options = [];
    for (let i = 0; i < 7; i++) {
      const newDate = new Date(date);
      newDate.setDate(date.getDate() + i);
      options.push({
        label: newDate.toLocaleDateString(),
        value: newDate.toISOString(),
      });
    }
    return options;
  }, []);

  // Store controlled form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedEarliestDate, setEarliestDate] = useState<{
    label: string;
    value: string;
  } | null>(null);
  const [selectedLatestDate, setLatestDate] = useState<{
    label: string;
    value: string;
  } | null>(null);
  const [selectedStartTime, setStartTime] = useState<{
    label: string;
    value: string;
  } | null>(null);
  const [selectedEndTime, setEndTime] = useState<{
    label: string;
    value: string;
  } | null>(null);
  const [selectedLocationCategory, setLocationCategory] = useState<{
    label: string;
    value: string;
  } | null>(null);

  // Store a ref of the title textbox
  const titleTextbox = useRef<HTMLInputElement | null>(null);

  const canCreate =
    title.length > 0 &&
    selectedEarliestDate != null &&
    selectedLatestDate != null &&
    selectedStartTime != null &&
    selectedEndTime != null &&
    selectedLocationCategory != null;

  // Handle submitting before closing
  const [isSubmitting, setIsSubmitting] = useState(false);
  const onCreate = async () => {
    if (
      title.length > 0 &&
      selectedEarliestDate != null &&
      selectedLatestDate != null &&
      selectedStartTime != null &&
      selectedEndTime != null &&
      selectedLocationCategory != null
    ) {
      setIsSubmitting(true);
      try {
        const [startHour, startMinute] = selectedStartTime.value
          .split(":")
          .map(Number);
        const [endHour, endMinute] = selectedEndTime.value
          .split(":")
          .map(Number);
        const body: CreateEventBody = {
          user_id: userID ?? "",
          title,
          description,
          earliest_date: selectedEarliestDate.value,
          latest_date: selectedLatestDate.value,
          start_time_hour: startHour,
          start_time_minute: startMinute,
          end_time_hour: endHour,
          end_time_minute: endMinute,
          location_category: selectedLocationCategory.value as LocationCategory,
        };

        // Ignore errors
        await fetch(`${API_ROOT}/api/v1/events/${eventId}`, {
          method: "PUT",
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

  // Automatically focus the title textbox upon mounting
  useEffect(() => {
    titleTextbox.current?.focus();
    titleTextbox.current?.select();
  }, []);

  return (
    <DemoOuter className={className} style={style}>
      <Styled.Form>
        <WithLabel label="Title" style={{ flexBasis: 1 }}>
          <TextBox
            ref={titleTextbox}
            value={title}
            setValue={(value) => setTitle(value ?? "")}
            placeholder="Enter title here"
            disabled={isSubmitting}
          />
        </WithLabel>
        <WithLabel label="Description" style={{ flexBasis: 1 }}>
          <TextArea
            value={description}
            setValue={(value) => setDescription(value ?? "")}
            placeholder="Enter description here"
            disabled={isSubmitting}
            style={{ minHeight: 120 }}
          />
        </WithLabel>
        <WithLabel label="Earliest possible date" style={{ flexBasis: 1 }}>
          <SingleSelect
            options={dateOptions}
            onSelect={setEarliestDate}
            selectedOption={selectedEarliestDate}
            disabled={isSubmitting}
          />
        </WithLabel>
        <WithLabel label="Latest possible date" style={{ flexBasis: 1 }}>
          <SingleSelect
            options={dateOptions}
            onSelect={setLatestDate}
            selectedOption={selectedLatestDate}
            disabled={isSubmitting}
          />
        </WithLabel>
        <WithLabel label="Possible times" style={{ flexBasis: 1 }}>
          <Styled.SplitRow>
            <SingleSelect
              options={timeOptions}
              onSelect={setStartTime}
              selectedOption={selectedStartTime}
              disabled={isSubmitting}
              style={{ marginBottom: 10 }}
            />
            <span
              style={{
                marginLeft: 12,
                marginRight: 12,
                display: "inline-block",
              }}
            >
              to
            </span>
            <SingleSelect
              options={timeOptions}
              onSelect={setEndTime}
              selectedOption={selectedEndTime}
              disabled={isSubmitting}
            />
          </Styled.SplitRow>
        </WithLabel>
        <WithLabel label="Location category" style={{ flexBasis: 1 }}>
          <SingleSelect
            options={locationCategoryOptions}
            onSelect={setLocationCategory}
            selectedOption={selectedLocationCategory}
            disabled={isSubmitting}
          />
        </WithLabel>
      </Styled.Form>
      <DoneButton
        onClick={onCreate}
        text="Create"
        disabled={!canCreate || isSubmitting}
      />
    </DemoOuter>
  );
}
