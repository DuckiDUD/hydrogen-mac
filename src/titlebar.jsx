import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import closesvg from "./assets/close.svg"
import minimise from "./assets/minimise.svg"
import maximise from "./assets/max.svg"
import win from './assets/window.svg'
import { appWindow } from '@tauri-apps/api/window'

function Bar() {

  return (
     <div data-tauri-drag-region class="titlebar">
      <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-droplet" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M6.8 11a6 6 0 1 0 10.396 0l-5.197 -8l-5.2 8z"></path></svg>
      <div style={{backgroundColor: "rgb(20,250,20)"}} class="titlebar-button" id="titlebar-minimize" onClick={() => appWindow.minimize()}>
        
      </div>
      <div style={{backgroundColor: "rgb(250,230,20)"}} class="titlebar-button" id="titlebar-maximize" onClick={() => appWindow.maximize()}>
        
      </div>
      <div style={{backgroundColor: "rgb(250,20,20)"}} class="titlebar-button" id="titlebar-close" onClick={() => appWindow.close()}>
        
      </div>
    </div>
  );
}

export default Bar;
