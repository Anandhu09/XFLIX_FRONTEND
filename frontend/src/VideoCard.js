import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import './VideoCard.css'
import { useTheme } from '@mui/material/styles';
import { Link } from "react-router-dom";
import moment from 'moment';
export default function VideoCard(props) {
 const theme = useTheme();
 //console.log(props.video);
 let date= new Date(`${props.video.releaseDate}`);//converts release Date into date object
 let getYear = date.toLocaleString("default", { year: "numeric" });//get year,day and month from date obejct using options
 let getMonth = date.toLocaleString("default", { month: "2-digit" });
 let getDay = date.toLocaleString("default", { day: "2-digit" });
 let dateOfUpload=moment(`${getYear}${getMonth}${getDay}`, "YYYYMMDD").fromNow();/*moment helps find releaseDate in terms of
 xxx ago from today*/
 //console.log(date,getYear);
  return (

    <Card className="card"sx={{backgroundColor:theme.components.Grid.backgroundColor}}>
      <Link to={{     
         pathname:`/video/${props.video._id}`
        }}
        style={{ textDecoration: 'none' }}>
            <CardActionArea>
              <CardMedia
                className="card-image"
                component="img"
                image={props.video.previewImage}
                alt={props.video.title}
              />
              <CardContent className="card-content">
                <Typography className="card-text"sx={{color:theme.components.Card.primary}}gutterBottom component="div">
                  {props.video.title}
                </Typography>
                <Typography sx={{color:theme.components.Card.secondary}}variant="body2" color="text.secondary">
                  {dateOfUpload}
                </Typography>
              </CardContent>
            </CardActionArea>
       </Link>
    </Card>
  );
}
