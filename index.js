var {ipcRenderer, remote} = require('electron');  
var mainProcess = remote.require("./main.js");

class YouTubeDownloaderForm extends React.Component 
{
  constructor(props) 
  {
    super(props);
    this.state = 
    {
      url: '', 
      urlInvalid: false,
      urlsInformation:[]
    };
    this.handleAddClick = this.handleAddClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);      
    this.handleChangeClick = this.handleChangeClick.bind(this);
    this.handleUrlChange = this.handleUrlChange.bind(this);
    this.updateUrlInformation = this.updateUrlInformation.bind(this);
  }
  componentDidMount() 
  {
    ipcRenderer.on('UrlInformation', this.updateUrlInformation)
  } 
  componentWillUnmount() 
  {
    ipcRenderer.removeListener('UrlInformation', this.updateUrlInformation)
  }

  updateUrlInformation(event, arg) 
  {
    if(arg=== false)
    {
      this.setState({urlInvalid: true});
      return;
    }
    this.setState({urlInvalid: false});
    
    var urlsInformation = this.state.urlsInformation;
    urlsInformation.push(arg);
    this.setState({urlsInformation: urlsInformation});
    this.setState({url: ''});
  }

  handleAddClick(event) 
  {      
    mainProcess.getUrlInformation(this.state.url);
  }
  handleUrlChange(event) 
  {
    this.setState({url: event.target.value});
  }
  handleChangeClick(event) 
  {
  }
  handleSubmit(event) 
  {
    event.preventDefault();
  }
  render() 
  {
    return (
      <form className="col s12" onSubmit={this.handleSubmit}>
        <div className="row">
          <div className="input-field">
            <input id="Url" type="text" value={this.state.url} 
            className={this.state.urlInvalid===true?'invalid':''} onChange={this.handleUrlChange}></input> 
            <label id="UrlLabel" htmlFor="Url" data-error={this.state.urlInvalid===true?'The entered url seems to be invalid. ':''} 
            className="active">Url</label>                     
          </div>          
    </div>

    <div className="row">
        <a className="waves-effect waves-light btn" onClick={this.handleAddClick}><i className="material-icons left">cloud</i>Add</a>
    </div> 

    <div className="row">
      <table className="striped bordered">
            <thead>
              <tr>
                <th><input type="checkbox" className="filled-in" id="filled-in-box" checked="checked" onChange={this.handleChangeClick}/>
                  <label htmlFor="filled-in-box"></label></th>
                  <th>ThumbNail</th>
                <th>Title</th>
                  <th>Size</th>
                  <th>% completed</th>
                  <th>Status</th>
              </tr>
            </thead>
    
            <tbody>              
              {this.state.urlsInformation.map((urlInformation, key) => (
                <tr key={key}>
                  <td><input type="checkbox" className="filled-in" id="filled-in-box" />
                      <label htmlFor="filled-in-box"></label> </td>
                  <td>
                      <img className="materialboxed" src={urlInformation.thumbnail_url}/>
                  </td>
                  <td>{urlInformation.title}</td>
                  <td>10 MB</td>
                  <td>0%</td>
                  <td>Not Started</td>
                </tr>
              ))}
            </tbody>
          </table>
    </div>
    <div className="row">
      <button className="btn waves-effect waves-light" type="button" name="action">Download</button>
    </div>
  </form>
    );
  }
}
ReactDOM.render(<YouTubeDownloaderForm/>, document.getElementById('root'));