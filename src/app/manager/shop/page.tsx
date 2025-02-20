"use client"
import { Card } from "antd";
import { useEffect, useState } from "react";

export default function ManagerManageShop() {
    const [number1, setnumber1] = useState<string>('0');
    const [number2, setnumber2] = useState<string>('0');
    const [total, setTotal] = useState<number>(0);
    useEffect(() => {
        const num1 = +number1;
        const num2 = +number2;
        setTotal(num1 + num2) 
    })
    return (
        <>
            <Card style={{ minHeight: "100vh" }}>
                <p className="text-center text-xl font-bold text-red"> Phép tính cơ bản </p>
                <input onChange={(e) => setnumber1(e.target.value)} type="number" className="bg-blue-100 rounded-md border-2 border-blue-700 px-2 w-20" />
                <span> + </span>
                <input onChange={(e) => setnumber2(e.target.value)} type="number" className="bg-blue-100 rounded-md border-2 border-blue-700 px-2 w-20" />
                <span> = </span>
                <input value={total} readOnly className="bg-blue-100 rounded-md border-2 border-blue-700 px-2 w-20" />
            </Card>
        </>
    )
}