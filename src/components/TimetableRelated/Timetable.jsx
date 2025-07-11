import React, { useState } from 'react';

const TimeTable = () => {
  // 시간표 데이터 구조 (나중에 API로 대체될 예정)
  const [timetable, setTimetable] = useState({
    monday: Array(9).fill(''),
    tuesday: Array(9).fill(''),
    wednesday: Array(9).fill(''),
    thursday: Array(9).fill(''),
    friday: Array(9).fill('')
  });

  // 교시별 시간
  const classTimes = [
    '09:00-09:50',
    '10:00-10:50', 
    '11:00-11:50',
    '12:00-12:50',
    '13:00-13:50',
    '14:00-14:50',
    '15:00-15:50',
    '16:00-16:50',
    '17:00-17:50'
  ];

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
  const dayNames = ['월요일', '화요일', '수요일', '목요일', '금요일'];

  // 임시로 과목 입력 가능하게 (나중에 API 연동시 제거)
  const handleSubjectChange = (day, period, value) => {
    setTimetable(prev => ({
      ...prev,
      [day]: prev[day].map((subject, index) => 
        index === period ? value : subject
      )
    }));
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4">
      <div className="max-w-full mx-auto">
        <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">
          시간표
        </h1>
        
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="border border-gray-300 py-4 px-3 text-center font-semibold text-lg w-20">
                    교시
                  </th>
                  <th className="border border-gray-300 py-4 px-3 text-center font-semibold text-lg w-32">
                    시간
                  </th>
                  {dayNames.map((day, index) => (
                    <th key={index} className="border border-gray-300 py-4 px-3 text-center font-semibold text-lg">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 9 }, (_, periodIndex) => (
                  <tr key={periodIndex} className="hover:bg-gray-50 h-16">
                    <td className="border border-gray-300 py-3 px-3 text-center font-medium bg-gray-100 text-lg">
                      {periodIndex + 1}교시
                    </td>
                    <td className="border border-gray-300 py-3 px-3 text-center bg-gray-100 text-sm font-medium">
                      {classTimes[periodIndex]}
                    </td>
                    {days.map((day, dayIndex) => (
                      <td key={dayIndex} className="border border-gray-300 p-1">
                        <input
                          type="text"
                          value={timetable[day][periodIndex]}
                          onChange={(e) => handleSubjectChange(day, periodIndex, e.target.value)}
                          placeholder="과목명"
                          className="w-full h-12 p-2 text-center border-0 bg-transparent focus:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded text-base font-medium"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-base">
            * 현재는 임시 데이터입니다. API 연동 후 실제 시간표가 표시됩니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TimeTable;