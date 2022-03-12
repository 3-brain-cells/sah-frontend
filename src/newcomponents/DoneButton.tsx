import styled from "@emotion/styled";
import Button from "../components/Button";

const Styled = {
  Div: styled.div`
    background-color: #fff;
    border: 1px solid #ccc;
    position: fixed;
    bottom: 10px;
    right: 10px;
  `,
};

export default function DoneButton() {
  return (
    <Styled.Div>
      <Button onClick={() => console.log("clicked")} text="Button" />
    </Styled.Div>
  );
}
