import React from "react";
import styled from "@emotion/styled";
import { colors } from "../components/_lib/colors";

const Styled = {
  PageOuter: styled.div`
    background-color: ${colors.background20};
    padding: 16px 16px;
    height: 100vh;
    color: ${colors.foreground};
    text-align: left;
    overflow: auto;
  `,
  Inner: styled.div`
    max-width: 640px;
    width: 100%;
    margin: 0 auto;
    padding-bottom: 72px;
  `,
};

export type PageOuterProps = {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

export default function PageOuter({
  children,
  style,
  className,
}: PageOuterProps) {
  return (
    <Styled.PageOuter className={className} style={style}>
      <Styled.Inner>{children}</Styled.Inner>
    </Styled.PageOuter>
  );
}
