"use client";
import React, { useState, useEffect } from "react";
import { Card, DatePicker, Tag } from "antd";
import type { CSSProperties } from "react";
import bookListApiRequest from "@/src/apiRequests/bookList";
import { formatDateTime } from "@/src/lib/utils";
import CustomDatePicker from "@/src/components/DateRantalPicker/DateRental";
import dayjs from "dayjs";

interface TimeSlot {
  key: number;
  end: number;
  value: number;
}

function TimeSlotDisplay({ storeid, date }: { storeid: string; date?: Date }) {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState<
    [dayjs.Dayjs | null, dayjs.Dayjs | null] | null
  >(null);

  useEffect(() => {
    const fetchTimeSlots = async () => {
      try {
        setLoading(true);
        // Mock data - replace with real API call

        const response = await bookListApiRequest.getBookAvailableSlot({
          storeId: storeid,
          date: date ?? new Date(),
        });
        const timeSlot: TimeSlot[] = response.data.map((item: any) => ({
          key: item.key,
          end: item.key + 1,
          value: item.value,
        }));

        setTimeSlots(timeSlot);
      } catch (error) {
        console.error("Error fetching time slots:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTimeSlots();
  }, [storeid]);

  const timeSlotStyle = (value: number): CSSProperties => ({
    padding: "12px 0",
    textAlign: "center",
    border: "1px solid #d9d9d9",
    borderRadius: "4px",
    backgroundColor:
      value === 1 ? "rgba(255, 77, 79, 0.2)" : "rgba(102, 187, 106, 0.2)",
    color: value === 1 ? "#ff4d4f" : "#66bb6a",
    margin: "0 2px",
    flex: 1,
    minWidth: "60px",
    height: "50px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
    transition: "all 0.3s ease",
  });

  const containerStyle: CSSProperties = {
    display: "flex",
    position: "relative",
    // marginTop: "10px",
    padding: "8px 0",
  };

  const timeMarkerStyle: CSSProperties = {
    position: "absolute",
    top: "-25px",
    fontSize: "12px",
    fontWeight: "bold",
    color: "#666",
  };
  const cardTitle = () => {
    return (
      <div className="flex justify-between">
        <span style={{ fontSize: "18px" }}>Khung Thời Gian Cửa Hàng</span>
        <span style={{ fontSize: "18px" }}>
          Ngày:{" "}
          {/* {" " + (date !== undefined ? formatDateTime(date, "DATE") : formatDateTime(new Date(), "DATE"))} */}
          <DatePicker type="date" />
        </span>
      </div>
    );
  };
  return (
    <Card title={cardTitle()} loading={loading}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {/* Time slots display */}
        <div style={containerStyle}>
          {/* Time markers */}
          {/* {timeSlots.map((slot, index) => (
            <React.Fragment key={`marker-${index}`}>
              {index === 0 && (
                <div style={{ ...timeMarkerStyle, left: "0" }}>
                  {`${slot.key}h`}
                </div>
              )}
              <div
                style={{ ...timeMarkerStyle, left: `${(index + 1) * 80}px` }}
              >
                {`${slot.end}h`}
              </div>
            </React.Fragment>
          ))} */}

          {/* Time slots */}
          {timeSlots.map((slot, index) => (
            <div key={`slot-${index}`} style={timeSlotStyle(slot.value)}>
              <span>
                {slot.key}h - {slot.end}h
              </span>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
            gap: "16px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: "rgba(102, 187, 106, 0.2)",
                border: "1px solid #66bb6a",
                marginRight: "8px",
              }}
            ></div>
            <span>TRỐNG </span>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: "rgba(255, 77, 79, 0.2)",
                border: "1px solid #ff4d4f",
                marginRight: "8px",
              }}
            ></div>
            <span>BẬN </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default TimeSlotDisplay;
