import React from 'react';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { Row, Col, Button } from 'antd';
import { ExCollection } from '../../../models/exCollection';
import { Link } from 'react-router-dom';

export const CarouselView = (props: { data: ExCollection[] }) => {
  return (
    <div className="carousel-container">
      <Carousel
        showArrows={false}
        showThumbs={false}
        autoPlay
        infiniteLoop
        className="carousel-content"
      >
        {props.data.map((item, index) => (
          <CarouselCard key={index} collection={item} />
        ))}
      </Carousel>
    </div>
  );
};

const CarouselCard = (props: { collection: ExCollection }) => {
  const buttonName =
    props.collection.type === 'launchpad'
      ? 'Go to Launchpad'
      : 'Explore collection';
  const url =
    props.collection.type === 'launchpad'
      ? `/launchpad/${props.collection.symbol}`
      : props.collection.market
      ? `/marketplace/${props.collection.symbol}?market=${props.collection.market}`
      : `/marketplace/${props.collection.symbol}`;

  return (
    <Row className="card-container">
      <Col span={24} md={24} lg={10} className="card-content">
        <h2>{props.collection.name}</h2>
        <p>{props.collection.description}</p>
        <Link to={url}>
          <Button className="button">{buttonName}</Button>
        </Link>
      </Col>
      <Col
        span={24}
        md={24}
        lg={14}
        className="image-content"
        style={{
          backgroundImage: `url(${props.collection.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
        }}
      ></Col>
    </Row>
  );
};