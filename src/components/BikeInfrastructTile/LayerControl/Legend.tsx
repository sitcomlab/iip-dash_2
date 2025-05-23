import { useContext} from 'react';
import {Layer} from 'leaflet';
import { ReactElement } from 'react-markdown/lib/react-markdown';
import { Paper } from '@mui/material';
import styled from 'styled-components';

import  { SVGProps } from 'react'

import { LayersControlContext } from './layerControlContext';

import {SvgChargingIcon as ChargingIcon} from '@/components/Icons/ChargingIcon';
import {SvgShopIcon as ShopIcon} from '@/components/Icons/ShopIcon';
import {SvgParkingIcon as ParkingIcon} from '@/components/Icons/ParkingIcon';
import {SvgRepairIcon as RepairIcon} from '@/components/Icons/RepairIcon';
import {SvgRentalIcon as RentalIcon} from '@/components/Icons/RentalIcon';
import {SvgTubeIcon as TubeIcon} from '@/components/Icons/TubeIcon';
import {SvgSignalIcon as SignalIcon} from '@/components/Icons/SignalIcon';
import {SvgWayfindingIcon as WayfindingIcon} from '@/components/Icons/WayfindingIcon';
import {SvgTrainstationIcon as TrainstationIcon} from '@/components/Icons/TrainstationIcon';
import {SvgBusStopIcon as BusStopIcon} from '@/components/Icons/BusStopIcon';

const POSITION_CLASSES: { [key: string]: string } = {
    bottomleft: 'leaflet-bottom leaflet-left',
    bottomright: 'leaflet-bottom leaflet-right',
    topleft: 'leaflet-top leaflet-left',
    topright: 'leaflet-top leaflet-right',
}

interface LegendProps {
    children: ReactElement[];
    position: string;
}

interface ILayerObj {
    layer: Layer;
    group: string;
    name: string;
    icon: JSX.Element;
    checked: boolean;
    id: number;
}

interface LegendRowProps {
    color:
      | '#385723'
      | '#203864'
      | '#FF0000'
      | 'blue'
      | 'green'
      | 'orange'
      | 'red'; // 'darkgreen', 'darkblue', 'red'
    icon: JSX.Element;
    text: String;
}

const BaseMapMarker = styled.span`
    background-color: ${(props) => props.color};
    border-bottom-left-radius: 0.25rem;
    border-bottom-right-radius: 0.25rem;
    border: 1px solid white;
    width: 1.4rem;
    height: 1.4rem;
    color: white;
    font-weight: var(--scms-semi-bold);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: small;
    -moz-border-radius: 50px;
    -webkit-border-radius: 50px;
    border-radius: 50px;
    margin-right: 0.5rem;

    > svg {
        width: 1rem;
        pointer-events: none;
    }
`;

function LegendRow(props: LegendRowProps) {
  return <div
          style={{'display': 'flex', 'alignItems': 'center'}}
          >
              <BaseMapMarker color={props.color}>{props.icon}</BaseMapMarker><span>{props.text}</span>
          </div>;
}


function LineIcon(props: SVGProps<SVGSVGElement>){
    return (
        <svg
        strokeLinecap="round"
        strokeWidth='4'

        viewBox="0 0 25 10"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
        >
        <g fill="none">
            <path d="M0 4 l30 0"  />
        </g>
        </svg>
    )
}

function AreaIcon(props: SVGProps<SVGSVGElement>){
    return (
        <svg
        strokeLinecap="round"
        strokeWidth='4'

        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
        >
        <g>
            <rect height="20" width="20" />
        </g>
        </svg>
    )
}

// const BIKEABILITY_COLORS = [
//     { range: [0, 0.20], color: 'rgb(255, 255, 255)' }, // White
//     { range: [0.21, 0.55], color: 'rgb(255, 200, 200)' }, // Light red
//     { range: [0.55, 0.75], color: 'rgb(255, 150, 150)' }, // Medium red
//     { range: [0.75, 0.9], color: 'rgb(255, 100, 100)' }, // Dark red
//     { range: [0.9, 1], color: 'rgb(255, 0, 0)' } // Full red
// ];

// const ANONYMIZED_COLORS = [
//     { range: [0, 0.25], color: 'rgb(230, 230, 255)' }, // Light blue
//     { range: [0.25, 0.55], color: 'rgb(200, 200, 255)' }, // Medium light blue
//     { range: [0.55, 0.75], color: 'rgb(150, 150, 255)' }, // Medium blue
//     { range: [0.75, 0.9], color: 'rgb(100, 100, 255)' }, // Dark blue
//     { range: [0.9, 1], color: 'rgb(0, 0, 255)' } // Full blue
// ];


