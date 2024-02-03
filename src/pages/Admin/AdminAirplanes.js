import React, { useEffect, useState } from "react";
import PageTitle from "../../components/PageTitle";
import AirplaneForm from "../../components/AirplaneForm";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../redux/alertsSlice";
import { message, Table } from "antd";
import { axiosInstance } from "../../helpers/axiosInstance";
import moment from "moment";

function AdminAirplanes() {
  const dispatch = useDispatch();
  const [showAirplaneForm, setShowAirplaneForm] = useState(false);
  const [airplanes, setAirplanes] = useState([]);
  const [selectedAirplane, setSelectedAirplane] = useState(null);
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
  const deleteAirplane = async (id) => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post(
        "/api/airplanes/delete-airplane",
        {
          _id: id,
        }
      );
      dispatch(HideLoading());
      if (response.data.success) {
        message.success(response.data.message);
        getAirplanes();
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Number",
      dataIndex: "number",
    },
    {
      title: "From",
      dataIndex: "from",
    },
    {
      title: "To",
      dataIndex: "to",
    },
    {
      title: "Journey Date",
      dataIndex: "journeyDate",
      // render: (journeyDate) => moment(journeyDate).format("DD-MM-YYYY"),
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (action, record) => (
        <div className="d-flex gap-3">
          <i
            class="ri-delete-bin-line"
            onClick={() => {
              deleteAirplane(record._id);
            }}
          ></i>
          <i
            class="ri-pencil-line"
            onClick={() => {
              setSelectedAirplane(record);
              setShowAirplaneForm(true);
            }}
          ></i>
        </div>
      ),
    },
  ];

  useEffect(() => {
    getAirplanes();
  }, []);
  return (
    <div>
      <div className="d-flex justify-content-between">
        <PageTitle title="Airplanes" />
        <button
          onClick={() => setShowAirplaneForm(true)}
          className="primary-btn"
        >
          Add Airplane
        </button>
      </div>
      <Table columns={columns} dataSource={airplanes} />

      {showAirplaneForm && (
        <AirplaneForm
          showAirplaneForm={showAirplaneForm}
          setShowAirplaneForm={setShowAirplaneForm}
          type={selectedAirplane ? "edit" : "add"}
          selectedAirplane={selectedAirplane}
          setSelectedAirplane={setSelectedAirplane}
          getData={getAirplanes}
        />
      )}
    </div>
  );
}

export default AdminAirplanes;
