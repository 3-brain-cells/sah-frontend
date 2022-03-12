import React, { useMemo, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { FaSave, FaTimes } from 'react-icons/fa';

import WithLabel from '../../components/WithLabel';
import TextBox from '../../components/TextBox';
import { SingleSelect } from '../../components/Select';
import Checkbox from '../../components/Checkbox';
import Button from '../../components/Button';
import NumericEntry from '../../components/NumericEntry';
import BaseText from '../../components/BaseText';

const Styled = {
    ReleaseForm: styled.div`
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

export type ReleaseFormProps = {
    className?: string;
    style?: React.CSSProperties;
};

/**
 * Release Form to edit your currently selected release
 */
export default function ReleaseForm({ className, style }: ReleaseFormProps): React.ReactElement {
    const [selectedProxyList, setProxyList] =
        useState<{ label: string; value: string } | null>(null);
    const options = useMemo(() => [{ value: 'proxy1', label: 'proxy2' }], []);
    const [nameValue, setNameValue] = useState('');
    const nameTextbox = useRef<HTMLInputElement | null>(null);

    const [monitorDelayValue, setMonitorDelayValue] = useState(500);
    const [retryDelayValue, setRetryDelayValue] = useState(2000);

    const [showScheduledStart, setShowScheduledStart] = useState(false);
    const [scheduledStartTime, setScheduledStartTime] = useState('');
    const scheduledStartTextbox = useRef<HTMLInputElement | null>(null);

    return (
        <Styled.ReleaseForm style={style} className={className}>
            <WithLabel label="Proxy List" style={{ flexBasis: 1 }}>
                <SingleSelect
                    options={options}
                    onSelect={setProxyList}
                    selectedOption={selectedProxyList}
                />
            </WithLabel>
            <WithLabel label="Name" style={{ flexBasis: 1 }}>
                <TextBox
                    ref={nameTextbox}
                    value={nameValue}
                    setValue={(next?: string) => setNameValue(next ?? '')}
                />
            </WithLabel>
            <Styled.Checkbox
                label="Use Scheduled Start Time"
                selected={showScheduledStart}
                onClick={() => {
                    setShowScheduledStart(!showScheduledStart);
                }}
            />
            <WithLabel label="Monitor Delay" style={{ flexBasis: 1 }}>
                <Styled.NumericDiv>
                    <NumericEntry
                        value={monitorDelayValue}
                        setValue={(next?: number) => setMonitorDelayValue(next ?? 0)}
                        style={{ flexGrow: 1 }}
                        incrementValue={100}
                    />
                    <BaseText style={{ flexGrow: 0 }}>ms</BaseText>
                </Styled.NumericDiv>
            </WithLabel>
            <WithLabel label="Retry Delay" style={{ flexBasis: 1 }}>
                <Styled.NumericDiv>
                    <NumericEntry
                        value={retryDelayValue}
                        setValue={(next?: number) => setRetryDelayValue(next ?? 0)}
                        style={{ flexGrow: 1 }}
                        incrementValue={100}
                    />
                    <BaseText style={{ flexGrow: 0 }}>ms</BaseText>
                </Styled.NumericDiv>
            </WithLabel>
            {showScheduledStart && (
                <WithLabel label="Scheduled Start Time *" style={{ flexBasis: 1 }}>
                    <TextBox
                        ref={scheduledStartTextbox}
                        value={scheduledStartTime}
                        setValue={(next?: string) => setScheduledStartTime(next ?? '')}
                    />
                </WithLabel>
            )}
            <Styled.ActionButtonRow>
                <Button variant="secondary" text="Save" onClick={() => {}} icon={<FaSave />} />
                <Button
                    text="Discard Changes"
                    onClick={() => {}}
                    variant="background"
                    icon={<FaTimes />}
                    iconColor="danger"
                />
            </Styled.ActionButtonRow>
        </Styled.ReleaseForm>
    );
}
