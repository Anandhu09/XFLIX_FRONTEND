import { Route, Switch } from "react-router-dom";
import './App.css';
import Landing from './Landing';
import VideoPlayer from './VideoPlayer';
function App() {
  return (
    <div className="App">
        <Switch>
          {/* switch helps choose the first matched path */}
          <Route exact path="/" component={Landing}/>
          {/* route is used to specify all our routes */}
          <Route exact path="/video/:id" component={VideoPlayer} />
          {/* use :id to dynamically route based on a variable video id */}
        </Switch>
    </div>
  );
}
export default App;

