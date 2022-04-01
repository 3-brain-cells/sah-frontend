import React from "react";
import Select, {
  ActionMeta,
  components,
  OptionsType,
  OptionTypeBase,
} from "react-select";
import styled from "@emotion/styled";
import { rgba } from "polished";
import { FaChevronDown, FaTimesCircle } from "react-icons/fa";

import { colors, shadows } from "./_lib/colors";
import {
  contrastFloor,
  Height,
  heightToBackground,
  useHeight,
} from "./_lib/height";

export type SelectItem = { label: string; value: string };

type BaseSelectProps = {
  options: SelectItem[];
  style?: React.CSSProperties;
  className?: string;
  clearable?: boolean;
  onClear?: () => void;
  placeholder?: string;
  disabled?: boolean;
};

type InternalSelectProps = BaseSelectProps & {
  selectedOption: SelectItem | SelectItem[] | null;
  isMulti?: boolean;
  onChange: (
    value: OptionTypeBase | OptionsType<OptionTypeBase> | null,
    actionMeta: ActionMeta<OptionTypeBase>
  ) => void;
};

export type MultiSelectProps = BaseSelectProps & {
  onAdd: (value: SelectItem[], addedItem: SelectItem) => void;
  onRemove: (value: SelectItem[], removedItem: SelectItem) => void;
  selectedOptions: SelectItem[];
};

export type SingleSelectProps = BaseSelectProps & {
  selectedOption: SelectItem | null;
  onSelect: (selectedItem: SelectItem) => void;
};

const Styled = {
  Container: styled.span`
    display: inline-flex;
    min-height: 32px;
  `,
  Select: styled(Select)<{ height: Height }>`
    --background-color: ${(props) =>
      // Ensure the contrast is at least 1 full layer,
      // but default to height40
      heightToBackground(contrastFloor(props.height, Height.h40, 10))};
    --background-color-higher: ${(props) =>
      // Ensure the contrast is at least 2 full layer,
      // but default to height50
      heightToBackground(contrastFloor(props.height, Height.h50, 20))};
    min-height: 32px;
    font-size: 15px;
    min-width: 160px;
    width: 100%;
    & > .Select__control {
      background-color: var(--background-color);
      border: none;
      border-radius: 8px;
      min-height: 32px;
      transition: box-shadow linear 0.1s;

      &:focus-within {
        box-shadow: ${shadows.focusHighlight};
      }

      & > .Select__value-container {
        & > .Select__placeholder {
          color: ${colors["foreground-extra-light"]};
          font-weight: 400;
        }

        & > .Select__single-value {
          color: ${colors.foreground};
        }
      }

      & > .Select__indicators {
        & > .Select__indicator-separator {
          width: 2px;
          background-color: ${rgba(colors.foreground, 0.12)};
        }
      }
    }

    &.Select--is-disabled {
      opacity: 0.4;
    }

    /* Remove the left padding so that the items have equal padding
           on top/bottom/left when they are added to a multi-select,
           but keep it when typing in text */
    .Select__value-container--is-multi.Select__value-container--has-value {
      padding-left: 2px;
    }

    .Select__multi-value {
      background-color: var(--background-color-higher);
      height: 24px;
      align-self: center;
      border-radius: 4px;
    }

    .Select__multi-value__label {
      height: 24px;
      font-weight: 400;
      display: flex;
      align-items: center;
      color: ${colors.foreground};
    }

    .Select__multi-value__remove {
      color: ${rgba(colors.foreground, 0.4)};
      background-color: var(--background-color-higher);
      border-radius: 4px;
      cursor: pointer;

      &:hover {
        color: ${rgba(colors.foreground, 0.7)};
        background-color: var(--background-color-higher);
      }

      &:active {
        color: ${rgba(colors.foreground, 1)};
      }
    }

    .Select__clear-indicator {
      padding: 6px;
      color: ${rgba(colors.foreground, 0.4)};
      cursor: pointer;

      &:hover {
        color: ${rgba(colors.foreground, 0.7)};
      }

      &:active {
        color: ${rgba(colors.foreground, 1)};
      }
    }

    & > .Select__control--is-focused {
      border: none;
      box-shadow: none;
    }

    .Select__input {
      color: ${colors.foreground};
    }

    & > .Select__menu {
      background-color: var(--background-color);
      border-radius: 8px;
      box-shadow: ${shadows.height20};

      & > .Select__menu-list {
        & > .Select__option {
          height: 28px;
          padding: 7px 12px;
          color: ${colors["foreground-light"]};

          /* Hide overflow per-option */
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        & > .Select__option--is-focused {
          background-color: ${rgba(colors["secondary+10"], 0.15)};
          color: ${rgba(colors["foreground-light"], 0.75)};
        }

        & > .Select__option--is-selected {
          background-color: ${rgba(colors["secondary+10"], 0.3)};
          color: ${rgba(colors["foreground-light"], 0.9)};
        }
      }
    }
  `,
  IndicatorContainer: styled.div`
    color: ${rgba(colors.foreground, 0.4)};
    padding: 4px 6px 0px 5px;

    & > svg {
      width: 22px;
      height: 16px;
    }
  `,
  MultiValueRemove: styled(components.MultiValueRemove)``,
};

