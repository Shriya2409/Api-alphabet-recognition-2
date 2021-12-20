import React from 'react';
import { Text, View, StyleSheet, Button, Platform } from 'react-native';
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";

export default class PickImage extends React.Component{
  state={image : null}
  get_permission=async()=>{
    if (Platform.OS!=="web"){
      const{status}=await Permissions.askAsync(Permissions.CAMERA_ROLL)
      if (status!=='granted'){
        alert("sorry, we need permissions")
      }
    }
  }

  componentDidMount(){
    this.get_permission
  }

  _pickImage=async()=>{
    try{
      let result=await ImagePicker.launchImageLibraryAsync({
        mediaTypes:ImagePicker.MediaTypeOptions.All, 
        allowEditing:true,
        aspect:[4, 3],
        quality:1
    })
    if (!result.cancelled){
      this.setState({image:result.data})
      console.log(result.uri)
      this.uploadImage(result.uri)
    }
    }

    catch(E){
      console.log(E)
    }
  }

  uploadImage=async(uri)=>{
    const data=new FormData()
    let fileName=uri.split("/")[uri.split("/").length - 1]
    let type=`image/${uri.split('.')[uri.split('.').length - 1]}`
    const fileUpload={
      uri:uri, name:fileName, type:type
    }
    data.append("digit", fileUpload)
    fetch("http://fe6f-2405-201-17-8007-b58a-76eb-5541-49b.ngrok.io/predict-digit", {
      method:"POST",
      body:data,
      headers:{"content-type":"multipath/form-data"}, 
    }).then((response)=>response.json())
    .then((result)=>{console.log("success : ", result)})
    .catch((error)=>{console.error("error: ", error)})
  }

  render(){
    let{image}=this.state
    return(
     <View 
     style={{flex:1, allignItems:'center', justifyContent:'center'}}
     >
     <Button title="Pick an image" 
     onPress={this._pickImage}
     />
     </View>
    )
  }
}