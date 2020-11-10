import React,{ useState,useRef, useEffect } from 'react';
import {Button} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    button:{
        margin: theme.spacing(1),
        borderRadius: 10,
        backgroundColor:'rgba(189, 103, 103)',
    }
  }));

function Pieces(props){
    const classes = useStyles();
    const [imagePiece,setPiece]=useState([]);
    const canvas2Ref = useRef(null);

    useEffect(()=>{
           setPiece([]);
           createPieces();
       },[props.imgURI]) 

    useEffect(()=>{
            createPieces();
            },[])

    function createPieces(){
        const canvas2 = canvas2Ref.current;
        const ctx2 = canvas2.getContext('2d');
        var rows=3;
        var cols=3;
        var pieceImg=new Image();
        pieceImg.onload=start;
        pieceImg.src=props.imgURI;
        
        function start(){
            var iw=canvas2.width=pieceImg.width;
            var ih=canvas2.height=pieceImg.height; 
            var pieceWidth=iw/cols;
            var pieceHeight=ih/rows;
            
            for(let y=0;y<rows;y++){
                for(let x=0;x<cols;x++){
                    ctx2.drawImage(pieceImg,x*pieceWidth, y*pieceHeight, pieceWidth, pieceHeight,0 ,0, 300, 300);
                    setPiece(old=>[...old,canvas2.toDataURL("image/png")])
                    ctx2.clearRect(0,0,canvas2.height,canvas2.width);
                }  
            }
        }
    }   

    function checkVal(){
        props.handlePieces(imagePiece);
    }

    return(
        <>
            <canvas ref={canvas2Ref} style={{display:'none'}}/>
            <div style={{textAlign:'center'}}>
                <Button classes={{root:classes.button}} 
                    variant="contained"  
                    onClick={checkVal}>
                        Upload Image
                </Button>
            </div>
        </> 
    );
}

export default Pieces;