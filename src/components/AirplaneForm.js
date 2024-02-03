import React from "react";
import { Modal, Col, Form, Row, message } from "antd";
import { useDispatch } from "react-redux";
import { axiosInstance } from "../helpers/axiosInstance.js";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import moment from "moment/moment";

function AirplaneForm({
  showAirplaneForm,
  setShowAirplaneForm,
  type = "add",
  getData,
  selectedAirplane,
  setSelectedAirplane,
}) {
  const dispatch = useDispatch();
  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());
      let response = null;
      if (type === "add") {
        response = await axiosInstance.post(
          "/api/airplanes/add-airplane",
          values
        );
      } else {
        response = await axiosInstance.post("/api/airplanes/update-airplane", {
          ...values,
          _id: selectedAirplane._id,
        });
      }

      if (response.data.success) {
        message.success(response.data.message);
      } else {
        message.error(response.data.message);
      }
      getData();
      setShowAirplaneForm(false);
      setSelectedAirplane(null);

      dispatch(HideLoading());
    } catch (error) {
      message.error(error.message);
      dispatch(HideLoading());
    }
  };
  return (
    <Modal
      width={800}
      title={type === "add" ? "Add Bus" : "Update Bus"}
      visible={showAirplaneForm}
      onCancel={() => {
        setSelectedAirplane(null);
        setShowAirplaneForm(false);
      }}
      footer={false}
    >
      <Form
        layout="vertical"
        onFinish={onFinish}
        initialValues={selectedAirplane}
      >
        <Row gutter={[10, 10]}>
          <Col lg={24} xs={24}>
            <Form.Item label="Airplane Name" name="name">
              <input type="text" />
            </Form.Item>
          </Col>
          <Col lg={12} xs={24}>
            <Form.Item label="Airplane Number" name="number">
              <input type="text" />
            </Form.Item>
          </Col>
          <Col lg={12} xs={24}>
            <Form.Item label="Capacity" name="capacity">
              <input type="text" />
            </Form.Item>
          </Col>
          <Col lg={12} xs={24}>
            <Form.Item label="From" name="from">
              <input type="text" />
            </Form.Item>
          </Col>
          <Col lg={12} xs={24}>
            <Form.Item label="To" name="to">
              <input type="text" />
            </Form.Item>
          </Col>
          <Col lg={8} xs={24}>
            <Form.Item label="Journey Date" name="journeyDate">
              <input type="date" />
            </Form.Item>
          </Col>
          <Col lg={8} xs={24}>
            <Form.Item label="Departure" name="departure">
              <input type="text" />
            </Form.Item>
          </Col>
          <Col lg={8} xs={24}>
            <Form.Item label="Arrival" name="arrival">
              <input type="text" />
            </Form.Item>
          </Col>
          <Col lg={12} xs={24}>
            <Form.Item label="Type" name="type">
              <input type="text" />
            </Form.Item>
          </Col>
          <Col lg={12} xs={24}>
            <Form.Item label="Fare" name="fare">
              <input type="text" />
            </Form.Item>
          </Col>
        </Row>
        <div className="d-flex justify-content-end">
          <button className="primary-btn" type="submit">
            Save
          </button>
        </div>
      </Form>
    </Modal>
  );
}
export default AirplaneForm;
