import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { axiosInstance } from "../helpers/axiosInstance";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import { useEffect, useState } from "react";
import { Col, message, Row } from "antd";
import Airplane from "../components/Airplane";

function Home() {
  const { user } = useSelector(state => state.users);
  const dispatch = useDispatch();
  const [airplanes, setAirplanes] = useState([]);
  const getAirplanes = async () => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post(
        "/api/airplanes/get-all-airplanes",
        {}
      );
      dispatch(HideLoading());
      if (response.data.success) {
        setAirplanes(response.data.data);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };
  useEffect(() => {
    getAirplanes();
  }, []);
  return (  
    <div>
      <div></div>
      <div>
        <Row>
          {airplanes.map((airplane)=>(
            <Col lg={12} xs={24} sm={24}>
              <Airplane airplane={airplane}/>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}

export default Home;
