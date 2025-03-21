import { 
    FaShoePrints, FaBook, FaShoppingBag, FaTshirt, FaGraduationCap, 
    FaBookmark, FaRunning, FaGripLines, FaBoxOpen 
} from "react-icons/fa"; 

export const getProductIcon = (productName) => {
    if (!productName) return <FaBoxOpen size={20} />; // Default icon

    const firstWord = productName.split(" ")[0].toLowerCase(); // Extract first word

    const iconMap = {
        shoe: <FaShoePrints size={20} className="text-blue-600" />,  // Shoe icon
        belt: <FaGripLines size={20} className="text-brown-600" />,  // Belt icon
        uniform: <FaTshirt size={20} className="text-green-600" />,  // Uniform icon
        bag: <FaShoppingBag size={20} className="text-purple-600" />, // Bag icon
        text: <FaBook size={20} className="text-red-600" />,  // Text Book icon
        note: <FaBookmark size={20} className="text-yellow-600" />, // Notebook icon
        dictionary: <FaGraduationCap size={20} className="text-gray-600" />, // Dictionary icon
        sport: <FaRunning size={20} className="text-orange-600" />, // Sport Kits icon
    };

    return iconMap[firstWord] || <FaBoxOpen size={20} className="text-gray-400" />; // Default icon if not found
};
