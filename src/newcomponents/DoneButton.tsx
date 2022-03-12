import styled from "@emotion/styled";

const Styled = {
  Button: styled.button`
    background-color: #fff;
    border: 1px solid #ccc;
    position: fixed;
    bottom: 0;
    right: 0;
  `,
};

export default function DoneButton() {
  return (
    <Styled.Button>
      <span>Done</span>
    </Styled.Button>
  );
}
