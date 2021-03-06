import React, { Component } from 'react';
import './App.css';
import Title from './components/Title';
import AddTask from './components/AddTask';
import MinorButton from './components/minorButton';
import Table  from './components/Table';
import randomstring from 'randomstring';
import {findIndex} from 'lodash';
import {connect} from 'react-redux';
import * as actions from './actions/index';


class App extends Component {
  
  constructor(props){
    super(props);
    this.state = {
      showAddTask : false,
      taskEdit: null,
      taskFilter: {
        name:'',
        status: -1
      },
      keyword : '',
      sortByName:'name',
      sortByValue:1
    }
    this.generatorButton = this.generatorButton.bind(this);
    this.toggleTask = this.toggleTask.bind(this);
    this.closeTask = this.closeTask.bind(this);
    // this.onSubmit = this.onSubmit.bind(this);
    this.onUpdateStatus = this.onUpdateStatus.bind(this);
    
  }
  generatorButton(){
    const tasks = [
      {
        id:this.randomId(),
        name:'ReactJS',
        status: true
      },{
        
        id:this.randomId(),
        name:'NodeJS',
        status: false
      },{
        
        id:this.randomId(),
        name:'AngularJS',
        status: true
      }
    ];   
    this.setState({
      tasks : tasks
    });
    localStorage.setItem('tasks',JSON.stringify(tasks));
  }
  randomId(){
    return randomstring.generate(7);
  }
  toggleTask(){
    // if(this.state.showAddTask && this.state.taskEdit !== null){
    //   this.setState({
    //     showAddTask : true, 
    //     taskEdit :null
    //   }
    //  )
    // }else{
    //   this.setState({
    //     showAddTask : !this.state.showAddTask,
    //     taskEdit : null
    //   })
       
    // }
    this.props.onToggleForm();
  }
  showTask = () =>{
    this.setState({
      showAddTask : true
    })
  }
  closeTask(){
    this.props.onCloseTask();
  }
  
  
  onUpdateStatus(id){
    const {tasks} = this.state;
    const index = findIndex(tasks, (task)=>{
      return task.id  === id
    })
    if(index !== -1){
      tasks[index].status = !tasks[index].status;
      this.setState({
        tasks : tasks
      });
      localStorage.setItem('tasks',JSON.stringify(tasks));
    }
  } 
  findIndex(id){
    const {tasks} = this.state;
    let resultIndex = -1 ;
    tasks.forEach((element,index) => {
      if(element.id === id){
        resultIndex = index;
      }
    });
    return resultIndex;
  }
  onDelete = (id) =>{
    const {tasks} = this.state;
    const index = findIndex(tasks, (task)=>{
      return task.id  === id
    })
    if(index !== -1){
      tasks.splice(index,1);
      this.setState({
        tasks : tasks
      });
      localStorage.setItem('tasks',JSON.stringify(tasks));
    }
  }
  onEdit =(id)=>{
    const {tasks} = this.state;
    const index = this.findIndex(id);
    const taskEdit = tasks[index];
    this.setState({
      taskEdit : taskEdit
    })
    this.showTask();
    // this.setState
  }
  onFilter = (filterName,filterStatus) =>{
    filterStatus = parseInt(filterStatus,16);
    this.setState({
      taskFilter : {
        name: filterName.toLowerCase(),
        status:filterStatus
      }
    })
  }
  onSearch = (keyword) =>{
    this.setState({
      keyword : keyword
    })
      
  }
  onSort = (sortByName,sortByValue) =>{
    this.setState({
      sortByName:sortByName,
      sortByValue:sortByValue
    })
  }

  render() {
    // let { taskFilter} = this.state;
    const { taskEdit,
      // keyword,
      sortByName,sortByValue } = this.state;
    const {isShowAddTask} = this.props;
    const checkTask = isShowAddTask ? <AddTask  onCloseTask={this.props.onCloseTask} taskEdit={taskEdit} closeTask={this.closeTask} /> : '';
    // if(taskFilter.name){
    //    tasks = tasks.filter(task =>{
    //     return  task.name.toLowerCase().indexOf(taskFilter.name) !== -1
    //   })
    // }
    // tasks = tasks.filter(task =>{
    //   if(taskFilter.status === -1){
    //     return task
    //   }else{
    //     return task.status === (taskFilter.status === 1 ? true : false); 
    //   }
    // })
    // if(keyword){
    //   tasks = tasks.filter(task =>{
    //     return  task.name.toLowerCase().indexOf(keyword) !== -1
    //   })
    // }
    // if(sortByName === "name"){
    //   tasks.sort((a,b) =>{
    //     if(a.name > b.name){
    //       return sortByValue
    //     }else if(a.name < b.name){
    //       return -sortByValue 
    //     }else{
    //       return 0
    //     }
    //   })
    // }else{
    //   tasks.sort((a,b) =>{
    //     if(a.status > b.status){
    //       return -sortByValue
    //     }else if(a.status < b.status){
    //       return sortByValue 
    //     }else{
    //       return 0
    //     }
    //   })
    // }

    return (
      <div className="container ">
        <div className="row">
          <Title />
          {checkTask}
          <div className={isShowAddTask ? "col-xs-8 col-sm-8 col-md-8 col-lg-8" : "col-xs-12 col-sm-12 col-md-12 col-lg-12"}>
            <MinorButton sortByName={sortByName} sortByValue={sortByValue} onSort={this.onSort} onSearch={this.onSearch} generatorButton={this.generatorButton} toggleTask={this.toggleTask} />
            <Table onFilter={this.onFilter}  onUpdateStatus={this.onUpdateStatus} onDelete={this.onDelete} onEdit={this.onEdit}/>
          </div>
        </div>
      </div>
    );
  }
}
const mapStatetoProps = (state) =>{
  return{
    isShowAddTask : state.isShowAddTask
  }
}
const mapDispatchToProps = (dispatch, props) =>{
  return {
    onToggleForm : () =>{
      dispatch(actions.toggleTask())
    },
    onCloseTask : () =>{
      dispatch(actions.closeTask())
    },
    onOpenTask : () =>{
      dispatch(actions.openTask())
    }
  }
}

export default connect(mapStatetoProps,mapDispatchToProps)(App);
