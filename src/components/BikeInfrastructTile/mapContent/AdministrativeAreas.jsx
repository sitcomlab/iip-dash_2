import { FeatureGroup, GeoJSON, Pane, Popup, Tooltip } from 'react-leaflet';

//TODO: managing the tiles for AA-info


function AdministrativeAreas(props){
    //TODO: atoms

    //guard clause to ensure no crashes when data not loaded yet
    if (props.contentGeometry === undefined || props.contentGeometry.features === undefined) {
        return (<></>)
    }
    console.log("hey")
    //TODO: selection methods
        // ## ADMINISTRATIVE AREAS
    //filter and style administrative areas
    const administrativeAreas = props.contentGeometry.features.filter(
        (feature) =>
        feature.properties.bike_infrastructure_type === 'admin_area'
    );
    console.log(administrativeAreas)
    const adminAreaOptions = {
        color: '#000000',
        weight: 2,
        opacity: 1,
        fillColor: '#4d514d',
        fillOpacity: 0.2,
    };
    const selectedAdminAreaOptions = {
        color: '#000000',
        weight: 2,
        opacity: 1,
        fillColor: '#4d514d',
        fillOpacity: 0,
    };
    //event functions for Adnimistrative areas
    function clickAdminArea(e, feature) {
        setSelectedAAFeature(feature);
        e.target.setStyle({
        color: '#000000',
        weight: 2,
        opacity: 1,
        fillColor: '#4d514d',
        fillOpacity: 0,
        });
        if (e.target.isTooltipOpen()) {
        e.target.closeTooltip();
        }
    }
    function popupCloseAdminArea(e) {
        e.target.setStyle({
        color: '#000000',
        weight: 2,
        opacity: 1,
        fillColor: '#4d514d',
        fillOpacity: 0.2,
        });
    }
    function mouseMoveAdminArea(e) {
        if (!e.target.isPopupOpen()) {
            e.target.openTooltip(e.latlng);
        }
    }
    function mouseOverAdminArea(e) {
        if (e.target.isPopupOpen()) {
        e.target.closeTooltip();
        }
    }
    {/*
    //filter Bus and train stations of selected admin area
    const trainStations = props.contentGeometry.features.filter(
        (feature) =>
        feature.properties.bike_infrastructure_type === 'train_station' &&
        feature.properties.aa === selectedAA &&
        PointDataType.öffis === displayedPointData
    );
    function pointTrain(geojsonPoint, latlng) {
        const trainIcon = L.divIcon({
        className: '',
        html: renderToStaticMarkup(
            <BiMarkerIcon
            color="#FF0000"
            icon={<TrainstationIcon fill="#FFF3F3" />}
            ></BiMarkerIcon>
        ),
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [-3, -11],
        });
        return L.marker(latlng, { icon: trainIcon });
    }
    // Filter and style bus stops
    //TODO: merge bus stops at the same street
    const busStops = props.contentGeometry.features.filter(
        (feature) => 
        feature.properties.bike_infrastructure_type === 'bus_stop' &&
        feature.properties.aa === selectedAA &&
        displayedPointData == PointDataType.öffis
    );
    function pointBusStop(geojsonPoint, latlng) {
        //TODO: add bus icon
        //TODO: implement popup for departures
        const trainIcon = L.divIcon({
        className: '',
        html: renderToStaticMarkup(
            <BusStopIcon
                height="70%"
                width="70%"
            />
        ),
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [-3, -11],
        });
        return L.marker(latlng, { icon: trainIcon });
    }
    // Filter and style parking
    const parking = props.contentGeometry.features.filter(
        (feature) =>
        feature.properties.bike_infrastructure_type === 'parking' &&
        feature.geometry.type === 'Point' &&
        feature.properties.aa === selectedAA &&
        displayedPointData == PointDataType.parken
    );
    function pointParking(geojsonPoint, latlng) {
        const parkingIcon = L.divIcon({
        className: '',
        html: renderToStaticMarkup(
            <BiMarkerIcon
            color="#203864"
            icon={<ParkingIcon fill="#DEEBF7" />}
            ></BiMarkerIcon>
        ),
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [-3, -11],
        });
        return L.marker(latlng, { icon: parkingIcon });
    }
    // Filter and Style service stations
    const bicycleShops = props.contentGeometry.features.filter(
        (feature) =>
        feature.properties.bike_infrastructure_type === 'bicycle_shop' &&
        feature.geometry.type === 'Point' &&
        feature.properties.aa === selectedAA &&
        displayedPointData == PointDataType.service
    );
    function pointShop(geojsonPoint, latlng) {
        const shopIcon = L.divIcon({
        className: '',
        html: renderToStaticMarkup(
            <BiMarkerIcon
            color="#385723"
            icon={<ShopIcon fill="#E2F0D9" />}
            ></BiMarkerIcon>
        ),
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [-3, -11],
        });
        return L.marker(latlng, { icon: shopIcon });
    }
    const tubeVendings = props.contentGeometry.features.filter(
        (feature) =>
        feature.properties.bike_infrastructure_type === 'tube_vending_machine' &&
        feature.properties.aa === selectedAA &&
        displayedPointData == PointDataType.service
    );
    function pointTube(geojsonPoint, latlng) {
        const tubeIcon = L.divIcon({
        className: '',
        html: renderToStaticMarkup(
            <BiMarkerIcon
            color="#385723"
            icon={<TubeIcon fill="#E2F0D9" />}
            ></BiMarkerIcon>
        ),
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [-3, -11],
        });
        return L.marker(latlng, { icon: tubeIcon });
    }
    const repairStations = props.contentGeometry.features.filter(
        (feature) =>
            feature.properties.bike_infrastructure_type === 'bicycle_repair_station' &&
            feature.properties.aa === selectedAA &&
            displayedPointData == PointDataType.service
    );
    function pointRepair(geojsonPoint, latlng) {  
        const repairIcon = L.divIcon({
            className: '',
            html: renderToStaticMarkup(
                <BiMarkerIcon
                    color="#385723"
                    icon={<RepairIcon fill="#E2F0D9" />}
                ></BiMarkerIcon>
            ),
            iconSize: [32, 32],
            iconAnchor: [16, 16],
            popupAnchor: [-3, -11],
        });
        return L.marker(latlng, { icon: repairIcon });
    }
    const rentals = props.contentGeometry.features.filter(
        (feature) =>
            feature.properties.bike_infrastructure_type === 'bicycle_rental' &&
            feature.properties.aa === selectedAA &&
            displayedPointData == PointDataType.service
    );
    function pointRental(geojsonPoint, latlng) {
        const rentalIcon = L.divIcon({
            className: '',
            html: renderToStaticMarkup(
                <BiMarkerIcon
                    color="#385723"
                    icon={<RentalIcon fill="#E2F0D9" />}
                ></BiMarkerIcon>
            ),
            iconSize: [32, 32],
            iconAnchor: [16, 16],
            popupAnchor: [-3, -11],
        });
        return L.marker(latlng, { icon: rentalIcon });
    }
*/}
    return(
        <>
        
            <Pane name="administrativeAreas" style={{ zIndex: 500}}>
            <FeatureGroup>
            {administrativeAreas.map((feature, index) => {
                //if(isAdminAreaSelected(feature.properties.name)){
                    return(
                        <GeoJSON
                            data={feature}
                            key={'aa'+index+Date.now()+'selected'}
                            pathOptions={selectedAdminAreaOptions}
                        >
                        </GeoJSON>
                    )    
                //}
                
                return(
                    <GeoJSON
                        data={feature}
                        eventHandlers={{
                            click: (e) => {clickAdminArea(e, feature)},
                            mousemove: mouseMoveAdminArea,
                            mouseover: mouseOverAdminArea,
                        }}
                        key={'aa'+index+Date.now()}
                        pathOptions={adminAreaOptions}
                    >
                        <Tooltip pane="tooltip">{feature.properties.name}</Tooltip>
                    </GeoJSON>
                )
                
                })}

            </FeatureGroup>
            </Pane>
        </>
    )
}

export default AdministrativeAreas