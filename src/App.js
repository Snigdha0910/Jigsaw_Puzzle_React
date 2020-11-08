import './App.css';
import React,{useState,useRef} from 'react';
import Game from './Game';
import puzzle from './puzzle.png';
import { Button } from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';

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
    page:0,
  }); 
  const [imagePiece,setPiece]=useState([]);
  const canvasRef = useRef(null);
  
  const updatePage =()=>{
    let newState=JSON.parse(JSON.stringify(state));
    newState.page = 0;
    setState(newState);
  }

  const playAgain= () =>{
    setState(prevState =>({...prevState,img:'', page: 0}));
  }
  
  
    const handleSubmit =(e)=>{
      e.preventDefault();
      let newState=JSON.parse(JSON.stringify(state));
      newState.page = 1;
      setState(newState);
    }
  
    const handleImageChange=(e)=> {
      e.preventDefault();
      let imgSrc=''
      imgSrc=URL.createObjectURL(e.target.files[0]); 
      let newState=JSON.parse(JSON.stringify(state));
      newState.img = imgSrc;
      setState(newState);
      createPic(imgSrc);
    }

    const createPic = (imgSrc)=>{
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      var rows=3;
      var cols=3;
      var img=new Image();
      img.onload=start;
      img.src=imgSrc
      function start(){
            img.width = 300;
            img.height= 300;
            var iw=canvas.width=img.width;
            var ih=canvas.height=img.height; 
            var pieceWidth=iw/cols;
            var pieceHeight=ih/rows;
      setPiece([]);
      for(var y=0;y<rows;y++){
        for(var x=0;x<cols;x++){
          ctx.drawImage(img,x*pieceWidth, y*pieceHeight, pieceWidth, pieceHeight,0,0,300,300);
          setPiece(old => [...old,canvas.toDataURL("image/png")]);
          ctx.clearRect(0, 0, canvas.width, canvas.height)
        }
      }
      
    }
}
  
  return (
    <div>
      <div className='sidebar'>
        <div>
          <span><i>The</i></span><br/><span style={{fontSize:'60px'}}>JIGSAW <br/>PUZZLE </span>
        </div>
        <img src={puzzle} height='100px' width='100px'/>
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
          <span style={{fontSize:'10px'}}><b>*Please ensure minimum dimensions is 400*400 </b></span>
          <canvas ref={canvasRef} style={{display:'none'}}/>
            {state.img ? 
              <div style={{background:`url(${state.img}) 0% 0% no-repeat`, width: '300px',height: '300px'}}/>
              :
              <div style={{backgroundColor:'white',height:'300px',width:'100%',clear:'both'}}></div>
            } 
        <hr/>
        <div style={{textAlign:'center'}}>
            <Button classes={{root:classes.button}} 
              variant="contained"  
              disabled={state.img === ''} 
              onClick={handleSubmit}>
              Upload Image
            </Button>
        </div>
    </div>)
      :
      <Game image={state.img} updatePage={updatePage} playAgain={playAgain} imagePieces={imagePiece} />
      }
      </div>
    </div>
  );
}

export default App;
