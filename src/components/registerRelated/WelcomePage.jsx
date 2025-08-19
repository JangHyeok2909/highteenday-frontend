import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

function WelcomePage() {
  const location = useLocation();
  const navigate = useNavigate();

  // 회원가입 후 navigate 시 전달된 state에서 사용자 이름 가져오기
  const { username } = location.state || { username: "회원님" };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-md text-center"
      >
        <h1 className="text-3xl font-bold mb-4 text-purple-600">
          🎉 환영합니다!
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          <span className="font-semibold">{username}</span> 님, 회원가입이
          완료되었습니다.
        </p>

        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/3159/3159066.png"
            alt="Welcome"
            className="w-32 h-32 mx-auto mb-6"
          />
        </motion.div>

        <Button className="w-full py-2 text-lg" onClick={() => navigate("/")}>
          홈으로 이동
        </Button>
      </motion.div>
    </div>
  );
}

export default WelcomePage;
