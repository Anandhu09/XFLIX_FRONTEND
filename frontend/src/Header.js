import React from 'react';
import {useState} from 'react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import UploadIcon from '@mui/icons-material/Upload';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import { useSnackbar } from "notistack";
import FormHelperText from '@mui/material/FormHelperText';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import moment from 'moment';
import FormControl from '@mui/material/FormControl';
import './Header.css'
import axios from 'axios';
import ipConfig from "./ipConfig.json";
import {
  Grid,
  InputAdornment,
  TextField,Dialog,DialogActions,DialogContent,DialogContentText,DialogTitle,Select,MenuItem,InputLabel
} from "@mui/material";
import { Search } from "@mui/icons-material";
import './Header.css';
import { useTheme } from '@mui/material/styles';
export default function Header({videoPlayer,searchKey,debounceSearch,genreFilter,ratingFilter,age,genre,sortBy,sortVids}) {
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const deselectStyle={backgroundColor:theme.components.Chips.deselectBackgroundColor,color:theme.components.Chips.deselectColor,opacity:"88%"};
  const selectStyle={backgroundColor:theme.components.Chips.selectBackgroundColor,color:theme.components.Chips.selectColor,opacity:"88%"};
  let rating="",currGen=[];
  if(!videoPlayer)
  {
    rating=age['val'];
    currGen=genre['val'];   
  } 
  const [open, setOpen] = React.useState(false);
  const [formData,setData]=useState({
    "videoLink": "",
    "title": "",
    "genre": "",
    "contentRating": "",
    "releaseDate": "",
    "previewImage":""
  });
  function update(event)
  {
    if(event.$d)
    {
        console.log(event,event.$d,moment(event.$d).format("DD MMM YYYY"));
        setData((prevState)=>{
            return {...prevState,'releaseDate':moment(event.$d).format("DD MMM YYYY")};//for updating specific values of an object
        });
    }
    else{
            setData((prevState)=>{
                console.log(event.target.name,event.target.value);
                return {...prevState,[event.target.name]:event.target.value};//for updating specific values of an object
            });
    }
  }
  const handleClickOpen = () => {
    setOpen(true);
};
function validateInput(formData)
{
  for(let [key, value] of Object.entries(formData))
  {
    if(value==='')
    {
        enqueueSnackbar("Field Empty",{variant:"error"});
        return false;
    }
  }
  return true;
}
async function handleUpload(){
      if(!validateInput(formData))
        return;
      console.log('Uploaded Video:',formData);
      try{
        const base=`${ipConfig.backendIP}/v1/videos`;
        let response=await axios.post(`${base}`,formData);
        console.log(response);
        enqueueSnackbar("Uploaded successfully",{variant:"success"});
      }
      catch(error)
      {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2x
          // Something like 4xx or 500
          //console.log(error.response);
          enqueueSnackbar(error.response.data.message,{variant:"error"});
        } 
        else {
          // Something happened in setting up the request that triggered an Error
          //console.log(error.response);
          enqueueSnackbar("Something went wrong. Check that the backend is running, reachable and returns a valid JSON",{variant:"error"});
        }
      }
}
const handleClose = () => {
  setOpen(false);
};
return (
    <Grid container className="header-grid"spacing={2} style={{backgroundColor:theme.components.Header.backgroundColor}}>
      <Grid item xs={12}>
        <Box className="toprow">
          <img src="/Logo.png" height="30px" width="62px" alt="QKart-icon"></img>
          {!videoPlayer?
              <>
                  <TextField
                      className="search-desktop"
                      sx={{
                        "& .MuiInputBase-root": {
                          border:`1px solid ${theme.components.Search.borderColor}`
                        },
                        "& .MuiInputBase-input":{
                          color:theme.components.Search.textColor
                        }
                      }
                      }
                      size="small"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Search color="red" />
                          </InputAdornment>
                        ),
                      }}
                      placeholder="Search"
                      name="search"
                      value={searchKey}
                      onChange={debounceSearch}
                    />
                <div>
                  <Button variant="contained" endIcon={<UploadIcon />}onClick={handleClickOpen}>
                    Upload
                  </Button>
  
                  <Dialog open={open} onClose={handleClose} sx={{'.MuiPaper-root':{backgroundColor: "#383838!important",padding:"1rem 1rem 1.5rem!important"}}}>
                    <Stack className="dialog-header"direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                    <DialogTitle >Upload Video</DialogTitle>
                    <IconButton aria-label="upload picture" component="label" onClick={handleClose}>
                        <CloseIcon/>
                    </IconButton>
                    </Stack>
                    <DialogContent className="dialog-content"
                     sx={{
                              "& .MuiFormLabel-root": {
                                  color: '#AFAFAF'
                              },
                              "& .MuiFormLabel-root.Mui-focused": {
                                color: '#AFAFAF'
                              },
                              "& .MuiInputBase-root": {
                                border:`1px solid #AFAFAF`
                              },
                              "& .MuiInputBase-root.Mui-focused": {
                                border:`1px solid #AFAFAF`
                              },
                              "& .MuiInputBase-input":{
                                color:"#AFAFAF"
                              },
                              "& .MuiFormHelperText-root":{
                                color: '#AFAFAF'
                              },
                              "& .MuiTextField-root":{
                                width:"34.375vw",
                                '@media (max-width:768px)': {
                                  width: '70vw'}
                              }
                            }
                            }>
                      <TextField
                            name="videoLink"
                            label="Video Link"
                            helperText="This link will be used to derive the video"
                            value={formData.videoLink}
                            onChange={update}
                          />
                      <TextField
                            name="previewImage"
                            label="Thumbnail Image Link"
                            helperText="This link will be used to preview the thumbnail image"
                            value={formData.previewImage}
                            onChange={update}
                            />
                        <TextField
                              name="title"
                              label="Title"
                              helperText="The title will be the representative text for video"
                              value={formData.title}
                              onChange={update}
                            />
                        <FormControl className="select-box">
                            <InputLabel id="genre-list">Genre</InputLabel>
                            <Select
                              id="genre-list"
                              name="genre"
                              value={formData.genre}
                              onChange={update}
                            >
                              <MenuItem value="Education">{"Education"}</MenuItem>
                              <MenuItem value="Sports">{"Sports"}</MenuItem>
                              <MenuItem value="Comedy">{"Comedy"}</MenuItem>
                              <MenuItem value="Lifestyle">{"Lifestyle"}</MenuItem>
                            </Select> 
                            <FormHelperText>Genre will help in categorizing your videos</FormHelperText> 
                        </FormControl> 
                        <FormControl className="select-box">
                        <InputLabel id="rating-list">Suitable age group for the clip</InputLabel>
                        <Select
                          id="rating-list"
                          name="contentRating"
                          value={formData.contentRating}
                          onChange={update}
                        >
                          <MenuItem value="7+">7+</MenuItem>
                          <MenuItem value="12+">12+</MenuItem>
                          <MenuItem value="16+">16+</MenuItem>
                          <MenuItem value="18+">18+</MenuItem>
                        </Select> 
                        <FormHelperText>This will be used to filter videos on age group suitability</FormHelperText>  
                        </FormControl>   
                        <LocalizationProvider className="loco"dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Release Date"
                                value={formData.releaseDate}
                                onChange={update}
                                renderInput={(params) => (
                                  <TextField {...params} helperText={"This will be used to sort videos"} error={false}/>
                                )}
                            />
                        </LocalizationProvider>
                  </DialogContent>
                  <DialogActions style={{justifyContent:"flex-start"}}>
                  <Button variant="contained" style={{backgroundColor:theme.components.Button.uploadbackgroundColor}} onClick={handleUpload}>Upload Video</Button>
                  <Button variant="text" style={{color:theme.components.Button.cancelTextColor}}onClick={handleClose}>Cancel</Button>
                  </DialogActions>
                </Dialog>
              </div>                    
            </>:null}
      </Box>
    </Grid>
    {!videoPlayer?
    <>
      <Grid item className="filters" xs={12}>
      <Stack direction="row" flexWrap="wrap" justifyContent="center" alignItems="center" spacing={{ sm: 0, md: 3 }}>
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={{ sm: 0, md: 2 }} sx={
                  {'& .css-1m4faer-MuiStack-root' :{
                        '@media (max-width:768px)': {
                           marginLeft:"1px"}}}}>
            <Chip className="any" label="All Genre" style={!currGen.length?selectStyle:deselectStyle}onClick={genreFilter} />
            <Chip label="Education"  style={currGen.includes("Education")?selectStyle:deselectStyle}onClick={genreFilter} />
            <Chip label="Sports" style={currGen.includes("Sports")?selectStyle:deselectStyle}onClick={genreFilter}/>
            <Chip label="Comedy" style={currGen.includes("Comedy")?selectStyle:deselectStyle}onClick={genreFilter}/>
            <Chip label="Lifestyle"style={currGen.includes("Lifestyle")?selectStyle:deselectStyle}onClick={genreFilter}/>
          </Stack>
          <Chip style={selectStyle} icon={<ImportExportIcon/>} label={sortBy} onClick={sortVids} />
      </Stack>
      </Grid>
      <Grid item className="filters" xs={12}>
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
          <Chip className="any" label="Any age group" style={rating===""?selectStyle:deselectStyle}onClick={ratingFilter} />
          <Chip label="7+"  style={rating==="7"?selectStyle:deselectStyle}onClick={ratingFilter}/>
          <Chip label="12+" style={rating==="12"?selectStyle:deselectStyle}onClick={ratingFilter}/>
          <Chip label="16+" style={rating==="16"?selectStyle:deselectStyle}onClick={ratingFilter}/>
          <Chip label="18+" style={rating==="18"?selectStyle:deselectStyle}onClick={ratingFilter}/>
        </Stack>
      </Grid>
    </>:null}
  </Grid>
  );
}
      