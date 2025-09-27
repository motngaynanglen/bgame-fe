export default function Legend({ staffmode = false, className }: { staffmode?: boolean; className?: string }) {
    const isStaff = staffmode === true;

    return (
        <div className={`flex gap-4 flex-wrap mb-4 text-sm ${className}`}>
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 border rounded bg-white" /> Trống
            </div>
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-400 rounded" /> Đã đặt
            </div>
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-400 rounded" /> Bạn đã đặt
            </div>
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-300 rounded" /> Khoá
            </div>
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-400 rounded" /> Sự kiện
            </div>
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-400 rounded" /> Bạn đang chọn
            </div>
        </div>
    );
}