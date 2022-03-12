import styled from "@emotion/styled";
import Button from "../components/Button";
import { colors } from "../components/_lib/colors";

const Styled = {
  OuterDiv: styled.div`
    background-color: ${colors.background10};
    position: fixed;
    width: 100%;
    bottom: 0;
    left: 0;
    padding: 16px 16px;
  `,
  Div: styled.div`
    max-width: 640px;
    width: 100%;
    margin: 0 auto;

    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
  `,
  Button: styled(Button)`
    height: 36px;
    & .text {
      font-size: 18px !important;
    }
  `,
};

export type DoneButtonProps = {
  onClick?: () => void;
  text?: string;
  className?: string;
  style?: React.CSSProperties;
};

export default function DoneButton({
  onClick,
  text = "Done",
  className,
  style,
}: DoneButtonProps) {
  return (
    <Styled.OuterDiv className={className} style={style}>
      <Styled.Div>
        <Styled.Button onClick={onClick} text={text} />
      </Styled.Div>
    </Styled.OuterDiv>
  );
}
