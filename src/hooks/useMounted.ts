// Cái này dùng để fix React Hydration Error trong trang admin (ex: <div> in <li>) 
// Có thể không dùng cái này nếu đổi thẻ <div> thành <span> nhưng mà hiển thị sẽ không đẹp với phần noti
// :v hook này được tạo ra để biết 1 component được mount hay  chưa :D
import { useState, useEffect } from 'react';

const useMounted = () => {
    const [hasMounted, setHasMounted] = useState(false);
	useEffect(() => { setHasMounted(true); }, []);
	return hasMounted;
};

export default useMounted;
