import "./carousel_edited.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import styled from "styled-components";

const SliderPage = styled.div`
  height: 100%;
  padding: 0rem;
  margin: 0rem;
  border: 0rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
`;

function SliderCarousel(props) {
  return (
    <Carousel
      autoPlay={false}
      infiniteLoop={false}
      showArrows={true}
      showIndicators={false}
      showStatus={false}
      showThumbs={false}
    >
      <SliderPage>{props.contentParkingunits}</SliderPage>
      {/*<div>{props.contentCapacity}</div>*/}
      <div>{props.contentWeather}</div>
      <div>{props.contentTypes}</div>
    </Carousel>
  );
}

export default SliderCarousel;
