import React from "react";
import styled from "@emotion/styled";
import { rgba } from "polished";
import { FaExclamationCircle } from "react-icons/fa";

import { AbstractInputProps, ValidationStyleProps } from "./_lib/form_types";
import { colors } from "./_lib/colors";
import {
  Height,
  heightToBackground,
  contrastFloor,
  useHeight,
} from "./_lib/height";

const Styled = {
  Container: styled.div`
    position: relative;
  `,
  TextBox: styled.input<ValidationStyleProps & { height: Height }>`
    background-color: ${(props) =>
      // Ensure the contrast is at least 1 full layer,
      // but default to height40
      heightToBackground(contrastFloor(props.height, Height.h40, 10))};
    border: ${(props) => (props.invalid ? `1px solid ${colors.red}` : "none")};
    border-radius: 8px;

    width: 160px;
    height: 32px;
    padding: 6px 8px;

    font-size: 15px;
    color: ${colors.foreground};
    width: 100%;
    transition: box-shadow linear 0.1s;

    ::placeholder,
    :-ms-input-placeholder,
    ::-ms-input-placeholder {
      color: ${colors["foreground-extra-light"]};
    }

    &:focus {
      box-shadow: 0 0 0 3px
        ${(props) => rgba(props.invalid ? colors.red : "#6CA1D1", 0.4)};
      outline: none;
    }

    &:disabled {
      opacity: 0.4;
      pointer-events: none;
    }
  `,
  Exclamation: styled(FaExclamationCircle)`
    position: absolute;
    z-index: 2;
    right: 9px;
    top: 7px;
    height: 16px;
    color: ${colors["red+10"]};
    pointer-events: none;
  `,
};

const TextBox = React.forwardRef<HTMLInputElement, AbstractInputProps<string>>(
  ({ value, setValue, placeholder, disabled, invalid }, ref) => {
    const onChange = (e: React.FormEvent<HTMLInputElement>) => {
      if (setValue) {
        const newValue = e.currentTarget.value;
        setValue(newValue);
      }
    };

    // Get the current UI height
    const height = useHeight();

    return (
      <Styled.Container>
        <Styled.TextBox
          height={height}
          disabled={disabled}
          invalid={invalid}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          ref={ref}
        />
        {invalid && <Styled.Exclamation />}
      </Styled.Container>
    );
  }
);
TextBox.displayName = "TextBox";

export default TextBox;
