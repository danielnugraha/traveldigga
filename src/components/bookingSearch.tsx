import { DateRange, RangeKeyDict } from "react-date-range";
import { MdOutlineBed, MdOutlineCalendarMonth, MdPersonOutline } from "react-icons/md";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { format } from "date-fns";
// import { useNavigate } from "react-router-dom";
import { useState, ChangeEvent, useEffect, useRef } from "react";

const suggestions = ['Munich', 'Berlin', 'Leipzig', 'Cologne', 'Hamburg', 'Jena', 'Halle', 'Frankfurt', 'Darmstadt', 'Passau', 'Rostock', 'Bremen', 'Wolfsburg', 'Augsburg', 'Nurnberg'];

interface Options {
    adult: number;
    minor: number;
}

interface AutoSuggestReturn {
    input: string;
    matchingSuggestions: string[];
    isOpen: boolean;
    setInput: React.Dispatch<React.SetStateAction<string>>;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    handleInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
    handleSuggestionClick: (suggestion: string) => void;
}

const AutoSuggest = (initialValue: string): AutoSuggestReturn => {
    const [input, setInput] = useState(initialValue);
    const [matchingSuggestions, setMatchingSuggestions] = useState<string[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value.toLowerCase();
        setInput(inputValue);

        const filteredSuggestions = suggestions.filter((suggestion) =>
            suggestion.toLowerCase().startsWith(inputValue)
        );
        setMatchingSuggestions(filteredSuggestions);
    };

    const handleSuggestionClick = (suggestion: string) => {
        setInput(suggestion);
        setIsOpen(false);
    };

    return {
        input,
        matchingSuggestions,
        isOpen,
        setInput,
        setIsOpen,
        handleInputChange,
        handleSuggestionClick,
    };
};

