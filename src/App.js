import React, { Component } from 'react';
import fire from './fire';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      items: [],
      selectedItem: {}
    };

    this.onBlurEditTextInput = this.onBlurEditTextInput.bind(this);
  }
  componentDidMount(){
    //READ DATA
    /* Create reference to my-data node in Firebase Database */
    let items = fire.database().ref('my-data').orderByKey().limitToLast(100);
    items.on('child_added', snapshot => {
      /* Update React state when item is added at Firebase Database */
      let item = { text: snapshot.val(), id: snapshot.key };
      //console.log(item);
      
      this.setState({ items: [item].concat(this.state.items) });
    });

    //Update items when data is changed
    items.on('child_changed', snapshot => {
      let item = { text: snapshot.val(), id: snapshot.key };
      //console.log(item);
      let index = this.state.items.findIndex((i)=>i.id === item.id); //Index of item changed

      let newArr = this.state.items;
      newArr[index] = item;
      this.setState({
        items: newArr
      });
    });

    //Update items when data is removed
    items.on('child_removed', snapshot => {
      let item = { text: snapshot.val(), id: snapshot.key };
      //console.log(item);

      let newArr = this.state.items.filter((i)=> item.id !== i.id)
      this.setState({
        items: newArr
      });
    });
  }
  componentWillUnmount(){
    fire.off();
  }
  addMessage(e){
    //WRITE DATA
    e.preventDefault(); //Prevent form submit from reloading the page
    /* Send the message to Firebase */
    fire.database().ref('my-data').push( this.inputEl.value );
    this.inputEl.value = ''; //Clear the input
  }
  onChangeItem(event, id){
    this.setState({selectedItem: {id: id, text: event.target.value}})
  }
  onBlurEditTextInput(event){
    var text = event.target.value;
    let itemId =  this.state.selectedItem.id;

    let updates = {};
    updates['/my-data/' + itemId] = text;
    this.setState({selectedItem: {}});
    return fire.database().ref().update(updates);
  }
  onClickItem(item){
    this.setState({selectedItem: item});
  }
  render() {
    let selectedItem = this.state.selectedItem;
    return (
      <form onSubmit={this.addMessage.bind(this)}>
        <input type="text" ref={el=>this.inputEl=el}/>
        <input type="submit"/>
        <ul>
          { /* Render the list of items */
            this.state.items.map( item => 
              (item.id === selectedItem.id)?
              <input 
                key={item.id} 
                value={selectedItem.text} 
                onChange={(e)=>this.onChangeItem(e, item.id)}
                onBlur={this.onBlurEditTextInput}
                ref={input=>input&&input.focus()}
              />
              :
              <li 
                key={item.id} 
                onClick={()=>this.onClickItem(item)}
                style={{cursor: 'pointer'}}
              >
                {item.text}
              </li>
            )
          }
        </ul>
      </form>
    );
  }
}

export default App;