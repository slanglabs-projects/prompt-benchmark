import React from 'react';
import Footer from './Footer';
import './EloScoringPlatform.css';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import PSImage from '../assets/PS.png'; 
import TSImage from '../assets/TS.jpg'; 
import { Link } from 'react-router-dom';



const EloScoringPlatform = () => {
  return (
    <div>
          <div>
            <p class="intro">Inspired by LMSYS, this benchmarking tool enables you to compare the performance of prompts generated by a variety of frameworks. We currently support Claude, DSPy, Conva.AI, and Human prompts. </p>
            <br/>
            <div className="button-container">
              <Link to="/arena">
                <button className="button">Go to Arena</button>
              </Link>
              <Link to="/leaderboard">
                <button className="button">View Leaderboard</button>
              </Link>
            </div>
            <br/>
            <div class="list">
            <h2 >Get Started : </h2>
            <ol>
              <li><strong>Choose a Category:</strong> Select between Product Search or Travel Search.</li>
              <li><strong>Enter a Query:</strong> Type a query related to your chosen category.</li>
              <li><strong>Compare Responses:</strong> Two responses will be generated. Vote for the one you think is best.</li>
              <li><strong>See the Results:</strong> After voting, the names of the models will be revealed, and the leaderboard will update accordingly.</li>
            </ol>
            </div>
          </div>
          <div className='carousel'>
            <h2>Use Cases:</h2>
            <Carousel showThumbs={false} showIndicators={false} showStatus={false}>
              <div>
                <img src={PSImage} alt="Product Search" />
                <div class="list">
                  <h2 >Product Search: </h2>
                  <p>In this use case, users can select the "Product Search" category and enter a query related to any product they are looking for, including aspects like product name, category, price range, sizes, and sorting preferences. After submitting their query, users will receive structured responses that help them discover relevant products, including suggestions for related items and applicable filters such as price, ratings, and availability. Users can then pick the best response and check the leaderboard to see how their query compares with other frameworks. This JSON response can be utilized by the user to use it elsewhere, enhancing the online shopping experience by efficiently interpreting natural language queries to deliver tailored product recommendations without disclosing the underlying AI prompts.</p>
                </div>
              </div>
              <div>
                <img src={TSImage} alt="Travel Search" />
                <div class="list">
                  <h2 >Travel Search: </h2>
                  <p>In this use case, users can input their travel requests, specifying details such as the starting location, destination, date of departure, return date (if applicable), and preferred mode of transport (Bus, Train, or Flight). The system will validate the source and destination codes to ensure they match valid state, airport, or railway station codes. Depending on the chosen mode of transport, users can apply various filters, including options for air conditioning, seating type, class, and amenities. Additionally, sorting preferences based on price, popularity, and customer ratings can be specified. After processing the query, the system will return a structured JSON response containing only the relevant details, enabling users to efficiently find and book their travel options while also allowing them to utilize the response elsewhere.</p>
                </div>
              </div>
            </Carousel>
          </div>
      <Footer />
    </div>
  );
};

export default EloScoringPlatform;
