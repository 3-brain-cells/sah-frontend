import React, { useMemo, useRef, useState } from "react";
import styled from "@emotion/styled";
import { FaSave, FaTimes } from "react-icons/fa";

import WithLabel from "../../components/WithLabel";
import TextBox from "../../components/TextBox";
import { SingleSelect } from "../../components/Select";
import Checkbox from "../../components/Checkbox";
import Button from "../../components/Button";
import NumericEntry from "../../components/NumericEntry";
import BaseText from "../../components/BaseText";

const Styled = {
    EventForm: styled.div`
    display: grid;
    grid-template-columns: 0.33fr 0.33fr 0.33fr;
    grid-auto-rows: auto;
    gap: 16px;
    padding-right: 10px;

    & > * {
      flex-grow: 1;
      flex-shrink: 1;
    }
  `,
    Checkbox: styled(Checkbox)`
    padding-bottom: 6px;
    align-self: flex-end;
  `,
    ActionButtonRow: styled.div`
    display: flex;
    flex-direction: row;
    gap: 12px;
    align-self: flex-end;
  `,
    NumericDiv: styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
  `,
};

export type EventFormProps = {
    className?: string;
    style?: React.CSSProperties;
};

/**
 * Release Form to edit your currently selected release
 */
export default function EventForm({
    className,
    style,
}: EventFormProps): React.ReactElement {
    const [nameValue, setNameValue] = useState("");
    const nameTextbox = useRef<HTMLInputElement | null>(null);

    // input box for description
    const [descriptionValue, setDescriptionValue] = useState("");
    const descriptionTextbox = useRef<HTMLInputElement | null>(null);

    const [showScheduledStart, setShowScheduledStart] = useState(false);
    const [showScheduledEnd, setShowScheduledEnd] = useState(false);
    const scheduledDateTextbox = useRef<HTMLInputElement | null>(null);

    const [scheduledStartTime, setScheduledStartTime] = useState("");
    const [scheduledEndTime, setScheduledEndTime] = useState("");
    const scheduledTimeTextbox = useRef<HTMLInputElement | null>(null);

    // input box for location
    const [locationValue, setLocationValue] = useState("");
    const locationTextbox = useRef<HTMLInputElement | null>(null);

    return (
        <Styled.EventForm style={style} className={className}>
            <WithLabel label="Name" style={{ flexBasis: 1 }}>
                <TextBox
                    ref={nameTextbox}
                    value={nameValue}
                    setValue={(next?: string) => setNameValue(next ?? "")}
                />
            </WithLabel>
            <WithLabel label="Description (optional)" style={{ flexBasis: 1 }}>
                <TextBox
                    ref={descriptionTextbox}
                    value={descriptionValue}
                    setValue={(next?: string) => setDescriptionValue(next ?? "")}
                />
            </WithLabel>
            <Button
                variant="secondary"
                text="Create Event"
                onClick={() => { }}
                icon={<FaSave />}
            />
        </Styled.EventForm>
    );
}
