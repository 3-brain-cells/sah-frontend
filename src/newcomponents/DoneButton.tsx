import styled from "@emotion/styled";
import Button from "../components/Button";

const Styled = {
  Div: styled.div`
    position: absolute;
    bottom: 40%;
    right: 5%;
  `,

  OuterDiv: styled.div`
    background-color: pink;
    position : fixed;
    width: 100%;
    height: 20%;
    bottom: 0;
    `

};

export default function DoneButton() {
  return (
    <Styled.OuterDiv>
      <Styled.Div>
        <Button onClick={() => console.log('clicked')} text="Button"/>
      </Styled.Div>
    </Styled.OuterDiv>
  );
}
