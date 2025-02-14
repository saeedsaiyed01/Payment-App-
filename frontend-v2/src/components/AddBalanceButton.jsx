import React from 'react';
import { useNavigate } from 'react-router-dom';

const AddBalanceButton = () => {
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate('/addBalance');
    };

    return (
        <div className="flex  gap-2 flex-col items-center">
            <button
                onClick={handleNavigate}
                className="text-gray-900 bg-blue-200 rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#F7BE38]/50 me-2 mb-2">
    <div>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
</svg>

    </div>
            
                Add Balance
            </button>
        </div>
    );
};

export default AddBalanceButton;
