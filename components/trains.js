import React from "react";

const Trains = ({ trains }) => {
  //
  // phrase: String,
  // // net: Schema.Types.Mixed,
  // trainer_id: String,
  // net_id: String,
  // id: { required: true, type: String, unique: true },
  // train_data: String,
  // train_result: String,
  // timestamp: String
  return trains.map((train, index) => (
    <div
      style={{
        backgroundColor: "rgba(255,255,255,0.65)",
        padding: "20px",
        borderRadius: "10px",
        margin: "20px 0px",
        width: "calc(100% - 40px)"
      }}
    >
      <div>{`Train ID: ${train.id}`}</div>
      <div>{`Train Phrase: ${train.phrase}`}</div>
      <div>{`Train Net ID: ${train.net_id}`}</div>
      <div>{`Train Result: ${train.train_result}`}</div>
      <div>{`Train Date: ${train.timestamp}`}</div>
    </div>
  ));
};

export default Trains;
