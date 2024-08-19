import React, {useEffect, useRef, useState} from 'react';
import {useQuery} from "@tanstack/react-query";
import {getLocationSuggestions} from "../data-access/location-suggestions.ts";
import {Location} from "../schema/location.ts";
import {AiOutlineClose} from "@react-icons/all-files/ai/AiOutlineClose";
import {useDebounce} from "use-debounce";


type SearchBarProps = {
    onPlaceSelected: (selected: Location) => void,
    onClearInput?: () => void,
    description: string
}

function SearchBar({onPlaceSelected, description, onClearInput}: SearchBarProps) {
    const [input, setInput] = useState<string>("");
    const [debouncedInput] = useDebounce(input, 500);
    const [dropdownDisplayed, setDropdownDisplayed] = useState(false);

    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const {refetch, data, error} = useQuery({
        queryKey: ["get-locations", debouncedInput],
        queryFn: () => getLocationSuggestions(debouncedInput),
        enabled: false, // don't fetch on component mount
        staleTime: Infinity // query data will be cached forever
    });

    useEffect(() => {
        if (debouncedInput.length >= 3 && document.activeElement === inputRef.current) {
            refetch();
            setDropdownDisplayed(true);
        } else {
            setDropdownDisplayed(false);
        }
    }, [debouncedInput, refetch]);

    useEffect(() => {
        // @ts-ignore event can not be typed properly because event.target returns an incorrect type
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setDropdownDisplayed(false);
            }
        }

        function handleEscapeKey(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                setDropdownDisplayed(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscapeKey);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInput(value);
        if(value.length === 0) {
            onClearInput?.();
        }
    };

    const handleSuggestionClick = (suggestion: Location) => {
        setInput(suggestion.displayName);
        setDropdownDisplayed(false);
        onPlaceSelected(suggestion);
    };

    const handleClearInput = () => {
        setInput("");
        onClearInput?.();
    }

    return (
        <div className="relative flex-1" ref={wrapperRef}>
            <input
                type="text"
                value={input}
                onChange={handleInputChange}
                placeholder={description}
                className="px-4 py-2 border w-full rounded-2xl bg-white text-zinc-900"
                ref={inputRef}
            />
            <button
                className="bg-white border-none p-0 text-black absolute right-2 top-2 bottom-2 disabled:opacity-0 transition-opacity duration-75"
                disabled={input.length === 0}
                onClick={handleClearInput}>
                    <AiOutlineClose size={16}/>
            </button>
            {
                error &&
                <p className="text-red-800">We couldn't load location suggestions for you</p>
            }
            {data && dropdownDisplayed && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded max-h-60 overflow-y-auto">
                    {data.length === 0
                        ? <li className="p-2 text-zinc-900">No suggestions found</li>
                        : data.map((suggestion) => (
                            <li
                                key={suggestion.placeId}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="p-2 cursor-pointer hover:bg-gray-200 text-zinc-900"
                            >
                                {suggestion.displayName}
                            </li>
                        ))}
                </ul>
            )}
        </div>
    );
}

export default SearchBar;
