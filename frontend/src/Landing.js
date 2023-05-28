import React from 'react';
import { useEffect,useState,useRef } from 'react';
import Header from './Header.js'
import axios from 'axios';
import VideoGrid from "./VideoGrid.js"
import './Landing.css'
import { useSnackbar } from "notistack";
import ipConfig from "./ipConfig.json";
export default function Landing() {
const { enqueueSnackbar } = useSnackbar();
const [videos,setVideos]=useState([]);//state to save videos
const [search,setSearch]=useState("");//state to save search bar text
const [sortBy,setSortBy]=useState("Release Date");//state to save order of sorting by view count or release date
const [age, setAge] = useState({'Any age group':true,'7+':false,'12+':false,'18+':false,'val':""});//state to save rating filter applied.
const [genre, setGenre] = useState({'All Genre':true,'Education':false,'Sports':false,'Comedy':false,'Lifestyle':false,'val':[]});
/*state to save genre filter(s) applied.More than one can be applied*/
const timer=useRef(null);//ref variable to keep track of current timer id in debounce fucntion
const apiCount=useRef(0);//ref to keep track of api calls so far
const isInitialMount = useRef(true);//to prevent useEffect from running on update on initial mount
async function fetchData(query,type){//function to fetch data from backend
  const base=`${ipConfig.backendIP}/v1/videos`;
  console.log('Call API',timer.current);
  apiCount.current+=1;
  console.log(apiCount.current)
  try{
    let url=base;
    if(type==='title' && query)
      url=`${base}?title=${query}`;
    else{
      if(genre['val'].length!==0 && age.val!=="")//if both genre and rating tags are applied
      {
        let categories= genre['val'].join(",");
        url=`${base}?genres=${categories}&contentRating=${age.val.split('+')[0]}%2B`;
      }
      else if(genre['val'].length!==0)//if only genre applied
       {
        let categories= genre['val'].join(",");
        url=`${base}?genres=${categories}`;
      }
      else if(age.val!==""){//if only rating applied
         url=`${base}?contentRating=${age.val.split('+')[0]}%2B`;
      }
    }
    const response = await axios.get(url);
    console.log(response,response.data.videos);
    let vidClone = structuredClone(response.data.videos);
       vidClone.sort( (a,b) =>{
        const date1 = new Date(a.releaseDate)
        const date2 = new Date(b.releaseDate)
        return date2-date1;
      });
    setVideos(vidClone);
    }
    catch (e) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      }
}
useEffect(()=>{//called on component mount
console.log('On Mount');
fetchData();
},[]);
useEffect(()=>{//called when a new filter is clicked or added
  if(isInitialMount.current)
    isInitialMount.current=false;
  else
  {
    console.log('On Update');
    fetchData();
  }
},[age,genre]);
function debounceSearch(e)//function to debounce search
{ 
if(timer.current)
clearTimeout(timer.current);
setSearch((prevState)=>e.target.value);
timer.current=setTimeout(()=>{
fetchData(e.target.value,'title');
},2000);
console.log(timer.current);
}
function genreFilter(e)//function to set genre
{
let newGenre=structuredClone(genre),currGenre=e.target.innerText;
console.log(currGenre);
if((currGenre==='All Genre' && newGenre['val'].length===0))//if newgenre is All genre and All genre is already selected no change
    return;
if(newGenre['val'].includes(currGenre))//if new genre is already present in selected list remove it
  {
    const index = newGenre['val'].indexOf(currGenre);
    newGenre['val'].splice(index, 1);
    newGenre[currGenre]=false;
    
  }
  else if(currGenre==='All Genre')//if All genre is selected remove all other genres and select All genre
  {
    let temp = Object.keys(newGenre);
    temp.forEach((ele) => {
      newGenre[ele]=false;
    }); 
    newGenre[currGenre]=true;
    newGenre['val']=[];
  }
  else{//in all other cases add the new genre to selected list and make All genre false if it was the previous selection
    newGenre['val'].push(currGenre);
    newGenre[currGenre]=true;
    newGenre['All Genre'] =false;
  }
console.log(newGenre,typeof newGenre);
setGenre((prevState)=>{
    return {...newGenre};
});
}
function ratingFilter(e)//function to set rating
{
let ratings=structuredClone(age),currentAge=e.target.innerText;
console.log(currentAge);
if((currentAge==='Any age group' && ratings['val']==="")||currentAge==ratings['val'])//if a rating is selected already return
  return;
console.log('eheh',ratings['val'],currentAge);
let ages = Object.keys(ratings);
ages.forEach((age) => {//in all other cases make the other ratings false and current one true
  if(age===currentAge)
    ratings[age]=true;
  else
    ratings[age]=false;
});
if(currentAge==='Any age group')//if current rating is Any then make val null
      ratings['val']="";
else
  ratings['val']=currentAge;//send age without + as we will send encoding of + in url
console.log(ratings,typeof ratings);
setAge((prevState)=>{
    return {...ratings};
});
}
function sortVids()
{
  // Clone videos
  let vidClone = structuredClone(videos);
  if(sortBy==='View Count'){
    vidClone.sort( (a,b) =>{//convert dates into date objects and then compare or else sort will incorrectly sort lexicographically
      const date1 = new Date(a.releaseDate)
      const date2 = new Date(b.releaseDate)
      return date2-date1;
    });
    setSortBy('Release Date');
  }
  else
  {
    vidClone.sort( (a,b) => b['viewCount'] - a['viewCount']);
    setSortBy('View Count');
  }
  console.log(vidClone);
  setVideos(vidClone);
}
return (
  <>
  <Header videoPlayer={false}searchKey={search} debounceSearch={debounceSearch} genreFilter={genreFilter} ratingFilter={ratingFilter} age={age} genre={genre} sortBy={sortBy} sortVids={sortVids}></Header>
  <VideoGrid player={false} videos={videos}/>
  </>
);
}
