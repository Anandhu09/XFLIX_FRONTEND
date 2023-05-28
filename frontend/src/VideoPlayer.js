import React from 'react';
import { useEffect,useState} from 'react';
import Box from '@mui/material/Box';
import {Grid} from "@mui/material";
import Header from './Header.js'
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import VideoGrid from "./VideoGrid.js"
import Stack from '@mui/material/Stack';
import './VideoPlayer.css'
import CircleIcon from '@mui/icons-material/Circle';
import Chip from '@mui/material/Chip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp,faThumbsDown } from '@fortawesome/free-regular-svg-icons';
import { useSnackbar } from "notistack";
import moment from 'moment';
import ipConfig from "./ipConfig.json";
export default function Landing() {
let location = new URL(window.location.href);
let l_id=location.pathname.split('/')[2];// get value of "id" parameter
console.log('Current location',l_id);
const theme = useTheme();
const [videos,setVideos]=useState([]);//state to save videos
const [current,setCurrent]=useState([]);//currently displayed video
const { enqueueSnackbar } = useSnackbar();
async function fetchData(){
      const base=`${ipConfig.backendIP}/v1/videos`;
      try{
        let url=base;
        const response = await axios.get(url);
        //console.log(response,response.data.videos);
        setVideos(response.data.videos);
        }
        catch (e) {
            enqueueSnackbar(e.response.data.message, { variant: "error" });
          }
}
async function getVideo(){
  const base=`${ipConfig.backendIP}/v1/videos`;
  try{
    let url=`${base}/${l_id}`;
    const response = await axios.get(url);
    setCurrent(response.data);
    console.log('Current video',response,response.data,current);
    }
    catch (e) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      }
}
useEffect(()=>{
  (async () => {
    console.log('OnMount')
    await fetchData();
    await getVideo();
    await upDateViews();
  })();
},[]);
let date= new Date(`${current.releaseDate}`);//converts release Date into date object
let getYear = date.toLocaleString("default", { year: "numeric" });//get year,day and month from date obejct using options
let getMonth = date.toLocaleString("default", { month: "2-digit" });
let getDay = date.toLocaleString("default", { day: "2-digit" });
let dateOfUpload=moment(`${getYear}${getMonth}${getDay}`, "YYYYMMDD").fromNow();/*moment helps find releaseDate in terms of
xxx ago from today*/
function formatNumber(n)//format number in terms of power of 1000
{
  const ranges = [
    { divider: 1e18 , suffix: 'E' },
    { divider: 1e15 , suffix: 'P' },
    { divider: 1e12 , suffix: 'T' },
    { divider: 1e9 , suffix: 'G' },
    { divider: 1e6 , suffix: 'M' },
    { divider: 1e3 , suffix: 'k' }
  ];
    for (var i = 0; i < ranges.length; i++) {
      if (n >= ranges[i].divider) {
        return (n / ranges[i].divider).toString() + ranges[i].suffix;
      }
    }
    return n.toString();
}
async function upDateViews()
{
  const url=`${ipConfig.backendIP}/v1/videos/${l_id}/views`;
  try{
    const response = await axios.patch(url);
    console.log('New View',response,current);
    setCurrent((prevState)=>{
      return {...prevState,viewCount:(parseInt(prevState.viewCount)+1).toString()};//for updating specific values of an object
    });
  }
    catch (e) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      }
}
async function upVote()
{
  const url=`${ipConfig.backendIP}/v1/videos/${l_id}/votes`;
  try{
    const response = await axios.patch(url,{"vote": "upVote","change": "increase"});
    console.log('Upvoted',response,current);
    setCurrent((prevState)=>{
      return {...prevState,votes:{...prevState.votes,upVotes:(parseInt(prevState.votes.upVotes)+1).toString()}};//for updating specific values of an object
    });
    }
    catch (e) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      }
}
async function downVote()
{
  const url=`${ipConfig.backendIP}/v1/videos/${l_id}/votes`;
  try{
    const response = await axios.patch(url,{"vote": "downVote","change": "increase"});
    // setCurrent(response.data);
    console.log('Downvoted',response,response.data,current);
    setCurrent((prevState)=>{
      return {...prevState,votes:{...prevState.votes,downVotes:(parseInt(prevState.votes.downVotes)+1).toString()}};//for updating specific values of an object
    });
  }
    catch (e) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      }
}
  return (
    <>
    {console.log('In return',current)}
    <Header videoPlayer={true}></Header>
      <Grid container spacing={2} sx={{backgroundColor:theme.components.Grid.backgroundColor}}>
          <Grid item xs={12}>
            <iframe 
                src={`https://${current.videoLink}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Embedded youtube"
              />
            {
              current.title?
              <Stack className="video-details"spacing={1}>
                <Box className="videoTitle" sx={{color:theme.components.Video.primaryColor}}>
                    {current.title}
                </Box>
                <Stack direction="row"  className="votes" justifyContent="flex-end" sx={
                  {'@media (max-width:768px)': {
                    height: '5vh',alignItems:"center" },
                    '& .MuiChip-root':{
                        '@media (max-width:768px)': {
                           height: '3vh',width:"10vw" }}}}spacing={1}>
                            {/* with sx you can use media queries not possible with styles */}
                    <Chip icon={<FontAwesomeIcon icon={faThumbsUp} className="up-vote"/>} label={formatNumber(current.votes.upVotes)}sx={{backgroundColor:theme.components.Video.chipUp,color:"#FFFF",width:"4.7rem"}} onClick={upVote}/>
                    <Chip icon={<FontAwesomeIcon icon={faThumbsDown} className="down-vote"/>} label={formatNumber(current.votes.downVotes)}sx={{backgroundColor:theme.components.Video.chipDown,color:"#FFFF",width:"4.7rem"}}onClick={downVote}/>
                </Stack>
                <Stack sx={{color:theme.components.Video.secondaryColor}} direction="row" className="timeRating" spacing={1}>
                        <Box >{formatNumber(current.viewCount)}</Box>
                          <CircleIcon className="circle-icon"/>
                        <Box >{current.genre}</Box>
                          <CircleIcon className="circle-icon"/>
                        <Box >{dateOfUpload}</Box>
                </Stack>
              </Stack>:null
            }
          </Grid>
        <Grid item xs={12}>
        </Grid>
      </Grid>
    <VideoGrid player={true}videos={videos}/>
    </>
  );
}