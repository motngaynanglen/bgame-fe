'use client';

import React, { useState, useEffect } from 'react';
import { Skeleton, Typography } from 'antd';
import moment from 'moment';
import 'moment/locale/vi'; // Import locale tiếng Việt cho moment

const { Text } = Typography;

export default function Clock({ className = "" }: { className?: string }) {
    const [time, setTime] = useState(moment());
    const [hasMounted, setHasMounted] = useState(false); // Thêm state để kiểm tra component đã mount chưa

    useEffect(() => {
        setHasMounted(true);

        // Cập nhật thời gian mỗi giây
        const timerId = setInterval(() => {
            setTime(moment());
        }, 1000);

        // Dọn dẹp interval khi component unmount
        return () => clearInterval(timerId);
    }, []);

    // Định dạng ngày giờ hiển thị
    const formattedDateTime = time.format('dddd, [ngày] D [tháng] M [năm] YYYY, H:mm:ss');
    if (!hasMounted) {
        return (<Skeleton.Input active />);
    }
    return (
        <Text className={className}>
           {formattedDateTime}
        </Text>
    );
};

