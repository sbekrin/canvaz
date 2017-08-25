import styled, { keyframes } from 'styled-components';

const pulseAnimation = keyframes`
  0% { opacity: 0.2; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.05); }
  100% { opacity: 0.2; transform: scale(1); }
`;

const DropPlaceholder: React.ComponentClass<any> = styled.hr`
  animation: ${pulseAnimation} 1s ease infinite;
  transition-duration: 100ms;
  transition-property: top, left, width, height;
  transition-timing-function: ease;
  border: none;
  height: 2px;
  margin-top: -1px;
  background-color: rgb(59, 153, 252);
  border-radius: 2px;
  position: absolute;
  pointer-events: none;
`;

export default DropPlaceholder;