const DropdownIndicator = () => (
  <Styled.IndicatorContainer>
    <FaChevronDown />
  </Styled.IndicatorContainer>
);

const MultiValueRemove = (
  props: React.ComponentProps<typeof Styled.MultiValueRemove>
) => (
  <Styled.MultiValueRemove {...props}>
    <FaTimesCircle />
  </Styled.MultiValueRemove>
);

function InternalSelect({
  selectedOption,
  options,
  onChange,
  style,
  className,
  isMulti = false,
  clearable = false,
  onClear = () => null,
  placeholder = "Select...",
  disabled,
}: InternalSelectProps): React.ReactElement {
  // Get the current UI height
  const height = useHeight();

  return (
    <Styled.Container>
      <Styled.Select
        height={height}
        value={selectedOption}
        onChange={(value, actionMeta) => {
          onChange(value, actionMeta);
          if (actionMeta.action === "clear") {
            onClear();
          }
        }}
        isClearable={clearable}
        isSearchable
        isMulti={isMulti}
        options={options}
        classNamePrefix="Select"
        components={{
          DropdownIndicator,
          MultiValueRemove,
        }}
        placeholder={placeholder}
        style={style}
        className={className}
        isDisabled={disabled}
      />
    </Styled.Container>
  );
}

/*
 ** A Select box (preivously combobox) form element used to pick one element out of many options
 */
export function SingleSelect({
  selectedOption,
  options,
  onSelect,
  style,
  className,
  onClear = () => null,
  clearable = false,
  placeholder = "Select...",
  disabled = false,
}: SingleSelectProps): React.ReactElement {
  return (
    <InternalSelect
      selectedOption={selectedOption}
      onChange={(value, actionMeta) => {
        if (actionMeta.action === "select-option") {
          if (actionMeta.option === undefined) {
            onClear();
          }
          onSelect(value as SelectItem);
        }
      }}
      clearable={clearable}
      onClear={onClear}
      options={options}
      placeholder={placeholder}
      style={style}
      className={className}
      disabled={disabled}
    />
  );
}

/*
 ** A Select box (preivously combobox) form element used to pick multiple elements out of many options.
 */
export function MultiSelect({
  selectedOptions,
  options,
  onAdd,
  onRemove,
  style,
  className,
  onClear = () => null,
  clearable = false,
  placeholder = "Select...",
  disabled = false,
}: MultiSelectProps): React.ReactElement {
  return (
    <InternalSelect
      isMulti
      selectedOption={selectedOptions}
      onChange={(value, actionMeta) => {
        if (actionMeta.action === "select-option") {
          if (actionMeta.option === undefined) {
            onClear();
          }
          onAdd(value as SelectItem[], actionMeta.option as SelectItem);
        } else if (
          actionMeta.action === "remove-value" ||
          actionMeta.action === "pop-value"
        ) {
          onRemove(
            value as SelectItem[],
            actionMeta.removedValue as SelectItem
          );
        }
      }}
      onClear={onClear}
      clearable={clearable}
      options={options}
      placeholder={placeholder}
      style={style}
      className={className}
      disabled={disabled}
    />
  );
}
