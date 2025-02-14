
// import React from 'react';

// // Utility function for number formatting
// const formatCurrency = (amount) => {
//   return new Intl.NumberFormat('en-US', {
//     style: 'currency',
//     currency: 'USD',
//     minimumFractionDigits: 2,
//   }).format(amount);
// };

// const formatPercentage = (value) => {
//   return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
// };
// export const Stats = ({ income, expenses }) => {
//     return (
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
//         <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
//           <div className="flex items-center justify-between mb-4">
//             <p className="text-gray-500 font-medium">Income</p>
//             <span className="p-2 bg-green-50 text-green-600 rounded-lg text-sm">
//               {formatPercentage(1.3)} 
//             </span>
//           </div>
//           <p className="text-3xl font-bold mb-2">{formatCurrency(income)}</p>
//           <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
//             <div className="h-full w-3/4 bg-green-500 rounded-full"></div>
//           </div>
//         </div>
        
//         <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
//           <div className="flex items-center justify-between mb-4">
//             <p className="text-gray-500 font-medium">Expenses</p>
//             <span className="p-2 bg-red-50 text-red-600 rounded-lg text-sm">
//               {formatPercentage(-1.2)}
//             </span>
//           </div>
//           <p className="text-3xl font-bold mb-2">{formatCurrency(expenses)}</p>
//           <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
//             <div className="h-full w-1/4 bg-red-500 rounded-full"></div>
//           </div>
//         </div>
//       </div>
//     );
//   };