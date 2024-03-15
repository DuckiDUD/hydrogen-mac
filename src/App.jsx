import { useState, useEffect, useRef } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import Bar from "./titlebar";
import execIcon from "./assets/exec.svg"
import Editor, {DiffEditor, useMonaco, loader } from '@monaco-editor/react';
import noimg from './assets/noimg.webp'

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");
  const [editorInstance, setEditorInstance] = useState(null);
  const monaco = useMonaco()
  const [tab, setTab] = useState(0)
  const sbar = useRef()
  const [tabs, setTabs] = useState([
    'tab - 1'
  ])

  const [contents, setContents] = useState([
    '--hydrogen tab - 1',
  ])

  const settings = {
    "theme": "hydrogen-dark"
  }

  const handleImageError = (event) => {
    event.target.src = noimg;
  };

  const [Menu, setMenu] = useState('execute')

  const [searchData, setSearchData] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch(`https://scriptblox.com/api/script/search?q=${sbar.current.value}&max=25&mode=free`);
      const data = await response.json();
      console.log(data)
      setSearchData(data);
    } catch (error) {
      console.error('Error fetching JSON:', error);
    }
  };

  
  const hd = {
    base: 'vs-dark', // Specifies the base theme to extend from (e.g., 'vs', 'vs-dark', 'hc-black')
  
    inherit: true, // Indicates whether to inherit rules from the base theme
  
    rules: [
      
    ],

    colors: {
      'editor.background': '#111111', // Customize the editor background color
      'editor.lineHighlightBackground': '#171717', // Customize the line highlight background color
      'editorLineNumber.foreground': '#BBBBBB', // Customize the line number color
      'editorCursor.foreground': '#FFFFFF', // Customize the cursor color
    },
  };

  if (monaco) {
    monaco.editor.defineTheme("hydrogen-dark",hd)
  }

  const changeHandler = (e) => {
    contents[tab] = String(e)
  }

  return (
    <div className="container">
        <Bar />
        <div id="tabs" style={{display: (Menu === 'execute') ? "flex" : "none"}}>
            {
              tabs.map((val,idx) => {
                return (<button key={idx} className="tab" id={(tab === idx) ? "at" : ""} onClick={() => {
                  setTab(idx)
                }}>
                  <p>{val}</p>
                </button>)
              })
            }

            <button id="addTab" onClick={() => {
              var newt = tabs
              var newc = contents
              newt[newt.length] = `tab - ${newt.length+1}`
              newc[newc.length] = `--hydrogen tab - ${newc.length+1}`
              setContents(newc)
              setTabs(newt)
              setTab(newt.length)
              console.log(newt,newc)
            }}>
              +
            </button>
        </div>
        <section id="sidebar">
          <button onClick={() => {setMenu("execute")}}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 668 512"><path className="st0" d="M9.4 86.6C-3.1 74.1-3.1 53.9 9.4 41.4s32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L178.7 256 9.4 86.6zM256 416H544c17.7 0 32 14.3 32 32s-14.3 32-32 32H256c-17.7 0-32-14.3-32-32s14.3-32 32-32z"/></svg>
          </button>
          <button onClick={() => {setMenu("cloud")}}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><path strokeWidth="2" className="st1" d="M33,18.3c-0.7-2.9-3.3-5-6.4-5c-0.8,0-1.6,0.2-2.4,0.4c-1.8-3.1-5.2-5.2-9-5.2c-5.8,0-10.4,4.7-10.4,10.4
            c0,0.1,0,0.2,0,0.2C3.1,20.5,2,22.5,2,24.7c0,3.7,3,6.6,6.6,6.6c0.1,0,0.1,0,0.2,0h22.4c0.1,0,0.1,0,0.2,0c3.7,0,6.6-3,6.6-6.6
            C38,21.7,35.9,19.1,33,18.3z"/></svg>
          </button>
          <button onClick={() => {setMenu("errors")}}>
          <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
              viewBox="0 0 40 40" xmlSpace="preserve">
              <path class="st1" strokeWidth='2' d="M18.3,6.9l-15.2,26c-0.8,1.3,0.2,3,1.7,3h30.4c1.5,0,2.5-1.7,1.7-3l-15.2-26C20.9,5.6,19.1,5.6,18.3,6.9z"/>
              <circle class="st2" cx="20" cy="29" r="2.5"/>
              <path class="st2" d="M20.1,25h-0.2c-0.5,0-1-0.4-1-0.9l-0.8-9.9c-0.1-0.6,0.4-1.1,1-1.1h1.8c0.6,0,1,0.5,1,1.1l-0.8,9.9
                C21,24.6,20.6,25,20.1,25z"/>
          </svg>

          </button>
          <button onClick={() => {setMenu("settings")}}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path className="st0" d="M352 320c88.4 0 160-71.6 160-160c0-15.3-2.2-30.1-6.2-44.2c-3.1-10.8-16.4-13.2-24.3-5.3l-76.8 76.8c-3 3-7.1 4.7-11.3 4.7H336c-8.8 0-16-7.2-16-16V118.6c0-4.2 1.7-8.3 4.7-11.3l76.8-76.8c7.9-7.9 5.4-21.2-5.3-24.3C382.1 2.2 367.3 0 352 0C263.6 0 192 71.6 192 160c0 19.1 3.4 37.5 9.5 54.5L19.9 396.1C7.2 408.8 0 426.1 0 444.1C0 481.6 30.4 512 67.9 512c18 0 35.3-7.2 48-19.9L297.5 310.5c17 6.2 35.4 9.5 54.5 9.5zM80 408a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"/></svg>
          </button>
        </section>
        <div id="cur">
          <section style={{display: (Menu === 'execute') ? "block" : "none"}}>
          <div id="editor-container">
            <Editor onChange={changeHandler} theme="hydrogen-dark" height="100%" bottom="0" defaultLanguage="lua" value={contents[tab]} />
          </div>
          <button id="exec">
            <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
              viewBox="0 0 40 40" xmlSpace="preserve">
            <g>
            <path class="st0" d="M7.3,36.4c-0.5,0-1-0.4-1-1V4.5c0-0.6,0.5-1,1-1c0.2,0,0.3,0,0.5,0.1l26.8,15.5c0.4,0.2,0.5,0.7,0.5,0.8
		        c0,0.2,0,0.6-0.5,0.8L7.8,36.2C7.7,36.3,7.5,36.4,7.3,36.4L7.3,36.4z"/>
            <path class="st1" d="M7.4,4.6L34,20L7.4,35.3L7.4,4.6 M7.3,2.6c-1,0-2,0.8-2,2l0,30.9c0,1.1,0.9,2,2,2c0.3,0,0.7-0.1,1-0.3
		          l26.8-15.5c1.3-0.7,1.3-2.6,0-3.4L8.3,2.8C8,2.7,7.7,2.6,7.3,2.6L7.3,2.6z"/>
            </g>
            </svg>
          </button>
          </section>



          <section id="cloud" style={{display: (Menu === 'cloud') ? "block" : "none"}}>
            <div id="search">
              <input ref={sbar} type="text" placeholder="Search script..." />
              <button onClick={fetchData}></button>
            </div>
            <button id="clear-search" onClick={() => {
              sbar.current.value = ""
              setSearchData(null)
            }}></button>
            <div id="scripts">
                {searchData && searchData.result.scripts.map((val,idx) => {
                  
                  
                  return (
                  <div className="script">
                  <img src={ fetch(`https://scriptblox.com${val.game.imageUrl}`) && `https://scriptblox.com${val.game.imageUrl}` } onError={handleImageError}/>
                  <span></span>
                  <div className="script-contents">
                    <h1>{`${val.title.slice(0, 20)}${(val.title.length > 20) && '...'}`}</h1>
                    <h3>{val.verified ? "Verified!" : "Unverified"}</h3>
                    <button>
                    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                        viewBox="0 0 40 40" xmlSpace="preserve">
                      <g>
                      <path class="st0" d="M7.3,36.4c-0.5,0-1-0.4-1-1V4.5c0-0.6,0.5-1,1-1c0.2,0,0.3,0,0.5,0.1l26.8,15.5c0.4,0.2,0.5,0.7,0.5,0.8
                      c0,0.2,0,0.6-0.5,0.8L7.8,36.2C7.7,36.3,7.5,36.4,7.3,36.4L7.3,36.4z"/>
                      <path class="st1" d="M7.4,4.6L34,20L7.4,35.3L7.4,4.6 M7.3,2.6c-1,0-2,0.8-2,2l0,30.9c0,1.1,0.9,2,2,2c0.3,0,0.7-0.1,1-0.3
                        l26.8-15.5c1.3-0.7,1.3-2.6,0-3.4L8.3,2.8C8,2.7,7.7,2.6,7.3,2.6L7.3,2.6z"/>
                      </g>
                      </svg>
                    </button>
                    <button onClick={() => {
                        var newt = tabs
                        var newc = contents
                        newt[newt.length] = `tab - ${newt.length+1}`
                        newc[newc.length] = val.script
                        setContents(newc)
                        setTabs(newt)
                        setTab(newt.length)
                        console.log(newt,newc)
                      }}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path className="st0" d="M64 464H288c8.8 0 16-7.2 16-16V384h48v64c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V224c0-35.3 28.7-64 64-64h64v48H64c-8.8 0-16 7.2-16 16V448c0 8.8 7.2 16 16 16zM224 304H448c8.8 0 16-7.2 16-16V64c0-8.8-7.2-16-16-16H224c-8.8 0-16 7.2-16 16V288c0 8.8 7.2 16 16 16zm-64-16V64c0-35.3 28.7-64 64-64H448c35.3 0 64 28.7 64 64V288c0 35.3-28.7 64-64 64H224c-35.3 0-64-28.7-64-64z"/></svg>
                    </button>
                  </div>
              </div>
              )
                })}
            </div>
          </section>



        </div>
    </div>
  );
}

export default App;

