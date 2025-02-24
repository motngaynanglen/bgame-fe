import { Card, Col, Row } from 'antd';
import Title from 'antd/es/typography/Title';
import { AiFillProfile } from 'react-icons/ai';
//   import { fetchCardData } from '@/app/lib/data';
interface dashboardCardType {
    field: string,
    data: {
        today: string,
        title: string,
        persent: string,
        bnb: "text-green-600" | "text-red-600"
    }
}
type iconType = "Sales" | "Clients" | "Orders" | "Users";
const count: dashboardCardType[] = [
    {
        field: "Sales",
        data: {
            today: "Today’s Sales",
            title: "$53,000",
            persent: "+30%",
            bnb: "text-green-600",
        },
    },
    {
        field: "Users",
        data: {
            today: "Today’s Users",
            title: "3,200",
            persent: "+20%",
            bnb: "text-green-600",
        },
    },
    {
        field: "Clients",
        data: {
            today: "New Clients",
            title: "+1,200",
            persent: "-20%",
            bnb: "text-red-600",
        },
    },
    {
        field: "Orders",
        data: {
            today: "New Orders",
            title: "$13,200",
            persent: "10%",
            bnb: "text-green-600",
        },
    },
];
const iconMap = {
    Sales: <AiFillProfile fontSize={50} />,
    Users: <AiFillProfile fontSize={50} />,
    Clients: <AiFillProfile fontSize={50} />,
    Orders: <AiFillProfile fontSize={50} />,
};

export default async function CardWrapper() {


    // const {
    //     totalOrder,
    //     numberOfCustomers,
    //     totalPartner,
    //     totalPetCenter,
    // }: {
    //     totalOrder: number,
    //     numberOfCustomers: number,
    //     totalPartner: number,
    //     totalPetCenter: number,
    // } = await fletchCardData();
    // async function fletchCardData() {
    //     if (sessionToken !== undefined) {
    //         try {
    //             const response = await adminDashboardApiRequest.getAdminCardData(sessionToken);
    //             const card = response.payload.data;
    //             return {
    //                 totalOrder: card.invoices ?? 0,
    //                 numberOfCustomers: card.users ?? 0,
    //                 totalPartner: card.partners ?? 0,
    //                 totalPetCenter: card.careCenters ?? 0
    //             }
    //         } catch (error) {
    //             console.log(error);
    //         }
    //     }
    //     return { totalOrder: 0, numberOfCustomers: 0, totalPartner: 0, totalPetCenter: 0 };

    // }
    return (
        <>
            {/* NOTE: comment in this code when you get to this point in the course */}
            {count.map((data) => (
                <AntdCustomCard key={data.field} value={data} type="Users" />
            ))}
        </>
    );
}

export function AntdCustomCard({
    value,
    type,
}: {
    value: dashboardCardType
    type: iconType
}) {
    const Icon = iconMap[type]
    return (
        <Col
            xs={24}
            sm={12}
            md={12}
            lg={6}
            xl={6}
            className="mb-8">
            <Card loading={false} variant='outlined'>
                <div className="number">
                    <Row align="middle" gutter={[24, 0]}>
                        <Col xs={18}>
                            <span>{value.field}</span>
                            <Title level={3}>
                                {value.data.title} <small className={value.data.bnb}>{value.data.persent}</small>
                            </Title>
                        </Col>
                        <Col xs={6}>
                            <div className="icon-box">{Icon}</div>
                        </Col>
                    </Row>
                </div>
            </Card>
        </Col>
    );
}