const Hero = () => {
    // const navigate = useNavigate();
    const [openDate, setOpenDate] = useState(false);
    const [changeDate, setChangeDate] = useState(false);
    const [date, setDate] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: "selection",
        },
    ]);

    const [openOptions, setOpenOptions] = useState(false);
    const [options, setOptions] = useState<Options>({
        adult: 1,
        minor: 0,
    });

    const handleOptions = (name: keyof Options, operation: string) => {
        setOptions((prev) => {
            return {
                ...prev,
                [name]: operation === "i" ? options[name] + 1 : options[name] - 1,
            };
        });
    };

    const arrivalSuggest = AutoSuggest('');

    const dateRangeRef = useRef<HTMLDivElement>(null);

    // Function to handle click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dateRangeRef.current && !dateRangeRef.current.contains(event.target as Node)) {
                setOpenDate(false);
            }
        }

        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on cleanup
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <>
            <header className="flex flex-col items-center relative w-screen h-[529px] px-7 py-4">
                <div className="flex justify-center items-center">
                    <h1 className="font-extrabold text-5xl sm:text-7xl md:text-8xl text-center leading-[55px] sm:leading-[70px] md:leading-[90px] text-gradient">
                        Traveldigga
                    </h1>
                </div>
                <div className="flex w-full max-w-[1024px] lg:h-[65px] lg:flex-row items-center flex-col mt-20  shadowCard relative ">
                    <div className="flex w-full h-full justify-start items-center border-[1px] border-[#CBD4E6] p-2">
                        <MdOutlineBed />
                        <input
                            type="text"
                            placeholder="Where to?"
                            value={arrivalSuggest.input}
                            onChange={arrivalSuggest.handleInputChange}
                            onFocus={() => arrivalSuggest.setIsOpen(true)}
                            className="uppercase placeholder:capitalize outline-none border-none ml-2 text-base text-[#7C8DB0] placeholder:text-[#7C8DB0] placeholder:text-base placeholder:leading-6"
                        />
                        {arrivalSuggest.isOpen && (
                            <ul className="w-[120px] h-56 absolute top-[70px] bg-white rounded overflow-scroll">
                                {arrivalSuggest.matchingSuggestions.map((suggestion) => (
                                    <li
                                        key={suggestion}
                                        onClick={() => arrivalSuggest.handleSuggestionClick(suggestion)}
                                        className="uppercase cursor-pointer hover:bg-[#605DEC] px-3 py-1 text-[#7C8DB0] hover:text-[#F6F6FE] mt-1"
                                    >
                                        {suggestion}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="flex w-full h-full justify-start items-center border-[1px] border-[#CBD4E6] p-2"
                        ref={dateRangeRef}>
                        <MdOutlineCalendarMonth />
                        <span
                            className="text-[#7C8DB0] text-base leading-6 ml-2 cursor-pointer"
                            onClick={() => {
                                setOpenDate(!openDate)
                                setChangeDate(true)
                            }}
                        >
                            {changeDate
                                ? `${format(date[0].startDate, "dd/MM/yyyy")} to ${format(
                                    date[0].endDate,
                                    "dd/MM/yyyy"
                                )}`
                                : "Check in - Check out"}
                        </span>
                        {openDate && (
                            <DateRange
                                editableDateInputs={true}
                                onChange={(item: RangeKeyDict) => {
                                    const { startDate, endDate, key } = item.selection;

                                    if (startDate && endDate && key) {
                                        setDate([
                                            {
                                                startDate: startDate,
                                                endDate: endDate,
                                                key: key,
                                            },
                                        ]);
                                    }
                                }}
                                moveRangeOnFirstSelection={false}
                                ranges={date}
                                className="absolute top-64 lg:top-20 z-10"
                            />
                        )}
                    </div>

                    <div className="flex w-full h-full justify-start items-center border-[1px] border-[#CBD4E6] p-2">
                        <MdPersonOutline />
                        <span
                            className="text-[#7C8DB0] text-base leading-6 ml-2 cursor-pointer"
                            onClick={() => setOpenOptions(!openOptions)}
                        >
                            {`${options.adult} Adult - ${options.minor} Minor `}
                        </span>
                        {openOptions && (
                            <div className="w-52 h-fit flex flex-col gap-4 rounded-md bg-white shadowCard absolute lg:top-[70px] top-64 p-4 z-10">
                                <div className="flex justify-between items-center">
                                    <span className="text-[#7C8DB0] text-base leading-6">
                                        Adults:
                                    </span>
                                    <div className="flex items-center gap-4">
                                        <button
                                            className="border-2 border-[#605DEC] px-2 text-[#7C8DB0] disabled:cursor-not-allowed"
                                            onClick={() => handleOptions("adult", "d")}
                                            disabled={options.adult <= 1}
                                        >
                                            -
                                        </button>
                                        <span className="text-[#7C8DB0]">{options.adult}</span>
                                        <button
                                            className="border-2 border-[#605DEC] px-2 text-[#7C8DB0]"
                                            onClick={() => handleOptions("adult", "i")}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[#7C8DB0] text-base leading-6">
                                        Minors:
                                    </span>
                                    <div className="flex items-center gap-4">
                                        <button
                                            className="border-2 border-[#605DEC] px-2 text-[#7C8DB0] disabled:cursor-not-allowed"
                                            onClick={() => handleOptions("minor", "d")}
                                            disabled={options.minor <= 0}
                                        >
                                            -
                                        </button>
                                        <span className="text-[#7C8DB0]">{options.minor}</span>
                                        <button
                                            className="border-2 border-[#605DEC] px-2 text-[#7C8DB0]"
                                            onClick={() => handleOptions("minor", "i")}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <button className="w-80px bg-[#605DEC] text-[#FAFAFA] text-lg leading-6 h-[45px] lg:h-[65px] px-5 lg:rounded-r-[4px]">
                        Search
                    </button>
                </div>
            </header>
        </>
    );
};

export default Hero;
