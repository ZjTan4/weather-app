const Modal = ({ children, onClose }) => (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-md shadow-md">
            {children}
            <button
                onClick={onClose}
                className="bg-red-500 text-white px-4 py-2 rounded-md mt-4"
            >
                Close
            </button>
        </div>
    </div>
);

export default Modal;
