export function InputBox({ label, placeholder, onChange }) {

    return <div>
        <div className="text-sm  text-black font-medium text-left py-2">
            {label}
        </div>
        <input onChange={onChange} placeholder={placeholder} className="w-full px-2 py-1 border border-gray-400 focus:outline-none focus:border-black transition duration-200" />
    </div>
}