import React, { useEffect, useState, useRef } from "react";
import { BiChevronDown } from "react-icons/bi";
import { useGlobalContext } from "../context";
const FilterBox = () => {
  const { darkMode, allRegions, dispatch, isDropDownOpen } = useGlobalContext();
  const [regions, setRegions] = useState([]);
  const dropDownRef = useRef(null);

  const filterData = async (region) => {
    dispatch({ type: `SET_LOADING_TRUE` });
    const url = `https://restcountries.com/v2/all`;
    try {
      const resp = await fetch(url);
      const data = await resp.json();
      let filteredData = data.filter((item) => {
        return item.region === region;
      });
      dispatch({ type: `UPDATE_COUNTRIES_LIST`, payload: filteredData });
    } catch (error) {
      throw new Error(error);
    } finally {
      dispatch({ type: `SET_LOADING_FALSE` });
    }
  };

  useEffect(() => {
    setRegions(Array.from(allRegions));
  }, [allRegions, setRegions]);

  useEffect(() => {
    if (dropDownRef !== null) {
      return dispatch({
        type: `CREATE_DROPDOWN_REF`,
        payload: dropDownRef,
      });
    }
    return;
  }, [dropDownRef, dispatch]);

  return (
    <div
      className={`h-full lg:w-1/4 md:w-1/4 w-2/4 px-4 py-2 shadow cursor-pointer relative ${
        darkMode ? `bg-darkBlue text-white` : `bg-white`
      }`}
      ref={dropDownRef}
    >
      <p
        className='w-full h-full flex flex-row justify-between items-center'
        onClick={() => {
          dispatch({ type: `HANDLE_DROPDOWN` });
        }}
      >
        Filter by Region <BiChevronDown />
      </p>

      {isDropDownOpen && (
        <div
          className={`flex flex-col gap-2 rounded absolute w-full top-full left-0 p-6 mt-1 z-50 ${
            darkMode ? `bg-darkBlue text-white` : `bg-white`
          }`}
        >
          {regions.length === 0
            ? "No regions available"
            : regions.map((region, index) => {
                return (
                  <div onClick={() => filterData(region)} key={index}>
                    {region}
                  </div>
                );
              })}
        </div>
      )}
    </div>
  );
};

export default FilterBox;
