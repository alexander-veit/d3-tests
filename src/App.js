
import './App.css';
import { ConsortiumMap } from "./ConsortiumMap";
import { Alluvial } from './Alluvial/Alluvial';
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <React.Fragment>
      <div className='container pb-5'>
        <ConsortiumMap/>
      </div>
      {/* <div className="alluvial-container container-full">
        <Alluvial />
      </div> */}
    </React.Fragment>
  );
}

export default App;
