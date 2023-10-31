import styled from "@emotion/styled";

export const Button = styled.button`
  color: ${(props) => (props.primary ? "hotpink" : "turquoise")};
`;
