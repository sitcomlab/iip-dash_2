import styled from "styled-components";

export const PopupWrapper = styled.div`
  margin: 0rem;
  padding: 0rem;
  border: 0rem;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
`;

export const ContentWrapper = styled.div`
  height: 100%;
  position: relative;
`;

export const HeadingWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1.1;
`;

export const IconWrapper = styled.div`
  margin-right: 1rem;
  > svg {
    width: 3rem;
    height: 3rem;
    fill: var(--scms-primary-blue);
    stroke: var(--scms-primary-blue);
    opacity: 0.3;
  }
`;

export const FooterWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  flex-wrap: wrap;
`;

export const ChartHeadingWrapper = styled.div`
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: "#263238";
`;

export const TilesWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  height: 100%;
  align-items: center;
`;

export const CapacityLegend = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0 rem;
  padding: 0 rem;

  > * {
    padding: 2 rem;
  }

  > .blue {
    color: var(--scms-primary-blue);
  }

  > .red {
    color: var(--scms-red);
  }

  > .green {
    color: var(--scms-green);
  }
`;
