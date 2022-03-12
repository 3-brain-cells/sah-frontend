import styled from "@emotion/styled";
import { rgba } from "polished";
import { FaExclamationCircle, FaMinus, FaPlus } from "react-icons/fa";
import React from "react";

import { colors } from "./_lib/colors";
import { AbstractInputProps, ValidationStyleProps } from "./_lib/form_types";
import {
  contrastFloor,
  Height,
  heightToBackground,
  useHeight,
} from "./_lib/height";

const Styled = {
  Container: styled.span`
    position: relative;

    display: flex;
  `,
  TextBox: styled.input<ValidationStyleProps & { height: Height }>`
    background-color: ${(props) =>
      // Ensure the contrast is at least 1 full layer,
      // but default to height40
      heightToBackground(contrastFloor(props.height, Height.h40, 10))};
    border: ${(props) => (props.invalid ? `1px solid ${colors.red}` : "none")};
    border-radius: 8px 0px 0px 8px;
    font-feature-settings: "pnum" on, "lnum" on;
    flex-grow: 1;

    width: 160px;
    height: 32px;
    padding: 6px 8px;
    margin: 0px;

    font-size: 15px;
    color: ${colors.foreground};

    ::placeholder,
    :-ms-input-placeholder,
    ::-ms-input-placeholder {
      color: ${colors["foreground-extra-light"]};
    }

    &:focus {
      box-shadow: 0 0 0 3pt
        ${(props) => rgba(props.invalid ? colors.red : "#6CA1D1", 0.4)};
      outline: none;
    }
  `,
  Exclamation: styled(FaExclamationCircle)`
    position: absolute;
    right: 80px;
    top: 8px;
    height: 16px;
    color: ${colors["red+10"]};
    pointer-events: none;
  `,
  ButtonBox: styled.div<ValidationStyleProps & { height: Height }>`
    background-color: ${(props) =>
      props.invalid
        ? colors["red-30"]
        : // When valid, ensure the contrast is at least 2 full layers,
          // but default to height50
          heightToBackground(contrastFloor(props.height, Height.h50, 20))};
    border: ${(props) => (props.invalid ? `1px solid ${colors.red}` : "none")};
    border-left: none;
    flex-grow: 0;
    width: 70px;
    border-radius: 0px 8px 8px 0px;
    display: flex;
    justify-content: center;
  `,
  Button: styled.button`
    display: inline-flex;
    flex-grow: 1;
    align-self: center;
    color: ${rgba(colors.foreground, 0.6)};
    padding: 0;
    height: 100%;
    cursor: pointer;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    background: none;
    border: none;
    outline: none;

    & > svg {
      height: 14px;
      width: 14px;
    }

    &:hover {
      color: ${rgba(colors.foreground, 0.75)};
    }

    &:active {
      color: ${rgba(colors.foreground, 0.9)};
    }
  `,
  Separator: styled.span`
    width: 2px;
    align-self: center;
    box-sizing: border-box;
    height: 22px;
    background-color: ${rgba(colors.foreground, 0.2)};
    display: inline-block;
  `,
};

export type NumericEntryProps = AbstractInputProps<number> & {
  incrementValue?: number;
  style?: React.CSSProperties;
  className?: string;
};

export default function NumericEntry({
  incrementValue = 1,
  invalid = false,
  placeholder,
  setValue = () => {},
  value = 0,
  style,
  className,
}: NumericEntryProps): React.ReactElement {
  const height = useHeight();

  const onChange = (e: React.FormEvent<HTMLInputElement>) => {
    if (setValue) {
      const newValue = parseInt(e.currentTarget.value, 10);
      if (Number.isNaN(newValue)) {
        setValue(undefined);
      } else {
        setValue(newValue);
      }
    }
  };

  return (
    <Styled.Container style={style} className={className}>
      <Styled.TextBox
        height={height}
        invalid={invalid}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      {invalid && <Styled.Exclamation />}
      <Styled.ButtonBox invalid={invalid} height={height}>
        <Styled.Button onClick={() => setValue(value + incrementValue)}>
          <FaPlus />
        </Styled.Button>
        <Styled.Separator />
        <Styled.Button onClick={() => setValue(value - incrementValue)}>
          <FaMinus />
        </Styled.Button>
      </Styled.ButtonBox>
    </Styled.Container>
  );
}
