import { useState } from 'react';
import styled from 'styled-components';

import { SvgCyclingPathIcon } from '@/components/Icons/CyclingPathIcon';
import { SvgShopIcon } from '@/components/Icons/ShopIcon';
import { SvgParkingIcon } from '@/components/Icons/ParkingIcon';

export const FooterButton = styled.button`
  cursor: pointer;
  font-size: small;
  user-select: none;
  background-color: rgba(189, 189, 189, 0.15);
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
  border-radius: 0.25rem;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  margin-top: 0.5rem;
  border: none;
  outline: none;

  > a {
    color: inherit;
  }

  &:hover {
    background-color: rgba(189, 189, 189, 0.5);
  }
`;

export const HighlightedFooterButton = styled(FooterButton)`
  background-color: rgba(0, 159, 227, 0.15);

  font-weight: ${(props) => (props.bold ? '600' : '')};

  &:hover {
    background-color: rgba(0, 159, 227, 0.15);
  }
`;

export const IconWrapper = styled.div`
  margin-right: 1rem;
  > svg {
    width: 2rem;
    height: 2rem;
    fill: var(--scms-primary-blue);
    stroke: var(--scms-primary-blue);
    opacity: 0.3;
  }
`;

const OpenPage = {
    Parking:'Parken',
    Cycling:'Fahrradstraßen',
    Service:'Service',
    PublicTransport:'Öffis',
};

function FooterNavigation(props) {
    /*
    props.currentPage: 'Parking' | 'Cycling' | 'Service' | 'PublicTransport'
    props.setCurrentPage: set-state function
    */

    //TODO: this return can be simplified using a loop on OpenPage
    return (
        <div className='flex flex-row justify-around'>
        
        {Object.getOwnPropertyNames(OpenPage).map((page) =>{
            if(props.currentPage == OpenPage[page]){
                return(
                <HighlightedFooterButton bold={true} key={props.currentPage+page}>
                    {OpenPage[page]}
                </HighlightedFooterButton>
                )
            }else{
                return(
                <FooterButton
                    onClick={() => {
                    props.setCurrentPage(OpenPage[page])
                    }}
                    key={props.currentPage+page}
                >
                    {OpenPage[page]}
                </FooterButton>
                )
            }
                
        })}

        {/*props.currentPage == OpenPage.Parking ?
        ( 
            <HighlightedFooterButton bold={true}>
                {OpenPage.Parking}
            </HighlightedFooterButton>
        ) : (
            <FooterButton
                onClick={() => {
                props.setCurrentPage(OpenPage.Parking)
                }}
            >
                {OpenPage.Parking}
            </FooterButton>
        )
        }

        {props.currentPage == OpenPage.Cycling ?
        ( 
            <HighlightedFooterButton bold={true}>
                {OpenPage.Cycling}
            </HighlightedFooterButton>
        ) : (
            <FooterButton
                onClick={() => {
                props.setCurrentPage(OpenPage.Cycling)
                }}
            >
                {OpenPage.Cycling}
            </FooterButton>
        )
        }

        {props.currentPage == OpenPage.Service ?
        ( 
            <HighlightedFooterButton bold={true}>
                {OpenPage.Service}
            </HighlightedFooterButton>
        ) : (
            <FooterButton
                onClick={() => {
                props.setCurrentPage(OpenPage.Service)
                }}
            >
                {OpenPage.Service}
            </FooterButton>
        )
        }

        {props.currentPage == OpenPage.PublicTransport ?
        ( 
            <HighlightedFooterButton bold={true}>
                {OpenPage.PublicTransport}
            </HighlightedFooterButton>
        ) : (
            <FooterButton
                onClick={() => {
                props.setCurrentPage(OpenPage.PublicTransport)
                }}
            >
                {OpenPage.PublicTransport}
            </FooterButton>
        )
        */}

        </div>
    )
}

export default function AAInfoPages(props){
    const [currentPage, setCurrentPage] = useState(OpenPage.Service)

    
    //Pages TO DO
    /*
    Parking:
        4 pages:
            - Sum of parking units
                - button to show on map
            - Stellplätze (how much capacity is known)
            - Weather Protection
            - Parking types
    Fahrradstraßen:
        Length in KM. I would say it's optional
    Service availability:
        - Stores within
        - Stores nearby
        - Abdeckung
        - Button to show on map
    Öffis
        - Amount Bus stops, 
        - Amount train stations
        - Button to show on map

    */
    return (
        <>
        <div
            className='
            h-full m-auto p-1 pt-4
            flex flex-col justify-around
            '
        >
            {currentPage == OpenPage.Parking && (
                <>
                <div className='w-full flex items-center justify-center'>
                    <IconWrapper><SvgParkingIcon /></IconWrapper>
                    <p className="text-sm font-semibold w-full">
                      Stellplätze <br />
                      <span className="font-normal">
                        in {props.name}
                      </span>
                    </p>
                </div>
                <div className="h-full relative">
                    {props.contentParking}
                </div>
                </>
            )}

            {currentPage == OpenPage.Cycling && (
                <>
                <div className='w-full flex items-center justify-center'>
                    <IconWrapper><SvgCyclingPathIcon /></IconWrapper>
                    <p className="text-sm font-semibold w-full">
                      Fahrradstraßen <br />
                      <span className="font-normal">
                        in {props.name}
                      </span>
                    </p>
                </div>
                <div className="h-full relative">
                    {props.contentCycling}
                </div>
                </>
            )}

            {currentPage == OpenPage.Service && (
                <>
                <div className='w-full flex items-center justify-center'>
                    <IconWrapper><SvgShopIcon /></IconWrapper>
                    <p className="text-sm font-semibold w-full">
                      Fahrradläden <br />
                      <span className="font-normal">
                        in {props.name}
                      </span>
                    </p>
                </div>
                <div className="h-full relative">
                    {props.contentService}
                </div>
                </>
            )}
            
            {currentPage == OpenPage.PublicTransport && (
                <>
                <div className='w-full flex items-center justify-center'>
                    <p className="text-sm font-semibold w-full">
                      Öffentliche Verkehrsmittel <br />
                      <span className="font-normal">
                        in {props.name}
                      </span>
                    </p>
                </div>
                <div className="h-full relative">
                    {props.contentPublicTransport}
                </div>
                </>
            )}
            <FooterNavigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
        </div>
        </>
    )
}