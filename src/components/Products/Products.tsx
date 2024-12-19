import { Card } from "antd";
import React from "react";

export const getAlimeApi = async () => {
  const res = await fetch("https://anime-facts-rest-api.herokuapp.com/api/v1");
  const alimeData = await res.json();
  console.log("data: ", alimeData);
  return alimeData;
};
export default function Products() {
  return (
    <div>
      <Card
        hoverable
        style={{ width: 240 }}
        cover={
          <img
            alt="example"
            src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
          />
        }
      >
        
      </Card>
    </div>
  );
}
