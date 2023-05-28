
import React from 'react';
import {Grid} from "@mui/material";
import { useTheme } from '@mui/material/styles';
import VideoCard from "./VideoCard.js"
import "./VideoGrid.css"
export default function VideoGrid({player,videos}) {
  const theme = useTheme();//use theme helps to use the context of theme object defined in index.js
  return ( 
              <Grid className="videoGrid" container spacing={1}sx={{backgroundColor:theme.components.Grid.backgroundColor}}>
                {
                    videos.map(video=>{
                        return ( <Grid className="videoCardGrid"item xs={6} md={3} key={video._id}><VideoCard video={video}/></Grid>)
                    })             
                }
              </Grid>
         );
}
