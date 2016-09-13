import React from 'react'
import TreeLookup from './tree-api'
import classNames from 'classnames';
var lookup = new TreeLookup();
export default React.createClass({
  contextTypes: {
    router: React.PropTypes.object
  },
  getInitialState(){
      return {
          result: null,
          searchedPath: [],
          showProcessedPath:false
      }
  },
  componentWillMount(){
    var search = this.props.params.search;
    if(search){
      this.setState({
        search:search
      },()=>{
        this.onSearch();
      });
    }
  },
  toggleProcessedPath(){
      this.setState({
          showProcessedPath: !this.state.showProcessedPath
      });
  },
  onSearch() {
	var val = this.refs.nodeVal.value;
	this.setState({
		search:val
	})
    this.searchNode(val)
      .then(obj=> {
          this.setState({
              result: obj && obj.foundPath ?obj.foundPath:null,
              searchedPath: obj && obj.searchedPath?obj.searchedPath:[]
          });
      })
      .catch(err=> {
        console.log(err)
      })
  },
  searchNode(node){
	  this.context.router.push(node?'/search/' + node:'/');
      var searchedPath = [];

      function startSearch(paths) {
          paths = Array.isArray(paths) ? paths : [paths];
          if (!paths.length) {
              return Promise.resolve({searchedPath:searchedPath});
          }
          var path = paths.shift();
          return lookup.getChildrenAsPromise(path)
              .then(function (children) {
                  for (var iIndex = 0; iIndex < children.length; iIndex++) {
                      var child = children[iIndex];
                      var curPath = path + child + '/';
                      searchedPath.push(curPath);
                      if (child == node) {
                          paths = [];
                          return Promise.resolve({foundPath:curPath,searchedPath:searchedPath});
                      }
                      paths.push(curPath);
                  }
                  return startSearch(paths);
              });
      }
      return startSearch("/");
  },
  onKeyPress(event){
    if(event.charCode==13){
      this.onSearch();
    }
  },
  render() {
    return <div>
      <div className="row">
        <div className="col-xs-12">
          <div className="input-group col-md-12">
            <input ref="nodeVal" type="number" className="search-query form-control" placeholder="Enter element to search" defaultValue={this.state.search}
                   onKeyPress={this.onKeyPress}/>
              <span className="input-group-btn">
               <button className="btn btn-danger" type="button" onClick={this.onSearch}>
                <span className="glyphicon glyphicon-search"></span>
               </button>
              </span>
          </div>
        </div>
      </div>
        <hr/>
      <div className="row">
        <div className="col-xs-12">
              {
                this.state.result?
                <div className="">
                    Found Path : &nbsp;
                  {
                      this.state.result.split('/').filter(x=>x.length).map((x,index)=>{
                           return <span key={index}> / <span className="badge">{x}</span></span>
                      })
                  }
                </div>
                :
                <div className="">
					{this.state.search?<span>Path not found for {this.state.search}.</span>:<span>Nothing to search.</span>}
                </div>
              }
        </div>
      </div>
        <hr/>
        <div className="row">
            <div className="col-xs-12">
                <h4> Processsed Paths ({this.state.searchedPath.length})&nbsp;
                    <button type="button" className="btn btn-default btn-xs" title="Show/hide processed paths" onClick={this.toggleProcessedPath}>
                        <span className={classNames({
                            glyphicon:true,
                            "glyphicon-chevron-down":!this.state.showProcessedPath,
                            "glyphicon-chevron-up":this.state.showProcessedPath,
                        })} aria-hidden="true"></span></button>
                </h4>
            </div>

            <div className="col-xs-12">
                {
                    this.state.showProcessedPath?
                    this.state.searchedPath.map((x,index)=> {
                        return <div key={index}>{
                            x.split('/').filter(x=>x.length).map((x, index)=> {
                                return <span key={index}> / {x} </span>
                            })
                        }
                    </div>
                    }):""
                }
            </div>
        </div>
    </div>
  }
})
