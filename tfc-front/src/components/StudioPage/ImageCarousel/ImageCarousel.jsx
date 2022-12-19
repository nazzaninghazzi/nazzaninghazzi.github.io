import Slider from "react-slick";
import './ImageCarousel.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { API_URL } from "../../../api/api";

export default function ImageCarousel(props) {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        centerMode: true,
        variableWidth: false,
        autoplay: true,
        autoplaySpeed: 5000,
        arrows: true,
    };

    return (
        <div className="image-carousel">
            <Slider {...settings}>
                {props.images.map((image, index) => {
                    return (
                        <div className="image-items" key={index}>
                            <img src={`${API_URL}${image}`} alt="studio" />
                        </div>
                    )
                })}
            </Slider>
        </div>
    );
}
