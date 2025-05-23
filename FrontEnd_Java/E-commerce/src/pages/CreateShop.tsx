import React, { useEffect, useState } from "react";
import { ShopDetails } from "../data/shopdetail";
import { uploadToFirebase } from "./ChinhSuaSanPham";
import { createShop } from "../services/shopService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/Auth/AuthContext"; // Import AuthProvider để lấy thông tin user

export default function CreateShop() {
  const { user } = useAuth(); // Lấy thông tin user từ context

  const [shop, setShop] = useState<ShopDetails>({
    id: "",
    userId: user?.id || "", // Gán userId bằng id của user hiện tại
    userName: user?.accountName || "", // Gán userName bằng userName của user hiện tại
    name: "",
    address: "",
    image: "",
    rating: 0,
  });

  const nav = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShop((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = await uploadToFirebase(file);
      setShop((prev) => ({ ...prev, image: url })); // Cập nhật URL ảnh vào shop
    }
  };

  const create = () => {
    // Kiểm tra các trường bắt buộc
    const isEmptyField = Object.entries(shop).some(([key, value]) => {
      if (key === "rating" || key === "id") return false;
      return value === "";
    });

    if (isEmptyField) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    // Gọi API tạo shop
    createShop(shop).then(() => {
      nav("/quanlyshop");
    });
  };

  return (
    <div className="flex w-full">
      <div className="mt-10 ml-10 w-[75vw]">
        <h1 className="font-bold text-2xl mb-3">Thêm Shop</h1>
        <form className="space-y-4 w-full md:w-1/2 max-w-lg border border-gray-300 p-4 md:p-8 rounded-lg shadow-md bg-white bg-opacity-40">
          <div className="mb-4">
            <label className="block mb-2 text-gray-800 font-medium">
              Ảnh minh họa
            </label>
            <input type="file" onChange={handleFileChange} />
          </div>

          <div>
            <label className="block mb-2 text-gray-800 font-medium">
              Tên Shop
            </label>
            <input
              type="text"
              value={shop.name}
              name="name"
              onChange={handleChange}
              className="px-4 py-2 border border-gray-300 w-full rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-700"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-800 font-medium">
              Địa chỉ
            </label>
            <input
              type="text"
              value={shop.address}
              name="address"
              onChange={handleChange}
              className="px-4 py-2 border border-gray-300 w-full rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-700"
            />
          </div>
        </form>
        <div className="w-full">
          <button
            style={{ backgroundColor: "#1E3A8A" }}
            className="text-white px-6 py-2 rounded-md mt-10 ml-8"
            onClick={create}
          >
            Thêm Shop
          </button>
          <button
            className="border bg-white text-black px-6 py-2 rounded-md mt-10 ml-12"
            onClick={() => nav("/profile")}
          >
            Hủy bỏ
          </button>
        </div>
      </div>
    </div>
  );
}
