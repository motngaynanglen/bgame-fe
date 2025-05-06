"use client";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface IFormInput {
  name: string;
  phone: string;
  email: string;
  productName: string;
  price: number;
  condition: string;
  missing: string;
}

export default function Consignment() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();
  const onSubmit: SubmitHandler<IFormInput> = (data) => console.log(data);
  return (
    <div className="bg-sky-50 py-10">
      <div className="container mx-auto max-w-4xl px-4">
        <h1 className="text-3xl font-bold text-center text-sky-900 mb-8">
          Dịch vụ ký gửi Boardgame đã qua sử dụng
        </h1>

        <section className="mb-6">
          <p className="text-gray-800 leading-relaxed">
            BoardGame Impact cung cấp dịch vụ ký gửi boardgame đã qua sử dụng
            với mức giá hấp dẫn. Mỗi mặt hàng đều được mô tả rõ ràng tình trạng
            và độ hoàn thiện do Người bán cung cấp.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-sky-800 mb-2">
            1. Điều kiện mặt hàng
          </h2>
          <ul className="list-disc list-inside text-gray-800 space-y-1">
            <li>
              Chấp nhận các boardgame và bản mở rộng gốc (hàng real) đã qua sử
              dụng.
            </li>
            <li>Không chấp nhận mô hình thu nhỏ, xúc xắc và phụ kiện.</li>
            <li>
              Người bán có thể gửi tối đa 5 mặt hàng hoặc 1 lô sản phẩm (nhiều
              món thành một).
            </li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-sky-800 mb-2">
            2. Cách thức gửi hàng
          </h2>
          <p className="text-gray-800 leading-relaxed">
            Người bán cần hoàn thành biểu mẫu ký gửi cho từng mặt hàng/lô hàng.
            Mẫu có sẵn trên website và cửa hàng. Các mặt hàng sẽ được gắn Thẻ
            tình trạng (dán bằng keo Post-It) và bọc màng co trước khi được
            trưng bày.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-sky-800 mb-2">
            3. Thanh toán
          </h2>
          <p className="text-gray-800 leading-relaxed">
            Trong vòng 3 ngày làm việc sau khi bán thành công, Người bán sẽ nhận
            được tín dụng cửa hàng bằng 75% giá niêm yết.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-sky-800 mb-2">
            4. Chính sách hoàn trả & thời gian ký gửi
          </h2>
          <p className="text-gray-800 leading-relaxed">
            Hàng ký gửi sẽ được giữ tối đa 60 ngày. Nếu không bán được, Người
            bán có 30 ngày để nhận lại sản phẩm. Sau thời hạn, hàng sẽ được xem
            là từ bỏ.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-sky-800 mb-2">
            5. Quyền từ chối
          </h2>
          <p className="text-gray-800 leading-relaxed">
            BoardGame Impact có quyền từ chối bất kỳ mặt hàng nào vì lý do: tình
            trạng, nhu cầu thị trường, trùng lặp sản phẩm hoặc lý do khác.
          </p>
        </section>

        <p className="text-sm text-gray-500 text-center mt-12">
          — BoardGame Impact —
        </p>
      </div>
      <div className="max-w-4xl mt-10 mx-auto p-6 bg-white shadow rounded-md text-sm text-gray-800">
        <h1 className="text-xl font-semibold mb-4">
          Đơn Đăng Ký Ký Gửi Sản Phẩm
        </h1>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label>Tên người bán*</label>
              <input
                type="text"
                className="w-full mt-1 border rounded p-2"
                {...register("name", { required: true })}
              />
              {errors.name && (
                <span className="text-red-600">
                  Tên người bán không để trống
                </span>
              )}
            </div>
            <div>
              <label>Consignor #</label>
              <input type="text" className="w-full mt-1 border rounded p-2" />
            </div>
            <div>
              <label>Số điện thoại*</label>
              <input
                type="text"
                className="w-full mt-1 border rounded p-2 "
                {...register("phone", { required: true })}
              />
            </div>
            <div>
              <label>Email*</label>
              <input
                type="email"
                className="w-full mt-1 border rounded p-2"
                {...register("email", { required: true })}
              />
            </div>
            <div className="md:col-span-2">
              <label>Tên sản phẩm*</label>
              <input
                type="text"
                className="w-full mt-1 border rounded p-2"
                {...register("productName", { required: true })}
              />
            </div>
            <div className="md:col-span-2">
              <label>Giá mong muốn (Vnd)*</label>
              <input
                type="number"
                className="w-full mt-1 border rounded p-2"
                {...register("price", { required: true })}
              />
              {/* <p className="text-xs text-gray-500 mt-1">
                The price you set is non-negotiable.
              </p> */}
            </div>
          </div>

          <div>
            <label className="font-semibold">
              Tình trạng chung của các thành phần của sản phẩm*:
            </label>
            <div className="space-y-1 mt-2">
              {[
                "New in Shrink - Lớp bọc ngoài/niêm phong ban đầu còn nguyên vẹn. Chưa bao giờ mở.",
                "Như mới - Đã khui seal, những lá bài thành phần chưa khui, chưa bao giờ chơi.",
                "Rất tốt - Đã khui seal, các token, lá bài. Hầu như hoặc chưa bao giờ được chơi. Không có dấu hiệu hao mòn rõ rệt.",
                "Tốt - Đã chơi nhưng được bảo quản tốt. Hộp/sách hướng dẫn có dấu hiệu đã qua sử dụng.",
                "Khá - Có dấu hiệu hao mòn có thể nhận thấy. Hộp/sách hướng dẫn có hư hỏng nhẹ và/hoặc bị đánh dấu nhẹ.",
                "Kém - Đã cũ nhưng vẫn chơi được. Hộp/sách hướng dẫn có hư hỏng và/hoặc đã bị đánh dấu đáng kể.",
              ].map((text, i) => (
                <label key={i} className="flex items-start gap-2">
                  <input
                    type="radio"
                    className="mt-1"
                    {...register("condition", { required: true })}
                  />
                  <span>{text}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="font-semibold">Các thành phần bị thiếu*:</label>
            <div className="space-y-1 mt-2">
              {[
                "Tôi đã kiểm kê các thành phần và không thiếu cái nào.",
                "Tôi đã kiểm kê các thành phần và thiếu một số cái.",
              ].map((text, i) => (
                <label key={i} className="flex items-start gap-2">
                  <input
                    type="radio"
                    className="mt-1"
                    {...register("missing", { required: true })}
                  />
                  <span>{text}</span>
                </label>
              ))}
              <div>
                <label className="block">
                  Liệt kê các thành phần bị thiếu:
                </label>
                <input type="text" className="w-full mt-1 border rounded p-2" />
              </div>
            </div>
          </div>

          {/* <div>
            <label className="font-semibold">Musty or “basement” smell?</label>
            <div className="flex gap-4 mt-2">
              {["NOTICEABLE", "SLIGHT", "NO"].map((opt) => (
                <label key={opt} className="flex items-center gap-1">
                  <input type="radio" name="smell" />
                  {opt}
                </label>
              ))}
            </div>
          </div> */}

          <div>
            <label className="font-semibold">Mô tả thêm về sản phẩm:</label>
            <textarea
              rows={3}
              className="w-full mt-1 border rounded p-2"
            ></textarea>
          </div>

          <div>
            <label className="font-semibold block mb-2">Read and Sign</label>
            <p className="text-sm text-gray-600 mb-2 whitespace-pre-line">
              Tôi hiểu rằng tôi đang đề nghị bán mặt hàng này tại Boardgame
              Impact. Boardgame Impact sẽ cố gắng bán nó thay mặt tôi với mức
              giá tôi đã nhập ở trên. Tôi vẫn giữ quyền sở hữu mặt hàng này cho
              đến khi nó được bán. Người Mua mặt hàng này sẽ có 3 ngày để trả
              lại nó cho Boardgame Impacts nếu họ cảm thấy tình trạng của mặt
              hàng không đúng như đã ghi trên phiếu này (trừ trường hợp không
              được trả lại). Sau 3 ngày,Boardgame Impact sẽ cấp cho tôi một
              khoản tín dụng cửa hàng bằng 75% giá mà tôi đã nhập ở trên. Thông
              tin liên hệ được liệt kê ở trên là hiện tại và có thể liên lạc
              được. Boardgame Impact có thể trả lại mặt hàng không bán được này
              cho tôi. Tôi hiểu rằng nếu tôi không đến lấy mặt hàng trong vòng
              30 ngày kể từ khi được thông báo rằng mặt hàng đang được trả lại
              cho tôi, mặt hàng đó sẽ trở thành tài sản của Here Be Books &
              Games. Tôi hiểu rằng tôi không được gửi bán lại một mặt hàng không
              bán được trong ít nhất 60 ngày sau khi nó được trả lại.
            </p>
            <p className="text-sm text-gray-600 mb-2">
              Boardgame Impact không chịu trách nhiệm về bất kỳ thiệt hại nào
              xảy ra trong quá trình vận chuyển hoặc trong cửa hàng.
            </p>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="mt-1" />
              Tôi đồng ý với các điều khoản và điều kiện của dịch vụ ký gửi này.
            </label>
            {/* <div className="flex flex-col md:flex-row gap-4 mt-2">
              <div className="flex-1">
                <label>Signature</label>
                <input type="text" className="w-full mt-1 border rounded p-2" />
              </div>
              <div className="flex-1">
                <label>Date</label>
                <input type="date" className="w-full mt-1 border rounded p-2" />
              </div>
            </div> */}
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Gửi đơn đăng ký
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
