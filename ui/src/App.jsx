import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useVirtual } from "react-virtual";

import { getFileList, openFileById } from "./api/files";
import { matchSorter as _matchSorter } from "match-sorter";

import useKey from "./hooks/useKey";

const FileList = ({ data, searchValue }) => {
  const [files, setFiles] = useState([]);
  const [counter, setCounter] = useState(0);

  const matchSorter = (items, text) =>
    _matchSorter(items, text, {
      keys: ["name", "details"],
      baseSort: (a, b) => (a.item.usage < b.item.usage ? +1 : -1),
    });

  const overflowContainerRef = useRef();

  const rowVirtualizer = useVirtual({
    size: data?.length || 0,
    parentRef: overflowContainerRef,
    estimateSize: React.useCallback(() => 64, []),
  });

  const activeItemIndex = data.findIndex((item) => item.id === data[counter].id);

  useLayoutEffect(() => {
    rowVirtualizer.scrollToIndex(activeItemIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeItemIndex]);

  useEffect(() => {
    const filteredApps = matchSorter(data, searchValue);
    setFiles(filteredApps);
    setCounter(0);
    // eslint-disable-next-line
  }, [searchValue]);

  const handleKeyNavigation = (keyEvent) => {
    if (keyEvent === "ArrowUp") {
      if (counter > 0) {
        setCounter(counter - 1);
      }
    }
    if (keyEvent === "ArrowDown") {
      if (counter < files.length - 1) {
        setCounter(counter + 1);
      }
    }
  };
  useKey("ArrowUp", () => handleKeyNavigation("ArrowUp"));
  useKey("ArrowDown", () => handleKeyNavigation("ArrowDown"));

  useKey("Enter", async () => {
    const selectedItem = files[counter].id;
    const firstItem = files[0].id;
    await openFileById(selectedItem || firstItem);
    window.app?.hide();
  });

  return (
    <div className='w-full h-[420px] text-lg text-gray-400 space-y-2 overflow-y-scroll' ref={overflowContainerRef}>
      {Object.entries(files).map(([key, file]) => {
        return (
          <div
            key={key}
            id={file.id}
            className={`w-full px-2 py-1 h-14 ${
              parseInt(key) === counter ? "bg-gray-800 text-gray-200 border-none rounded-lg" : "bg-opacity-100"
            }`}
          >
            <div className='flex flex-row items-center'>
              <img src={`http://localhost:5001/${file.id}/image`} alt={file.name} className='inline-block w-12' />
              <div className='px-2'>
                <div className='text-xl text-gray-300'>{file.name}</div>
                <div className='text-sm text-gray-400'>{file.filePath}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const Files = ({ searchValue }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    getFileList().then((result) => setData(result));
  }, []);

  return (
    <div className='w-full pt-14'>
      <FileList data={data} searchValue={searchValue} />
    </div>
  );
};

const App = () => {
  const [inputValue, setInputValue] = useState("");

  const appContainerRef = useRef();

  useEffect(() => {
    const element = appContainerRef.current;
    if (element) {
      const resizeObserver = new ResizeObserver(([entry]) => {
        window.app?.resize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      });

      resizeObserver.observe(element);
      return () => resizeObserver.unobserve(element);
    }
  }, [inputValue]);

  useKey("Enter", () => setInputValue(""));

  return (
    <div
      className={`w-[600px] ${inputValue ? "h-[500px]" : "h-[70px]"} p-2 bg-gray-700 overflow-auto`}
      ref={appContainerRef}
    >
      <div className='w-full h-14 fixed top-0 left-0 border-b-2 border-gray-600'>
        <input
          autoFocus
          className='w-full h-full bg-gray-700 text-gray-200 p-4 text-2xl'
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.code === "ArrowUp" || event.code === "ArrowDown") {
              event.preventDefault();
            }
            if (event.code === "Backspace") {
              setInputValue("");
            }
          }}
        />
      </div>

      <Files searchValue={inputValue} />
    </div>
  );
};

export default App;