function Symbology(layer, text){
    let icon = <></>;
    switch(layer.name){
        //this could be more generalized
        case 'Fahrradstraße 2.0':
            icon = <LegendRow
                    icon={<LineIcon stroke='#319621'/>}
                    text={text}
                ></LegendRow>;
            break;
        case 'Radweg':
            icon = <LegendRow
                    icon={<LineIcon stroke='#f8b000'/>}
                    text={text}
                ></LegendRow>;
            break;
        case 'Radspur':
            icon = <LegendRow
                    icon={<LineIcon stroke='#cc0000' strokeDasharray='4,8'/>}
                    text={text}
                ></LegendRow>;
            break;
        case 'Fahrrad-Ampel':
            icon = <LegendRow
                        icon={<SignalIcon fill="#DEEBF7" stroke="#000000"/>}
                        text={text}
                    ></LegendRow>;
            break;
        case 'Radwege-Netz':
            icon = <LegendRow
                    icon={<LineIcon stroke='#f6ef3c' strokeWidth='20'/>}
                    text={text}
                ></LegendRow>;
            break;
        case 'Weg-Beschilderung':
            icon = <LegendRow
                        icon={<WayfindingIcon fill="#ffc000" stroke="#000000"/>}
                        text={text}
                    ></LegendRow>;
            break;
        case 'Parken':
            icon = <LegendRow
                        color="#203864"
                        icon={<ParkingIcon fill="#DEEBF7" />}
                        text={text}
                    ></LegendRow>;
            break;
        case 'Lade-Station':
            icon = <LegendRow
                        color="#203864"
                        icon={<ChargingIcon fill="#DEEBF7" />}
                        text={text}
                    ></LegendRow>;
            break;
        case 'Fahrrad-Laden':
            icon = <LegendRow
                        color="#385723"
                        icon={<ShopIcon fill="#E2F0D9" />}
                        text={text}
                    ></LegendRow>
            break;
        case 'DIY-Station':
            icon = <LegendRow
                        color="#385723"
                        icon={<RepairIcon fill="#E2F0D9" />}
                        text={text}
                    ></LegendRow>
            break;
        case 'Rad-Verleih':
            icon = <LegendRow
                        color="#385723"
                        icon={<RentalIcon fill="#E2F0D9" />}
                        text={text}
                    ></LegendRow>
            break;
        case 'Schlauch-Automat':
            icon = <LegendRow
                        color="#385723"
                        icon={<TubeIcon fill="#E2F0D9" />}
                        text={text}
                    ></LegendRow>
            break;
        case 'Bahnhof':
            icon = <LegendRow
                        color="#FF0000"
                        icon={<TrainstationIcon fill="#FFF3F3" />}
                        text={text}
                    ></LegendRow>
            break;
        case 'Bushaltestelle':
            icon = <LegendRow
                        icon={<BusStopIcon />}
                        text={text}
                    ></LegendRow>
            break;
        case 'Verkehrsberuhigt':
            icon = <LegendRow
                    icon={<LineIcon stroke='#08A99C'/>}
                    text={text}
                ></LegendRow>;
            break;
        case 'Einbahnstraßen-Ausnahme':
            icon = <LegendRow
                    icon={<LineIcon stroke='#8429b1'/>}
                    text={text}
                ></LegendRow>;
            break;
        case 'Mix-Weg':
            icon = <LegendRow
                icon={<LineIcon stroke='#b22f2f'/>}
                text={text}
            ></LegendRow>;
            break;
        case 'Mix-Fläche':
            icon = <LegendRow
                    icon={<AreaIcon
                        fill="#b22f2f"
                        fillOpacity="0.5"
                        stroke="#b22f2f"
                        strokeDasharray='4,4'
                    />}
                    text={text}
                ></LegendRow>;
            break;

        // case 'Bikeability':
        //     icon = (
        //         <div>
        //             <span className='text-center'>Bikeability Index (BI)</span>
        //             {BIKEABILITY_COLORS.map((cls, index) => (
        //                 <LegendRow
        //                     key={index}
        //                     icon={<LineIcon stroke={cls.color} />} // Display as a line
        //                     text={`${cls.range[0]} - ${cls.range[1]} (${index === 0 ? 'Very Low' : index === 1 ? 'Low' : index === 2 ? 'Medium' : index === 3 ? 'High' : 'Very High'})`}
        //                 />
        //             ))}
        //         </div>
        //     );

        //     break;
        //
        case 'Strecken-Bikeability':
            icon = (
                <div>
                    <span className='text-center'>Bikeability Index (BI)</span>
                    <LegendRow icon={<LineIcon stroke="rgb(255, 255, 255)" />} text="0 to 0.2 (very low)" />
                    <LegendRow icon={<LineIcon stroke="rgb(255, 200, 200)" />} text=">0.2 to 0.4 (low)" />
                    <LegendRow icon={<LineIcon stroke="rgb(255, 150, 150)" />} text=">0.4 to 0.6 (medium)" />
                    <LegendRow icon={<LineIcon stroke="rgb(255, 100, 100)" />} text=">0.6 to 0.8 (high)" />
                    <LegendRow icon={<LineIcon stroke="rgb(255, 0, 0)" />} text=">0.8 to 1 (very high)" />
                </div>
            );
            break;

        case 'OSM-Bikeability':
            icon = (
                <div>
                    <span className='text-center'> OSM Bikeability Index </span>
                    <LegendRow icon={<LineIcon stroke="rgb(200, 200, 200)" />} text="0 to 0.2 (very low)" />
                    <LegendRow icon={<LineIcon stroke="rgb(255, 100, 100)" />} text=">0.2 to 0.4 (low)" />
                    <LegendRow icon={<LineIcon stroke="rgb(255, 0, 0)" />} text=">0.4 to 0.6 (medium)" />
                    <LegendRow icon={<LineIcon stroke="rgb(120, 0, 0)" />} text=">0.6 to 0.8 (high)" />
                    <LegendRow icon={<LineIcon stroke="rgb(90, 0, 0)" />} text=">0.8 to 1 (very high)" />
                </div>
            );
            break;

        case 'Anonymized-Bikeability':
            icon = (
                // <div>
                //     {ANONYMIZED_COLORS.map((cls, index) => (
                //         <LegendRow
                //             key={index}
                //             icon={<LineIcon stroke={cls.color} />}
                //             text={`${cls.range[0]} - ${cls.range[1]} (${index === 0 ? 'Very Low' : index === 1 ? 'Low' : index === 2 ? 'Medium' : index === 3 ? 'High' : 'Very High'})`}
                //         ></LegendRow>
                //     ))}
                //     <p className='text-left' style={{ margin: '0.5rem 0' }}>
                //        BI Source: Arellana, Julián, et al (2020).
                //     </p>
                // </div>
            <div>
                <span className='text-center'>Anonymisierter BI</span>
                <LegendRow icon={<LineIcon stroke="rgb(230, 230, 255)" />} text="0 to 0.2 (very low)" />
                <LegendRow icon={<LineIcon stroke="rgb(200, 200, 255)" />} text=">0.2 to 0.4 (low)" />
                <LegendRow icon={<LineIcon stroke="rgb(150, 150, 255)" />} text=">0.4 to 0.6 (medium)" />
                <LegendRow icon={<LineIcon stroke="rgb(100, 100, 255)" />} text=">0.6 to 0.8 (high)" />
                <LegendRow icon={<LineIcon stroke="rgb(0, 0, 255)" />} text=">0.8 to 1 (very high)" />
                <p className='text-left' style={{ margin: '0.5rem 0' }}>
                        BI Quelle: Arellana, Julián, et al (2020).
                </p>
            </div>
            );
            break;

        default:
            break;
    }
    return icon
}


function Legend({children, position}: LegendProps) {
    //const [layers, setLayers] = useState<ILayerObj[]>([]);
    const layers = useContext(LayersControlContext)
    const positionClass = (position && POSITION_CLASSES[position]) || POSITION_CLASSES.topright;

    //const groupedLayers = lodashGroupBy(layers, 'group');

    const categories = layers.layers || [];

    return (
        <>
            <div className={positionClass}>
                <div className='leaflet-control leaflet-bar'>
                    <Paper className='p-3'>
                        <span><h1 className='text-lg text-center bold'>Legende</h1></span>
                        {
                            categories.map((category, index) => (
                                category.checked &&
                                <div key={index}>{Symbology(category, category.name)}</div>
                            ))
                        }
                    </Paper>
                </div>
                {children}
            </div>
        </>
    )
}

export default Legend;
