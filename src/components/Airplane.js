import React from "react";
import { useNavigate } from "react-router-dom";

function Airplane({ airplane }) {
  const navigate = useNavigate();
  return (
    <div className="card p-2">
      <h1 className="text-lg primary-text">{airplane.name}</h1>
      <hr />
      <div className="d-flex justify-content-between">
        <div>
          <p className="text-sm">From</p>
          <p className="text-sm">{airplane.from}</p>
        </div>

        <div>
          <p className="text-sm">To</p>
          <p className="text-sm">{airplane.to}</p>
        </div>

        <div>
          <p className="text-sm">Fare</p>
          <p className="text-sm">$ {airplane.fare} /-</p>
        </div>
      </div>
      <hr />
      <div className="d-flex justify-content-between align-items-end">
        <div>
          <p className="text-sm">Joureny Date</p>
          <p className="text-sm">{airplane.journeyDate}</p>
        </div>

        <h1 className="text-lg underline secondary-text" onClick={()=>{
            navigate(`/book-now/${airplane._id}`)
        }}>Book Now</h1>
      </div>
    </div>
  );
}

export default Airplane;
