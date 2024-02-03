import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { axiosInstance } from "../helpers/axiosInstance";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import { useEffect, useState } from "react";
import { Col, message, Row } from "antd";
import { useParams } from "react-router-dom";
import SeatSelection from "../components/SeatSelection";
import StripeCheckout from "react-stripe-checkout";

function BookNow() {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const params = useParams();
  const dispatch = useDispatch();
  const [airplane, setAirplane] = useState(null);
  const onToken = async (token) => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post("/api/bookings/make-payment", {
        token,
        amount: selectedSeats.length * airplane.fare * 100,
      });
      dispatch(HideLoading());
      if (response.data.success) {
        message.success(response.data.message);
        bookNow(response.data.data.transactionId);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const getAirplane = async () => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post(
        "/api/airplanes/get-airplane-by-id",
        { _id: params.id }
      );
      dispatch(HideLoading());
      if (response.data.success) {
        setAirplane(response.data.data);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };
  
  const bookNow = async () => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post("/api/bookings/book-seat", {
        airplane: airplane._id,
        seats: selectedSeats,
      });
      dispatch(HideLoading());
      if (response.data.success) {
        message.success(response.data.message);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };
  useEffect(() => {
    getAirplane();
  }, []);
  return (
    <div>
      {airplane && (
        <Row className="mt-3" gutter={[30, 30]}>
          <Col lg={12} xs={24} sm={24}>
            <h1 className="text-2xl primary-text">{airplane.name}</h1>
            <h1 className="text-md">
              {airplane.from} - {airplane.to}
            </h1>
            <hr />

            <div className="flex flex-col gap-2">
              <p className="text-md">Jourey Date : {airplane.journeyDate}</p>
              <p className="text-md">Fare : $ {airplane.fare} /-</p>
              <p className="text-md">Departure Time : {airplane.departure}</p>
              <p className="text-md">Arrival Time : {airplane.arrival}</p>
              <p className="text-md">Capacity : {airplane.capacity}</p>
              <p className="text-md">
                Seats Left : {airplane.capacity - airplane.seatsBooked.length}
              </p>
            </div>
            <hr />
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl">
                Selected Seats : {selectedSeats.join(", ")}
              </h1>
              <h1 className="text-2xl mt-2">
                Fare : {airplane.fare * selectedSeats.length} /-
              </h1>
              <hr />
              <StripeCheckout
                billingAddress
                amount={airplane.fare * selectedSeats.length * 100}
                currency="NPR"
                token={onToken}
                // amount={bus.fare * selectedSeats.length * 100}
                // currency="INR"
                stripeKey="pk_test_51NbK7TFJBc36ubyzMTshZPT1Q5YMxst1hhCWSga2OkzQ7yp1HeRQ4EIk30lUKahlkQm622jfuY4cCjyG4ORPCnJY006e1qg7MD"
              >
                <button
                  className={`primary-btn ${
                    selectedSeats.length === 0 && "disabled-btn"
                  }`}
                  disabled={selectedSeats.length === 0}
                >
                  Book Now
                </button>
              </StripeCheckout>
            </div>
            </Col>
            <Col lg={12} xs={24} sm={24}>
            <SeatSelection
              selectedSeats={selectedSeats}
              setSelectedSeats={setSelectedSeats}
              airplane={airplane}
            />
          </Col>
        </Row>
      )}
    </div>
  );
}

export default BookNow;
