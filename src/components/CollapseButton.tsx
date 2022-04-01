import React from "react";
import { FaChevronLeft } from "react-icons/fa";
import styled from "@emotion/styled";

import { AbstractButtonProps } from "./_lib/button_types";
import { colors, shadows } from "./_lib/colors";
import { durations, easings } from "./_lib/motion";

const Styled = {
  CollapseButton: styled.button`
    position: relative;
    width: 48px;
    filter: drop-shadow(0px 4px 12px 1px rgba(0, 0, 0, 0.15));
    height: 56px;
    display: flex;
    background: none;
    justify-content: center;
    align-items: center;
    padding-left: 8px;
    margin-left: auto;
    border-radius: 100px 0 0 100px;
    outline: none;
    border: none;
    cursor: pointer;
    background-color: ${colors.background20};

    /* Animate a pseudo element's opacity instead of the box-shadow
           https://tobiasahlin.com/blog/how-to-animate-box-shadow/ */
    &::after {
      content: "";
      position: absolute;
      z-index: -1;
      width: 100%;
      height: 100%;
      border-radius: 100px 0 0 100px;

      box-shadow: ${shadows.height50};
      opacity: 0.5;
      transition: opacity ${durations.short} ${easings.linear};
    }

    & > svg {
      color: ${colors["foreground-extra-light"]};
      width: 28px;
      height: 28px;
      transition: transform ${durations.medium} ${easings.ease};
    }

    &:hover {
      & > svg {
        color: ${colors["foreground-light"]};
      }

      &::after {
        opacity: 1;
      }
    }

    &:active {
      & > svg {
        color: ${colors.foreground};
      }
    }
  `,
  NegativeCorner: styled.span<{ size: number; side: "top" | "bottom" }>`
    position: absolute;
    right: 0;
    content: " ";
    width: ${(props) => props.size}px;
    height: ${(props) => props.size}px;
    overflow: hidden;
    ${(props) =>
      props.side === "top"
        ? `top: -${props.size}px`
        : `bottom: -${props.size}px`};
    z-index: 2;

    &::before {
      position: absolute;
      box-shadow: 0 0 0 300px ${colors.background20};
      content: "";
      padding: ${(props) => props.size / 2}px;
      margin-left: -${(props) => props.size / 2}px;
      ${(props) =>
        props.side === "top"
          ? `border-bottom-right-radius: ${props.size}px`
          : `border-top-right-radius: ${props.size}px`};
    }
  `,
};

export type CollapseButtonProps = AbstractButtonProps & {
  isOpen: boolean;
  className?: string;
  style?: React.CSSProperties;
};

function CollapseButton({
  onClick,
  isOpen,
  className,
  style,
}: CollapseButtonProps): React.ReactElement {
  return (
    <Styled.CollapseButton
      onClick={onClick}
      className={className}
      style={style}
    >
      <Styled.NegativeCorner size={12} side="top" />
      <FaChevronLeft style={{ transform: `rotate(${isOpen ? 0 : 180}deg)` }} />
      <Styled.NegativeCorner size={12} side="bottom" />
    </Styled.CollapseButton>
  );
}

export default CollapseButton;
