import './Game.css';
import React,{useState,useEffect} from 'react';
import {Grid,Button,Dialog,DialogActions,DialogContentText,DialogContent} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    button:{
        margin: theme.spacing(1),
        borderRadius: 50,
        backgroundColor:'black',
        color:'white'
    },
    buttonPrev:{
        borderRadius: 10,
        position:'fixed',
        top:500,
        left:60
    }
  }));

function Game (props){
    const classes = useStyles();
    const [state,setState] = useState({
      pieces: [],
      shuffled: [],
      solved: []
    }); 
    const [end,setEnd]=useState(false);
    const [open, setOpen] = useState(false);
    const [result,setResult]=useState('');  

    useEffect(()=>{initialState()},[]);

    function initialState(){
        var pieces = [...Array(9)].map((el, i) => (
            {
                img: props.imagePieces[i],
                order: i,
                board: 'shuffled'
            }
      ));
        let newState=JSON.parse(JSON.stringify(state));
        newState.pieces = pieces;
        newState.shuffled=shufflePieces(pieces);
        newState.solved=[...Array(9)]
        setState(newState);
    }

  function updatePage(){
      props.updatePage();
  }

  function playAgain(){
    props.playAgain();
}
  
  function handleDrop(e, index, targetName) {
    let destination= state[targetName];
    if (destination[index]) {
      return;
    }
    const itemOrder = e.dataTransfer.getData('text');
    const itemData = state.pieces.find(p => p.order === +itemOrder);
    const source = state[itemData.board];
    if (targetName === itemData.board) destination = source;
    source[source.indexOf(itemData)] = undefined;
    destination[index] = itemData;
    itemData.board = targetName;
    setState(prevState =>({...prevState,[itemData.board]: source, [targetName]: destination}));
  }

  function handleDrag(e, order) {
    const dt = e.dataTransfer;
    dt.setData('text/plain', order);
    dt.effectAllowed = 'move';
  }

  function checkPuzzle(){
    let flag = 0;
    let flag_final = 0;
    for(var i =0;i<state.solved.length;i++){
        if(!state.solved[i]){
            flag = 1
            break;
        }
        else if(state.solved[i].order!==i){
            flag_final = 1
        }
    }
    setResult('');
    if(flag === 1){
        setResult('All items are not placed ! Place all and try again !');}
    else if(flag_final === 1){
        setResult('OOPS! looks like the solution is incorrect. Try again');}
    else{
        setEnd(true);
        setResult('WOHOOO ! You have solved the puzzle! Wanna try again ?') ;  } 
  }

  function refresh_page(){
    initialState();
  }

  const handleClickOpen = () => {
    setOpen(true);
    checkPuzzle();
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
     <> 
    <div className='wrapperTextGame'>Drag and Drop items to the right matrix </div>  
    
    <div className='wrapperGame'>
        <div className='puzzle'> 
            <Grid container spacing={5}>
                <Grid item xs={6}>
                    <ul className="puzzle__shuffled-board">
                        {state.shuffled.map((piece, i) => renderPiece(piece, i, 'shuffled'))}
                    </ul>
                </Grid>
                <Grid item xs={6}>
                     <ol className="puzzle__solved-board" style={{background:`url(${props.image})`}}>
                        {state.solved.map((piece, i) => renderPiece(piece, i, 'solved'))}
                    </ol>
                </Grid>
            </Grid>
      <div style={{float:'right'}}>
        <Button classes={{root:classes.button}} variant="contained" onClick={refresh_page}>Refresh</Button>
        <Button classes={{root:classes.button}} variant="contained" onClick={handleClickOpen}>Apply</Button>
        <Dialog
            open={open} onClose={handleClose}>
            <DialogContent>
                <DialogContentText>{result}</DialogContentText>
            </DialogContent>
            <DialogActions>
                {end ? <Button onClick={playAgain} color="primary" variant="outlined" autoFocus>Play Again</Button>:
                <Button onClick={handleClose} color="primary" variant="outlined" autoFocus>OK</Button>}
            </DialogActions>
        </Dialog>
      </div>
      <Button classes={{root:classes.buttonPrev}} variant="contained" onClick={updatePage}>
            Previous
      </Button>  
    </div>
    </div>
    </>
  );

function renderPiece(piece, index, boardName) {
  return (
    <li
      key={index}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => handleDrop(e, index, boardName)}>
      {
        piece && <img src={piece.img}
        height='100px'
        width='100px'
        draggable 
        onDragStart={(e) => handleDrag(e, piece.order)}/>
      }
 
    </li>
  );

}

function shufflePieces(pieces) {
  const shuffled = [...pieces];
  for (let i = shuffled.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let tmp = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = tmp;
  }
  return shuffled;
};
}


export default Game;
