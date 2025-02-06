import React, { Suspense } from "react";
import Skeleton from "react-loading-skeleton";
import styled from "styled-components";

interface CapacityProps {
  freqKnown: number;
  sumStands: number;
  freqUnknown: number;
  max: number;
}

interface CapacityBarProps {
  value: number;
}

const CapacityComponentWrapper = styled.div`
  display: flex;
  width: 100%;
  min-height: 32px; // this is a safari fix
  align-items: center;
  margin: 0 rem;
  padding: 0 rem;
`;

const CapacityWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 2rem;
  margin: 1rem 2rem;
  padding: 0rem;
  display: flex;
  align-items: center;
`;

const CapacityBar = styled.div`
  background-color: var(--scms-red);
  border-radius: 3px;
  position: relative;
  margin: 1rem 0;
  height: 6px;
  width: 100%;
`;

const CapacityKnobs = styled.div`
  position: absolute;
  width: 100%;
  display: flex;
`;

const CapacityKnob = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: larger;
  box-shadow: var(--scms-box-shadow-small);
  font-weight: var(--scms-semi-bold);

  &:hover {
    z-index: 10;
  }
`;

const CapacityKnobHidden = styled(CapacityKnob)`
  visibility: hidden;
`;

const CapacityKnown = styled(CapacityKnob)`
  background-color: var(--scms-green);
  position: absolute;
  left: 0;
  margin-left: -1rem;
  z-index: 1;
  border-radius: 0.25rem;
`;

const SumStands = styled(CapacityKnob)<CapacityBarProps>`
  background-color: var(--scms-primary-blue);
  position: absolute;
  margin-left: -1rem;
  left: ${(props) => `${props.value}%` || "0%"};
  transition: 1s ease;
`;

const CapacityUnknown = styled(CapacityKnob)`
  background-color: var(--scms-red);
  position: absolute;
  right: 0;
  margin-right: -1rem;
  z-index: 1;
  border-radius: 0.25rem;
`;

const CapacityBarDone = styled.div<CapacityBarProps>`
  background: var(--scms-green);
  border-radius: 3px;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: ${(props) => `${props.value}%` || "0%"};
  transition: 1s ease;
`;

export function CapacitySlider(props: CapacityProps) {
  return (
    <CapacityComponentWrapper>
      <CapacityWrapper>
        {/* This is the horizontal line displaying the progress */}
        <CapacityBar>
          <CapacityBarDone
            value={(props.freqKnown / props.max) * 100}
          ></CapacityBarDone>
        </CapacityBar>
        {/* Here are the knobs / buttons in the progress bar */}
        <CapacityKnobs>
          <Suspense fallback={<Skeleton></Skeleton>}>
            {/* We need this knob for correct layout idk */}
            <CapacityKnobHidden></CapacityKnobHidden>
            {/* This is the square knob at the start */}
            <CapacityKnown>{props.freqKnown}</CapacityKnown>
            {/* This is the square knob at the end */}
            <CapacityUnknown>{props.freqUnknown}</CapacityUnknown>
            {/* This is the circular knob sliding in the progress bar */}
            <SumStands value={(props.freqKnown / props.max) * 100}>
              {props.sumStands}
            </SumStands>
          </Suspense>
        </CapacityKnobs>
      </CapacityWrapper>
    </CapacityComponentWrapper>
  );
}
