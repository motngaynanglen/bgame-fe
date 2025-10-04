'use client';
import AboutComponent from "@/src/components/About/AboutComponent";
import AboutRental from "@/src/components/About/AboutRental";
import Masonry from "@/src/components/Bits/Masonry";
import HotDeal from "@/src/components/Products/HotDeal";
import { CalendarOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Button, Space } from "antd";
import { useRouter } from "next/navigation";

const data = [
  {
    id: 1,
    image: "/assets/images/carousel1.jpg",
    label: "Hàng Mới Về",
    height: 300,
  },
  {
    id: 2,
    image: "/assets/images/carousel2.jpg",
    label: "Boardgame",
    height: 300,
  },
  {
    id: 3,
    image: "/assets/images/bg6.jpg",
    label: "Trading Card Game",
    height: 300,
  },
  // { id: 4, image: "/assets/images/bg4.jpg", label: "Phụ Kiện", height: 300 },
  {
    id: 5,
    image: "/assets/images/bg5.jpg",
    label: "Thuê Boardgame",
    height: 300,
  },
];

export default function Home() {
  const router = useRouter();
  return (
    <div className="bg-gray-100 ">
      <section className="relative  min-h-[600px] md:min-h-[auto] bg-gradient-to-b from-gray-900 to-gray-100 py-20 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-white mb-4">
            Board Game Impact
          </h2>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto">
            BoardGame Impact là chuỗi cửa hàng board game, nơi bạn có thể thuê
            hoặc mua những bộ game hấp dẫn để chơi cùng bạn bè và gia đình.
          </p>
          <Space size="large" className="my-4">
            <Button type="primary" size="large" className="h-12 px-8 text-lg" onClick={() => router.push('/products')}>
              <ShoppingCartOutlined /> Mua Game
            </Button>
            <Button
              size="large"
              className="h-12 px-8 text-lg bg-white text-gray-900"
              onClick={() => router.push('/rental')}
            >
              <CalendarOutlined /> Đặt Chỗ Chơi
            </Button>
          </Space>
          <div className="pt-8">
            <Masonry data={data} />
          </div>
        </div>
        <div
          className="
      pointer-events-none
      absolute inset-0
      bg-[radial-gradient(#0000001a_1px,_transparent_1px)]
      bg-[size:16px_16px]
      [mask-image:radial-gradient(circle_80%_at_50%_50%,#000_70%,transparent_110%)]
      z-0
    "
        />
      </section>
      <main className="">
        {/* <Banner /> */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 max-w-7xl 2xl:max-w-screen-2xl">
          <div className="pb-8 ">
            <HotDeal category="Sản phẩm nổi bật" />
          </div>
          <Space />
          <AboutRental />
          <AboutComponent />
          <Space />

          <div className="py-8"> </div>

          {/* <div className="pb-8">
            <HotDeal category="Sản phẩm mới về" />
          </div> */}
        </div>
      </main>
    </div>
  );
}

// 'use client';
// import React from 'react';
// import { Button, Card, Row, Col, Typography, Space, Divider, Tag } from 'antd';
// import {
//   RocketOutlined,
//   TrophyOutlined,
//   TeamOutlined,
//   StarOutlined,
//   ShoppingCartOutlined,
//   CalendarOutlined,
//   SwapOutlined,
//   EnvironmentOutlined,
//   PhoneOutlined,
//   MailOutlined
// } from '@ant-design/icons';

// const { Title, Paragraph, Text } = Typography;

// const BoardGameHomePage = () => {
//   // Featured board games
//   const featuredGames = [
//     {
//       id: 1,
//       name: 'Catan',
//       image: '/images/catan.jpg',
//       category: 'Chiến thuật',
//       players: '3-4',
//       time: '60-90 phút',
//       price: 450000,
//       rentPrice: 50000
//     },
//     {
//       id: 2,
//       name: 'Ticket to Ride',
//       image: '/images/ticket-to-ride.jpg',
//       category: 'Gia đình',
//       players: '2-5',
//       time: '30-60 phút',
//       price: 350000,
//       rentPrice: 40000
//     },
//     {
//       id: 3,
//       name: 'Codenames',
//       image: '/images/codenames.jpg',
//       category: 'Party Game',
//       players: '2-8+',
//       time: '15 phút',
//       price: 250000,
//       rentPrice: 30000
//     },
//     {
//       id: 4,
//       name: '7 Wonders',
//       image: '/images/7-wonders.jpg',
//       category: 'Văn minh',
//       players: '2-7',
//       time: '30 phút',
//       price: 550000,
//       rentPrice: 60000
//     }
//   ];

//   const services = [
//     {
//       icon: <ShoppingCartOutlined className="text-4xl" />,
//       title: 'Mua Board Game',
//       description: 'Sở hữu những board game chính hãng với giá tốt nhất. Đa dạng thể loại từ gia đình đến chiến thuật.',
//       features: ['Giá cả cạnh tranh', 'Sản phẩm chính hãng', 'Bảo hành 1 năm', 'Giao hàng toàn quốc'],
//       color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//       action: 'Mua ngay'
//     },
//     {
//       icon: <CalendarOutlined className="text-4xl" />,
//       title: 'Thuê Board Game',
//       description: 'Trải nghiệm hàng ngàn board game ngay tại cửa hàng với không gian chơi game thoải mái, hiện đại.',
//       features: ['Hơn 1000 tựa game', 'Không gian riêng tư', 'Hướng dẫn viên', 'Đồ uống miễn phí'],
//       color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
//       action: 'Đặt chỗ ngay'
//     },
//     {
//       icon: <SwapOutlined className="text-4xl" />,
//       title: 'Ký Gửi Board Game',
//       description: 'Mang board game của bạn đến ký gửi và kiếm thêm thu nhập. Chúng tôi chăm sóc và bảo quản cẩn thận.',
//       features: ['Hoa hồng hấp dẫn', 'Bảo quản chuyên nghiệp', 'Bảo hiểm sản phẩm', 'Thanh toán định kỳ'],
//       color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
//       action: 'Ký gửi ngay'
//     }
//   ];

//   const stats = [
//     { number: '50+', label: 'Cửa hàng' },
//     { number: '1000+', label: 'Board Game' },
//     { number: '50,000+', label: 'Khách hàng' },
//     { number: '5★', label: 'Đánh giá' }
//   ];

//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat('vi-VN', {
//       style: 'currency',
//       currency: 'VND'
//     }).format(amount);
//   };

//   return (
//     <div className="min-h-screen">
//       {/* Hero Section */}
//       <section
//         className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
//         style={{
//           backgroundImage: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(/images/board-game-hero.jpg)'
//         }}
//       >
//         <div className="text-center text-white px-4 max-w-4xl">
//           <Title level={1} className="!text-5xl !md:text-7xl !font-bold !mb-6 !text-white">
//             🎲 Board Game Impact
//           </Title>
//           <Paragraph className="!text-xl !md:text-2xl !mb-8 !text-gray-200">
//             Khám phá thế giới board game đầy màu sắc - Nơi kết nối niềm vui và trí tuệ
//           </Paragraph>
//           <Space size="large" className="mb-12">
//             <Button type="primary" size="large" className="h-12 px-8 text-lg">
//               <ShoppingCartOutlined /> Mua Game
//             </Button>
//             <Button size="large" className="h-12 px-8 text-lg bg-white text-gray-900">
//               <CalendarOutlined /> Đặt Chỗ Chơi
//             </Button>
//           </Space>

//           <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
//             {stats.map((stat, index) => (
//               <div key={index} className="text-center">
//                 <div className="text-3xl font-bold text-yellow-400">{stat.number}</div>
//                 <div className="text-gray-300">{stat.label}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Services Section */}
//       <section className="py-20 bg-gray-50">
//         <div className="container mx-auto px-4">
//           <div className="text-center mb-16">
//             <Tag color="blue" className="text-lg px-4 py-1 mb-4">DỊCH VỤ</Tag>
//             <Title level={2} className="!text-4xl !font-bold">
//               Trải Nghiệm Board Game Trọn Vẹn
//             </Title>
//             <Paragraph className="!text-xl !text-gray-600 max-w-2xl mx-auto">
//               Chúng tôi mang đến đa dạng dịch vụ để bạn có thể tận hưởng thế giới board game theo cách của riêng mình
//             </Paragraph>
//           </div>

//           <Row gutter={[32, 32]}>
//             {services.map((service, index) => (
//               <Col xs={24} lg={8} key={index}>
//                 <Card
//                   className="h-full rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-0 overflow-hidden"
//                   bodyStyle={{ padding: 0 }}
//                 >
//                   <div
//                     className="h-48 flex items-center justify-center text-white"
//                     style={{ background: service.color }}
//                   >
//                     {service.icon}
//                   </div>

//                   <div className="p-8">
//                     <Title level={3} className="!text-2xl !mb-4">
//                       {service.title}
//                     </Title>

//                     <Paragraph className="!text-gray-600 !mb-6">
//                       {service.description}
//                     </Paragraph>

//                     <div className="space-y-2 mb-8">
//                       {service.features.map((feature, idx) => (
//                         <div key={idx} className="flex items-center text-gray-700">
//                           <StarOutlined className="text-green-500 mr-2" />
//                           {feature}
//                         </div>
//                       ))}
//                     </div>

//                     <Button
//                       type="primary"
//                       size="large"
//                       block
//                       className="h-12 text-lg"
//                       style={{ background: service.color.split('0%')[0] + '100%)' }}
//                     >
//                       {service.action}
//                     </Button>
//                   </div>
//                 </Card>
//               </Col>
//             ))}
//           </Row>
//         </div>
//       </section>

//       {/* Featured Games Section */}
//       <section className="py-20">
//         <div className="container mx-auto px-4">
//           <div className="text-center mb-16">
//             <Tag color="green" className="text-lg px-4 py-1 mb-4">SẢN PHẨM</Tag>
//             <Title level={2} className="!text-4xl !font-bold">
//               Board Game Nổi Bật
//             </Title>
//             <Paragraph className="!text-xl !text-gray-600">
//               Khám phá những board game được yêu thích nhất
//             </Paragraph>
//           </div>

//           <Row gutter={[24, 24]}>
//             {featuredGames.map((game) => (
//               <Col xs={24} sm={12} lg={6} key={game.id}>
//                 <Card
//                   className="rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-0 h-full"
//                   cover={
//                     <div className="h-48 bg-gray-200 flex items-center justify-center">
//                       <div className="text-4xl">🎮</div>
//                     </div>
//                   }
//                 >
//                   <div className="text-center">
//                     <Title level={4} className="!mb-2">{game.name}</Title>
//                     <div className="flex justify-center gap-2 mb-3">
//                       <Tag color="blue">{game.category}</Tag>
//                       <Tag color="green">{game.players} người</Tag>
//                     </div>
//                     <Text type="secondary" className="block mb-2">
//                       ⏱️ {game.time}
//                     </Text>

//                     <Divider className="my-3" />

//                     <div className="space-y-2">
//                       <div className="flex justify-between items-center">
//                         <Text strong>Mua:</Text>
//                         <Text strong className="text-green-600">
//                           {formatCurrency(game.price)}
//                         </Text>
//                       </div>
//                       <div className="flex justify-between items-center">
//                         <Text>Thuê:</Text>
//                         <Text className="text-blue-600">
//                           {formatCurrency(game.rentPrice)}/ngày
//                         </Text>
//                       </div>
//                     </div>

//                     <Space className="mt-4 w-full" direction="vertical">
//                       <Button type="primary" block>
//                         <ShoppingCartOutlined /> Mua ngay
//                       </Button>
//                       <Button block>
//                         <CalendarOutlined /> Thuê chơi
//                       </Button>
//                     </Space>
//                   </div>
//                 </Card>
//               </Col>
//             ))}
//           </Row>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
//         <div className="container mx-auto px-4 text-center text-white">
//           <Title level={2} className="!text-4xl !font-bold !text-white !mb-4">
//             Sẵn sàng khám phá thế giới board game?
//           </Title>
//           <Paragraph className="!text-xl !text-purple-100 !mb-8 max-w-2xl mx-auto">
//             Tham gia cộng đồng yêu thích board game lớn nhất Việt Nam. Trải nghiệm, kết nối và tận hưởng những giây phút giải trí tuyệt vời.
//           </Paragraph>
//           <Space size="large">
//             <Button size="large" className="h-12 px-8 text-lg bg-white text-purple-600">
//               <TeamOutlined /> Tham gia ngay
//             </Button>
//             <Button size="large" className="h-12 px-8 text-lg border-white text-white">
//               <EnvironmentOutlined /> Tìm cửa hàng
//             </Button>
//           </Space>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-gray-900 text-white py-12">
//         <div className="container mx-auto px-4">
//           <Row gutter={[32, 32]}>
//             <Col xs={24} md={8}>
//               <Title level={4} className="!text-white !mb-4">
//                 🎲 Board Game Impact
//               </Title>
//               <Paragraph className="!text-gray-400">
//                 Chuỗi cửa hàng board game hàng đầu Việt Nam, mang đến trải nghiệm giải trí chất lượng cao cho mọi lứa tuổi.
//               </Paragraph>
//             </Col>
//             <Col xs={24} md={8}>
//               <Title level={4} className="!text-white !mb-4">Liên hệ</Title>
//               <div className="space-y-2">
//                 <div className="flex items-center text-gray-400">
//                   <EnvironmentOutlined className="mr-2" />
//                   123 Đường ABC, Quận 1, TP.HCM
//                 </div>
//                 <div className="flex items-center text-gray-400">
//                   <PhoneOutlined className="mr-2" />
//                   0123 456 789
//                 </div>
//                 <div className="flex items-center text-gray-400">
//                   <MailOutlined className="mr-2" />
//                   contact@boardgameimpact.com
//                 </div>
//               </div>
//             </Col>
//             <Col xs={24} md={8}>
//               <Title level={4} className="!text-white !mb-4">Dịch vụ</Title>
//               <div className="space-y-2">
//                 <div className="text-gray-400">• Mua board game</div>
//                 <div className="text-gray-400">• Thuê board game</div>
//                 <div className="text-gray-400">• Ký gửi board game</div>
//                 <div className="text-gray-400">• Tổ chức event</div>
//               </div>
//             </Col>
//           </Row>
//           <Divider className="!border-gray-700 !my-8" />
//           <div className="text-center text-gray-500">
//             © 2024 Board Game Impact. All rights reserved.
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default BoardGameHomePage;
