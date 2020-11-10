import './App.css';
import React,{useState,useRef} from 'react';
import Game from './Game';
import puzzlePic from './puzzle.png';
import { Button } from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import Resizer from 'react-image-file-resizer';
import Pieces from './Pieces';

const useStyles = makeStyles((theme) => ({
    button:{
        margin: theme.spacing(1),
        borderRadius: 10,
        backgroundColor:'rgba(189, 103, 103)',
    }
  }));

function App() {
  const classes = useStyles();
  const [state, setState]=useState({
    img:'',
    compressedImg:'',
    page:0
  }); 
  const canvasRef = useRef(null);
  const [puzzle,setPuzzle]=useState([]);
  
  const updatePage =()=>{
    let newState=JSON.parse(JSON.stringify(state));
    newState.page = 0;
    setState(newState);
  }

  const playAgain= () =>{
    setState(prevState =>({...prevState,img:'',compressedImg:'', page: 0}));
  }
  
  const handleImageChange=(e)=> {
    e.preventDefault();
    let imgSrc=''
    imgSrc=URL.createObjectURL(e.target.files[0]); 
    if(!imgSrc){
        return;
    }
    let newState=JSON.parse(JSON.stringify(state));
    newState.img = imgSrc;
    setState(newState);
    createPic(imgSrc);
  }

  const createPic = (imgSrc)=>{
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
      
    var img=new Image();
    img.onload=start;
    img.src=imgSrc
    function start(){
      if(img.naturalHeight<300 && img.naturalWidth <300){
          alert('Cant process image! Please select image greater than 300*300');
          playAgain();  
      }
      else{
       var ih = img.naturalHeight;
       var iw = img.naturalWidth; 
       var changedWidth;
       var changedHeight;
       if(ih !== iw){
         if(ih>iw){
          var diff = ih-iw;
          changedWidth= diff/2;
          changedHeight=0;
          ih = iw;
         }
         else{
          var diff = iw-ih;
          changedHeight=diff/2;
          changedWidth=0;
          iw = ih;
         }
       }
      else{
         changedHeight=0;
         changedWidth=0; 
       }
      canvas.width = iw;
      canvas.height = ih;
      ctx.drawImage(img,changedHeight,changedWidth,ih,iw,0,0,ih,iw);
     
      var imgVal= canvas.toDataURL("image/png");
      let newState=JSON.parse(JSON.stringify(state));
      newState.img=canvas.toDataURL("image/png");
      setState(newState);
      var imgBlob = b64toBlob(imgVal)

      function b64toBlob(dataURI) {
        var byteString = atob(dataURI.split(',')[1]);
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
             ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: 'image/jpeg' });
     }

      Resizer.imageFileResizer(imgBlob,300,300,'JPEG',100,0,uri => {
                 setState(prevState =>({...prevState,compressedImg:uri}));
            },'base64');  
      setPuzzle([]);
    }           
  }
}

  const handlePieces=(pieces)=>{
    setState(old=>({...old,page:1}));
    if(!puzzle[0]){
      for(let i=0;i<pieces.length;i++){
        setPuzzle(old=>[...old,pieces[i]]);
        }
      }
    }
  
  return (
    <div>
      <div className='sidebar'>
        <div>
          <span><i>The</i></span><br/><span style={{fontSize:'60px'}}>JIGSAW <br/>PUZZLE </span>
        </div>
        <img src={puzzlePic} height='100px' width='100px'/>
          <br/>
        <i style={{fontSize:'13px'}}>The drag & drop puzzle game</i>
      </div>
    <div >
      {state.page === 0 ? 
        (<div className='wrapper'>
        <Button classes={{root:classes.button}} variant="contained" component="label">
            Select File
          <input type="file" style={{ display: "none" }} onChange={handleImageChange}/>
        </Button>
          <span style={{fontSize:'12px'}}><i>Choose file from here !</i></span><br/>
          <span style={{fontSize:'10px'}}><b>*Please ensure minimum dimensions is 300*300 </b></span>
          <canvas ref={canvasRef} style={{display:'none'}}/>
            {state.compressedImg ? 
            <>
              <img src={state.compressedImg}/>
              <hr/>
              <Pieces imgURI={state.compressedImg} handlePieces={handlePieces}/>
              </> 
              :
              <div style={{backgroundColor:'white',height:'300px',width:'100%',clear:'both'}}></div>
            } 
    </div>)
      :
        <Game image={state.compressedImg} updatePage={updatePage} playAgain={playAgain} imagePieces={puzzle} />
      }
      </div>
    </div>
  );
}

export default App;
