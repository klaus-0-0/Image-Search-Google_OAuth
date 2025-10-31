import logo from "../assets/wallpaper.png"
import signout from "../assets/signout.png"
import { useTheme } from "../context/ThemeContext"
import { useEffect, useState } from "react"
import axios from "axios"
import config from "../config"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom";

function Home() {
    const [isOn, setIsOn] = useState(false);
    const { isDark, toggleTheme } = useTheme();
    const [searchTerm, setSearchTerm] = useState("");
    const [searchTerm1, setSearchTerm1] = useState(null);
    const [images, setImages] = useState([]);
    const [history, setHistory] = useState([]);
    const [handleHistory, setHandleHistory] = useState(false);
    const [loading, setLoading] = useState(false);
    const [topSearch, setTopSearch] = useState(["sport", "mountain", "nature", "desert"]);
    const navigate = useNavigate();

    const bgcolor = isDark ? "bg-gray-900" : "bg-gray-200";
    const bgNavcolor = isDark ? "bg-gray-800" : "bg-gray-100";
    const textColor = isDark ? "text-white" : "text-gray-900";
    const inputBgcolor = isDark ? "bg-gray-700 text-white" : "bg-white text-gray-900";

    const toggleSwitch = () => {
        setIsOn(!isOn);
        toggleTheme();
    };

    useEffect(() => {
        if (searchTerm1) {
            handleSearch();
        }
    }, [searchTerm1]);

    useEffect(() => {
        // Check if token exists in URL (new login)
        const urlParams = new URLSearchParams(window.location.search);
        const tokenFromUrl = urlParams.get('token');
        console.log("token", tokenFromUrl);

        if (tokenFromUrl) {
            // Store the new token from URL
            localStorage.setItem("token", tokenFromUrl);
        }
    }, [navigate]);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const historyData = await axios.get(`${config.apiurl}/user-history`, {
                    headers: {
                        Authorization: `${localStorage.getItem("token")}`
                    }
                });
                console.log("history", historyData.data);
                setHistory(historyData.data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchHistory();
    }, [loading])

    // Close history when clicking outside - add this useEffect
    useEffect(() => {
        const handleClickOutside = () => {
            setHandleHistory(false);
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSearch = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`${config.apiurl}/search`, {
                term: searchTerm ? searchTerm : searchTerm1
            }, {
                headers: {
                    Authorization: `${localStorage.getItem("token")}`
                }
            });

            const data = response.data;
            setImages(data.images);
            console.log("data", data);
            setSearchTerm("");
        } catch (error) {
            console.error('Search error:', error);
            alert('Failed to search images');
        } finally {
            setLoading(false);
        }
    };

    const handleSignout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user-info");
        navigate("/")
    }

    const handleTopSearch = (value) => {
        setSearchTerm1(value);
    }

    return (
        <div className={`min-h-screen ${bgcolor} ${textColor}`}>
            <nav className={`sticky top-0 z-50 ${bgNavcolor}`}>
                <div className="relative flex gap-4 items-center justify-center p-2">
                    <img src={logo} className="h-15 w-15"></img>
                    <p className={`text-2xl font-bold font-mono ${textColor}`}>Wall_Papers</p>
                    <div className="flex-1"></div>

                    {/* framer motion */}
                    <div
                        className={`w-16 h-8 rounded-full flex p-1 cursor-pointer ${isOn ? 'justify-end bg-gray-500' : 'justify-start bg-gray-700'}`}
                        onClick={toggleSwitch}
                    >
                        <motion.div
                            className="w-6 h-6 bg-white rounded-full shadow-lg"
                            layout
                            transition={{
                                type: "spring",
                                stiffness: 500,
                                damping: 30
                            }}
                        />
                    </div>
                    <button className="" onClick={() => handleSignout()}>
                        <img className="h-8 w-8 cursor-pointer" src={signout}></img>
                    </button>
                </div>
            </nav>
            <nav className={`sticky top-23 z-50 flex justify-center`}>
                <form onSubmit={handleSearch} className="absolute flex-1 items-center justify-center">
                    <input
                        className={`sm:w-90 h-10 border rounded-full shadow-xl px-6 text-center ${inputBgcolor}`}
                        placeholder="search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onClick={() => setHandleHistory(true)}
                    />

                    {handleHistory && Array.isArray(history) && history.length > 0 && (
                        <div className={`absolute top-12 left-1/2 transform -translate-x-1/2 w-64 rounded-lg shadow-lg ${isDark ? 'bg-gray-800' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                            <div className="p-2">
                                <div className={`text-xs font-semibold px-2 py-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                    Recent Searches
                                </div>
                                {history.slice(-3).reverse().map((item, index) => (
                                    <div
                                        key={index}
                                        className={`px-3 py-2 cursor-pointer rounded-md hover:${isDark ? 'bg-gray-700' : 'bg-gray-100'} transition-colors ${textColor}`}
                                        onClick={() => {
                                            setSearchTerm(item.searchTerm || item);
                                            setHandleHistory(false);
                                            // Trigger search immediately
                                            setSearchTerm1(item.searchTerm || item);
                                        }}
                                    >
                                        {item.searchTerm || item}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </form>
            </nav>
            <nav className="flex gap-4 justify-center py-4 mt-12">  {/* Added mt-12 margin-top side for spacing */}
                {topSearch.map((value, index) => (
                    <button key={index} className={`w-20 h-10 ${bgcolor} border rounded-sm hover:bg-gray-500 cursor-pointer`} onClick={() => handleTopSearch(value)}>{value}</button>
                ))}
            </nav>
            {/* Image Grid */}
            <div className="p-14">
                {loading && <p className="text-center">Loading...</p>}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((image) => (
                        <div key={image.id} className={`rounded-lg shadow transition-transform duration-300 hover:scale-105 cursor-pointer ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
                            <img
                                src={image.url}
                                alt={image.alt}
                                className="w-full h-48 object-cover rounded-t-lg"
                            />
                            <div className="p-2">
                                <p className="text-sm truncate">{image.description}</p>
                                <p className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>by {image.photographer}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {!loading && images.length === 0 && searchTerm && (
                    <p className="text-center">No images found for "{searchTerm}"</p>
                )}
            </div>
        </div>
    )
}

export default Home;