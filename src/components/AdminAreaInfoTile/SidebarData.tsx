import React from 'react';
import styled from 'styled-components';

export enum Status {
    good,
    warning,
    bad,
    dummy,
}
  
export enum Size {
    big,
    normal,
}

interface PopupDataProps {
    value: number;
    header?: string;
    size: Size;
    status?: Status;
    unit?: string;
    decimals?: number;
    hover?: string;
    hoverID?: string;
}

interface TileStyleProps {
    status?: Status;
    size?: String;
}

const DataContainer = styled.div<TileStyleProps>`
    background-color: ${(props) => {
        switch (props.status) {
          case Status.good:
            return 'var(--scms-green)';
          case Status.warning:
            return 'var(--scms-yellow)';
          case Status.bad:
            return 'var(--scms-red)';
          case Status.dummy:
            return 'lightgrey';
          default:
            return 'var(--scms-primary-blue)';
        }
    }};
    width: ${(props) => {
        switch (props.size) {
          case "big":
            return '9.5rem';
          case "normal":
            return '7.2rem';
        }
    }};
    height: ${(props) => {
      switch (props.size) {
        case "big":
          return '9.5rem';
        case "normal":
          return '7.2rem';
      }
    }};

    margin-top: 0rem;
    padding-top: 0rem;
    margin: 0.5rem;
    padding: 0.5rem;
    text-align: center;
    border-radius: 1rem;


    box-shadow: var(--scms-box-shadow);
    color: white;
    font-size: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const TopText = styled.p<TileStyleProps>`
  font-weight: var(--scms-semi-bold);
  position: relative;
  top: ${(props) => {
    switch (props.size) {
      case "big":
        return '2';
      case "normal":
        return '1';
    }
  }};
`;

const Value = styled.p<TileStyleProps>`
  font-weight: var(--scms-semi-bold);
  position: relative;
  top: ${(props) => {
    switch (props.size) {
      case "big":
        return '0%';
      case "normal":
        return '2%';
    }
  }};
`;

const UnitText = styled.p<TileStyleProps>`
  font-weight: var(--scms-semi-bold);
  position: relative;
  top: ${(props) => {
    switch (props.size) {
      case "big":
        return '-2';
      case "normal":
        return '-1';
    }
  }};
`;



function SidebarData(props: SidebarDataProps) {
  //round to the specified decimals
  const valueRound = Math.round(props.value*(10**props.decimals)) / (10**props.decimals)

  return (
    <DataContainer
        data-tip={props.hover}
        size={props.size}
        status={props.status}
    >
        {props.size === "normal" && (
            <>
            <TopText className="is-size-7" size={props.size}>
                {props.header}
            </TopText>
            <Value className="is-size-4" size={props.size}>
                {valueRound}
            </Value>
            <UnitText className="is-size-7" size={props.size}>
                 {props.unit}
            </UnitText>
            </>
        )}
        {props.size === "big" && (
            <>
            <TopText className="is-size-6" size={props.size}>
                {props.header}
            </TopText>
            <Value className="is-size-2" size={props.size}>
                {valueRound}
            </Value>
            <UnitText className="is-size-7" size={props.size}>
                 {props.unit}
            </UnitText>
            </>
        )}
    </DataContainer>
    )
}

export default SidebarData