import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import {Button} from 'react-materialize';
import { getFirestore } from 'redux-firestore';
import { withRouter} from 'react-router-dom';
import {Rnd} from 'react-rnd';


class ListScreen extends Component {
    
    state = {
        zoom: 1,
        widthtext: this.props.wireFrame.width,
        heighttext: this.props.wireFrame.height,
        changeSave: "disabled",
        changeDimensions: "disabled",
        selectedDiv: "",
        resizePrevention: false,
        tempo: false,

        name: this.props.wireFrame.name,
        width: this.props.wireFrame.width,
        height: this.props.wireFrame.height,
        objects: this.props.wireFrame.objects
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevState.zoom != this.state.zoom) {
            this.unselectDivs()
        }
        if(this.state.tempo) {
            this.okiedokie()
        }
    }
    okiedokie = () => {
        this.setState({objects: this.state.objects, tempo: false})
    }
    handleChange = (e) => {
        const { target } = e;
    
        this.setState(state => ({
          ...state,
          changeSave: "",
          [target.id]: target.value,
        }));
      }
    handleDimensionChange = (e) => {
        const { target } = e;
        if(!isNaN(target.value)) {   
            this.setState(state => ({
            ...state,
            changeDimensions: "",
            [target.id]: target.value,
            }));
        }
    }
    updateDimensions = () => {
        let normalwidth = true;
        let normalheight = true;
        if(this.state.widthtext > 5000) {
            normalwidth = false;
            this.setState({width: 5000, widthtext: 5000});
        }
        if(this.state.widthtext < 1) {
            normalwidth = false;
            this.setState({width: 1, widthtext: 1});
        }
        if(this.state.heighttext > 5000) {
            normalheight = false;
            this.setState({height: 5000, heighttext: 5000});
        }
        if(this.state.heighttext < 1) {
            normalheight = false;
            this.setState({height: 1, heighttext: 1});
        }
        if(normalheight) {
            this.setState({height: this.state.heighttext});
        }
        if(normalwidth) {
            this.setState({width: this.state.widthtext});
        }
        this.setState({changeSave: "", changeDimensions: "disabled"});
    }
    okzoomerin = (e) => {
        let ok = this.state.zoom * 2;
        this.setState(state => ({
            ...state,
            zoom: ok,
            }));
    }
    okzoomerout = (e) => {
        let ok = this.state.zoom * 1/2;
        this.setState({zoom: ok}, console.log(this.state.zoom));
    }
    goHome = () => {
        this.props.history.push("/");
    }
    goSave = () => {
        let id = this.props.auth.uid;
        const fireStore = getFirestore();
        fireStore.collection('wireFrames').doc(this.props.wireFrame.id).update({
            width: this.state.width,
            height: this.state.height,
            objects: this.state.objects,
            name: this.state.name
        });
        this.props.history.push("/");
    }
    onDragStop = (e, d) => {
        e.stopPropagation();
        let tempobject = this.state.objects;
        if(this.state.selectedDiv != "") { 
        tempobject[this.state.selectedDiv].x = d.x;
        tempobject[this.state.selectedDiv].y = d.y;
        }
        this.setState({objects: tempobject, changeSave: ""});
    }
    onResizeStop = (e,direction,ref,delta,position) => {
        e.stopPropagation();
        let tempobject = this.state.objects;
        if(this.state.selectedDiv != "") { 
        tempobject[this.state.selectedDiv].width = ref.style.width;
        tempobject[this.state.selectedDiv].height = ref.style.height;
        tempobject[this.state.selectedDiv].x = position.x;
        tempobject[this.state.selectedDiv].y = position.y;
        this.setState({objects: tempobject, resizePrevention: true, tempo: true, changeSave: ""})
        }
        
    }
    selectDiv = (e) => {
        e.stopPropagation();
        this.unselectDivs();
        let objectindex = e.target.className.charAt(0);
        if(objectindex == "b") {
            objectindex = e.target.className.charAt((e.target.className.length)-1);
        }
        let tempobject = this.state.objects;
        tempobject[objectindex].childClass = "active-pointer";
        this.setState({selectedDiv: objectindex, objects: tempobject});
    }
    unselectDivs = () => {
        if(this.state.resizePrevention) {
            this.setState({resizePrevention: false});
        }
        else {
        let tempobject = this.state.objects;
        for (let i = 0; i < tempobject.length; i++) {
            tempobject[i].childClass = "pointer";
        }
        this.setState({selectedDiv: "", objects: tempobject});
        }
        console.log(this.state.zoom);
    }
    addContainer = () => {
        this.unselectDivs();
        var tempobjects = this.state.objects;
        let templength = tempobjects.length;
        var container = 
        {borderColor: "black",
        borderRadius: "30px",
        borderWidth: "medium",
        borderStyle: "solid",
        childClass: "pointer-active",
        color: "blue",
        fontSize: "15px",
        height: "200px",
        key: tempobjects.length,
        type: "LC",
        value: "",
        width: "400px",
        x: 0,
        y: 0
        }
        tempobjects.push(container);
        this.setState({objects: tempobjects, selectedDiv: templength})
    }
    addLabel = () => {
        this.unselectDivs();
        var tempobjects = this.state.objects;
        let templength = tempobjects.length;
        var container = 
        {borderColor: "black",
        borderRadius: "30px",
        borderWidth: "medium",
        borderStyle: "",
        childClass: "pointer-active",
        color: "black",
        fontSize: "15px",
        height: "200px",
        key: tempobjects.length,
        type: "LC",
        width: "400px",
        value: "DEFAULT",
        x: 0,
        y: 0
        }
        tempobjects.push(container);
        this.setState({objects: tempobjects, selectedDiv: templength})
    }
    addButton = () => {
        this.unselectDivs();
        var tempobjects = this.state.objects;
        let templength = tempobjects.length;
        var container = 
        {borderColor: "black",
        borderRadius: "",
        borderWidth: "medium",
        borderStyle: "",
        childClass: "pointer-active",
        color: "black",
        fontSize: "15px",
        height: "50px",
        key: tempobjects.length,
        type: "button",
        width: "200px",
        value: "DEFAULT",
        x: 0,
        y: 0
        }
        tempobjects.push(container);
        this.setState({objects: tempobjects, selectedDiv: templength})
    }
    addTextfield = () => {
        this.unselectDivs();
        var tempobjects = this.state.objects;
        let templength = tempobjects.length;
        var container = 
        {borderColor: "black",
        borderRadius: "",
        borderWidth: "medium",
        borderStyle: "",
        childClass: "pointer-active",
        color: "black",
        fontSize: "15px",
        height: "50px",
        key: tempobjects.length,
        type: "text",
        width: "300px",
        value: "DEFAULT",
        x: 0,
        y: 0
        }
        tempobjects.push(container);
        this.setState({objects: tempobjects, selectedDiv: templength})
    }
    render() {
        const auth = this.props.auth;
        const wireFrameStyle = {
            width: this.state.width/5,
            height: this.state.height/5,
            transform: "scale(" + this.state.zoom.toString() + ")",
            transformOrigin: "0 0",
            borderStyle: 'solid',
            borderWidth: 'medium',
        }
        const containerItems = [];
        for(let i = 0; i < this.state.objects.length; i++) {
            if(this.state.objects[i].type === "text") {
                containerItems.push(<Rnd
                    size = {{width: this.state.objects[i].width, height: this.state.objects[i].height}}
                    scale = {this.state.zoom}
                    style = {{transform:"scale(" + this.state.zoom.toString() + ")"}}
                    position={{ x: this.state.objects[i].x, y: this.state.objects[i].y }}
                    onDragStop= {(e,d) => {this.onDragStop(e,d)}}
                    onResizeStop = {(e,direction,ref,delta,position) => {this.onResizeStop(e,direction,ref,delta,position)}}
                    maxWidth = {this.state.width/5}
                    maxHeight = {this.state.height/5}
                    className = {this.state.objects[i].key}
                    resizeHandleClasses = {{
                        bottomLeft:  this.state.objects[i].childClass,
                        bottomRight: this.state.objects[i].childClass,
                        topRight: this.state.objects[i].childClass,
                        topLeft: this.state.objects[i].childClass,
                    }}
                    resizeHandleComponent = {{
                        bottomLeft: React.createElement('div', {id: this.state.objects[i].key}, " "),
                        bottomRight: React.createElement('div', {id: this.state.objects[i].key}, " "),
                        topRight: React.createElement('div', {id: this.state.objects[i].key}, " "),
                        topLeft: React.createElement('div', {id: this.state.objects[i].key}, " ")
                    }}
                    enableResizing = {{
                        bottom: false,
                        top: false,
                        left: false,
                        right: false,
                        bottomLeft: true,
                        bottomRight: true,
                        topLeft: true,
                        topRight: true
                    }}
                    bounds = {"parent"}
                    >
                        <input onFocus = {(e) => {this.selectDiv(e)}} onClick = {(e) => {this.selectDiv(e)}} className = {this.state.objects[i].key} type="text" style = {{width: this.state.objects[i].width, height: this.state.objects[i].height, 
                        fontSize: this.state.objects[i].fontSize, borderColor: this.state.objects[i].borderColor, 
                        backgroundColor: this.state.objects[i].backgroundColor, color: this.state.objects[i].color, 
                        borderStyle: this.state.objects[i].borderStyle, borderRadius: this.state.objects[i].borderRadius, borderWidth: this.state.objects[i].borderWidth,
                        position: "absolute"
                        }} 
                        value = {this.state.objects[i].value}/>
                </Rnd>)
            }
            else if (this.state.objects[i].type === "LC") {
                containerItems.push(<Rnd
                    size = {{width: this.state.objects[i].width, height: this.state.objects[i].height}}
                    scale = {this.state.zoom}
                    style = {{transform:"scale(" + this.state.zoom.toString() + ")"}}
                    position={{ x: this.state.objects[i].x, y: this.state.objects[i].y }}
                    onDragStart = {(e) => {this.selectDiv(e)}}
                    onDragStop= {(e,d) => {this.onDragStop(e,d)}}
                    onResizeStop = {(e,direction,ref,delta,position) => {this.onResizeStop(e,direction,ref,delta,position)}}
                    className = {this.state.objects[i].key}
                    resizeHandleClasses = {{
                        bottomLeft:  this.state.objects[i].childClass,
                        bottomRight: this.state.objects[i].childClass,
                        topRight: this.state.objects[i].childClass,
                        topLeft: this.state.objects[i].childClass,
                    }}
                    resizeHandleComponent = {{
                        bottomLeft: React.createElement('div', {id: this.state.objects[i].key}, " "),
                        bottomRight: React.createElement('div', {id: this.state.objects[i].key}, " "),
                        topRight: React.createElement('div', {id: this.state.objects[i].key}, " "),
                        topLeft: React.createElement('div', {id: this.state.objects[i].key}, " ")
                    }}
                    enableResizing = {{
                        bottom: false,
                        top: false,
                        left: false,
                        right: false,
                        bottomLeft: true,
                        bottomRight: true,
                        topLeft: true,
                        topRight: true
                    }}
                    bounds = {"parent"}
                    >
                        <div onClick = {(e) => {this.selectDiv(e)}} onFocus = {(e) => {this.selectDiv(e)}} className = {this.state.objects[i].key} style = {{width: this.state.objects[i].width, height: this.state.objects[i].height, 
                        fontSize: this.state.objects[i].fontSize, borderColor: this.state.objects[i].borderColor, 
                        backgroundColor: this.state.objects[i].backgroundColor, color: this.state.objects[i].color, 
                        lineHeight: this.state.objects[i].height, textAlign: "center", borderStyle: this.state.objects[i].borderStyle, borderRadius: this.state.objects[i].borderRadius, borderWidth: this.state.objects[i].borderWidth,
                        position: "absolute"
                        }}>{this.state.objects[i].value}</div>
                </Rnd>) 
            }
            else if (this.state.objects[i].type == "button") {
                containerItems.push(<Rnd
                    size = {{width: this.state.objects[i].width, height: this.state.objects[i].height}}
                    scale = {this.state.zoom}
                    style = {{transform:"scale(" + this.state.zoom.toString() + ")"}}
                    position={{ x: this.state.objects[i].x, y: this.state.objects[i].y }}
                    onDragStop= {(e,d) => {this.onDragStop(e,d)}}
                    onResizeStop = {(e,direction,ref,delta,position) => {this.onResizeStop(e,direction,ref,delta,position)}}
                    className = {this.state.objects[i].key}
                    resizeHandleClasses = {{
                        bottomLeft:  this.state.objects[i].childClass,
                        bottomRight: this.state.objects[i].childClass,
                        topRight: this.state.objects[i].childClass,
                        topLeft: this.state.objects[i].childClass,
                    }}
                    resizeHandleComponent = {{
                        bottomLeft: React.createElement('div', {id: this.state.objects[i].key}, " "),
                        bottomRight: React.createElement('div', {id: this.state.objects[i].key}, " "),
                        topRight: React.createElement('div', {id: this.state.objects[i].key}, " "),
                        topLeft: React.createElement('div', {id: this.state.objects[i].key}, " ")
                    }}
                    enableResizing = {{
                        bottom: false,
                        top: false,
                        left: false,
                        right: false,
                        bottomLeft: true,
                        bottomRight: true,
                        topLeft: true,
                        topRight: true
                    }}
                    bounds = {"parent"}
                    >
                        <Button onClick = {(e) => {this.selectDiv(e)}} onFocus = {(e) => {this.selectDiv(e)}} className = {this.state.objects[i].key} type="text" style = {{width: this.state.objects[i].width, height: this.state.objects[i].height, 
                        fontSize: this.state.objects[i].fontSize, borderColor: this.state.objects[i].borderColor, 
                        backgroundColor: this.state.objects[i].backgroundColor, color: this.state.objects[i].color, 
                        borderStyle: this.state.objects[i].borderStyle, borderRadius: this.state.objects[i].borderRadius, borderWidth: this.state.objects[i].borderWidth,
                        position: "absolute"
                        }}>{this.state.objects[i].value}</Button>
                </Rnd>) 
            }
        }
        if (!auth.uid) {
            return <Redirect to="/" />;
        }
        return (
            <div class = "row">
                <div class = "col s2">
                    <div class="edit-card card-panel teal">
                        <div class = "row">
                            <div class = "col s6">
                                <a class={"waves-effect waves-light red btn " + this.state.changeSave} onClick = {this.goSave}>Save</a>
                            </div>
                            <div class = "col s6">
                                <a class="waves-effect waves-light red btn" onClick = {this.goHome}>Close</a>
                            </div>
                        </div>
                        <div class = "row">
                            <div class = "col s6">
                                <a class="btn waves-effect waves-light red" onClick = {e => {this.okzoomerin(e)}}><i class="material-icons">zoom_in</i></a>
                            </div>
                            <div class = "col s6">
                                <a class=" btn waves-effect waves-light red"onClick = {e => {this.okzoomerout(e)}}><i class="material-icons">zoom_out</i></a>
                            </div>
                        </div>
                        <div class = "row">
                            <div class = "col s12">
                                <a class={"waves-effect waves-light red btn " + this.state.changeDimensions} onClick = {this.updateDimensions}><i class="material-icons right">crop_square</i>Update Dim.</a>
                            </div>
                        </div>
                        <br></br>
                        <div class = "row">
                            <div className="input-field">
                                <label htmlFor="width" className="active black-text">Name</label>
                                <input type="text" name="name" id = "name" onChange = {e => {this.handleChange(e)}} value = {this.state.name} />
                            </div>
                        </div>
                        <div class = "row">
                            <div className="input-field">
                                <label htmlFor="width" className="active black-text">Width [1-5000] [.2x] </label>
                                <input type="text" name="widthtext" id = "widthtext" onChange = {e => {this.handleDimensionChange(e)}} value = {this.state.widthtext} />
                            </div>
                        </div>
                        <div class = "row">
                            <div className="input-field">
                                <label htmlFor="height" className="active black-text">Height [1-5000] [.2x] </label>
                                <input type="text" name="heighttext" id = "heighttext" onChange = {e => {this.handleDimensionChange(e)}} value = {this.state.heighttext} />
                            </div>
                        </div>
                        <div class = "row">
                            <div class = "col s12">
                                <a class={"addrow waves-effect waves-light red btn "} onClick = {this.addContainer}>Add Container</a>
                            </div>
                        </div>
                        <div class = "row">
                            <div class = "col s12">
                                <a class={"addrow waves-effect waves-light red btn "} onClick = {this.addLabel}>Add Label</a>
                            </div>
                        </div>
                        <div class = "row">
                            <div class = "col s12">
                                <a class={"addrow waves-effect waves-light red btn "} onClick = {this.addButton}>Add Button</a>
                            </div>
                        </div>
                        <div class = "row">
                            <div class = "col s12">
                                <a class={"addrow waves-effect waves-light red btn "} onClick = {this.addTextfield}>Add Textfield</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class = "col s8">
                    <div class = "edit-card-main card-panel white" onClick = {() => {this.unselectDivs()}}>
                        <div className = "wireFrameContainer" style = {wireFrameStyle}>
                            {containerItems}
                        </div>
                    </div>
                </div>
                <div class = "col s2">
                    <div class="edit-card card-panel teal">
                        <span class="white-text">
                        </span>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
  const { id } = ownProps.match.params;
  const { wireFrames } = state.firestore.data;
  const wireFrame = wireFrames ? wireFrames[id] : null;
  wireFrame.id = id;
  return {
    wireFrame,
    auth: state.firebase.auth,
  };
};
export default compose(
  withRouter,
  connect(mapStateToProps),
  firestoreConnect([
    { collection: 'todoLists' },
  ]),
)(ListScreen);