import React, {Component} from "react";

class OrderItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editMode: false,
      editText: this.props.order.text
    };
  }

  onToggleEditMode = () => {
    this.setState(state => ({
      editMode: !state.editMode,
      editText: this.props.order.text
    }));
  };

  onChangeEditText = event => {
    this.setState({editText: event.target.value});
  };

  onSaveEditText = () => {
    this.props.onEditOrder(this.props.order, this.state.editText);
    this.setState({editMode: false});
  };

  render() {
    const {order, onRemoveOrder} = this.props;
    const {editMode, editText} = this.state;

    return (
      <li>
        {editMode ? (
          <input
            type="text"
            value={editText}
            onChange={this.onChangeEditText}
          />
        ) : (
          <div>
            <div>
              <strong>{order.user.username || order.user.userId}</strong>@
              {new Date(order.createdAt).toLocaleString("et-EE")}
            </div>
            <span>
              {order.text}
              {order.editedAt && <span>(Edited)</span>}
            </span>
          </div>
        )}

        {editMode ? (
          <span>
            <button onClick={this.onSaveEditText}>Save</button>
            <button onClick={this.onToggleEditMode}>Reset</button>
          </span>
        ) : (
          <button onClick={this.onToggleEditMode}>Edit</button>
        )}
        {!editMode && (
          <button type="button" onClick={() => onRemoveOrder(order.uid)}>
            Delete
          </button>
        )}
      </li>
    );
  }
}

const OrdersList = ({orders, onEditOrder, onRemoveOrder}) => (
  <ul>
    {orders.map(order => (
      <OrderItem
        key={order.uid}
        order={order}
        onEditOrder={onEditOrder}
        onRemoveOrder={onRemoveOrder}
      />
    ))}
  </ul>
);

export default OrdersList;
