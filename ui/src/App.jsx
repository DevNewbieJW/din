import React, { useState, useEffect, useRef } from "react";

import { getFileList, openFileById } from "./api/files";
import { matchSorter as _matchSorter } from "match-sorter";

import useKey from "./hooks/useKey";

const FileItem = ({ file, fileIndex }) => {
  console.log(fileIndex);
  return (
    <div
      id={file.id}
      className={`w-full px-2 py-1 h-14 ${
        file.id === fileIndex ? "bg-gray-800 text-gray-200 border-none rounded-lg" : "bg-opacity-100"
      }`}
      key={file.id}
    >
      <div className='flex flex-row items-center'>
        <img src={`http://localhost:5000/${file.id}/image`} alt='' width={30} className='inline-block w-12' />
        <div className='px-2'>
          <div className='text-xl text-gray-300'>{file.name}</div>
          <div className='text-sm text-gray-400'>{file.filePath}</div>
        </div>
      </div>
    </div>
  );
};

const FileList = ({ data, searchValue }) => {
  const [files, setFiles] = useState([]);
  const [counter, setCounter] = useState(-1);
  const [index, setIndex] = useState(0);

  const matchSorter = (items, text) =>
    _matchSorter(items, text, {
      keys: ["name", "details"],
      baseSort: (a, b) => (a.item.usage < b.item.usage ? +1 : -1),
    });

  useEffect(() => {
    // const filteredApps = data.filter((file) => file.name.toLowerCase().startsWith(searchValue.toLowerCase()));
    const filteredApps = matchSorter(data, searchValue);
    setFiles(filteredApps);
    // eslint-disable-next-line
  }, [searchValue]);

  useEffect(() => {
    setIndex(files[counter]?.id);
    // eslint-disable-next-line
  }, [counter]);

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
    const firstItem = files[0].id;
    await openFileById(index || firstItem);
    window.app?.hide();
  });

  return (
    <div className='w-full h-12 text-lg text-gray-400 space-y-2'>
      {files.map((file) => (
        <FileItem key={file.id} filteredFiles={files} file={file} fileIndex={index} />
      ))}
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
      <div className='w-full h-14 fixed top-0 left-0 border-b-[1px]'>
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
