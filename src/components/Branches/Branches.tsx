import React from "react";

const branches = [
  { phone: "02871000132", address: "134 Nguyễn Thái Học, P. Phạm Ngũ Lão" },
  { phone: "02871000218", address: "218-220 Trần Quang Khải, Phường Tân Định" },
  { phone: "02871066159", address: "157-159 Nguyễn Thị Minh Khai, Q.1" },
  { phone: "02871083355", address: "55B Trần Quang Khải, P. Tân Định" },
  { phone: "02871000139", address: "139 Trần Não, P. Bình An, Quận 2" },
  {
    phone: "02871010190",
    address: "190 Nguyễn Thị Định, khu phố 2, P. An Phú",
  },
];

function BranchScrollTable() {
  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <h2 className="text-xl font-bold">Tìm chi nhánh</h2>
      </div>
      <div className="flex items-center gap-4 mb-4">
        <select className="border rounded p-2">
          <option>Hồ Chí Minh</option>
          <option>Hà Nội</option>
          <option>Đà Nẵng</option>
        </select>
        <select className="border rounded p-2">
          <option>Quận/Huyện</option>
          <option>Quận 1</option>
          <option>Quận 2</option>
        </select>
      </div>
      <p className="mb-2">Có {branches.length} cửa hàng có sản phẩm</p>
      <div className="border rounded overflow-y-scroll h-48 bg-white shadow">
        <table className="table-auto w-full text-left">
          <tbody>
            {branches.map((branch, index) => (
              <tr key={index} className="border-b last:border-0">
                <td className="p-2">
                  <span className="text-red-500">☎ {branch.phone}</span>
                </td>
                <td className="p-2">
                  <a
                    href={`https://maps.google.com/?q=${branch.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {branch.address}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BranchScrollTable;
