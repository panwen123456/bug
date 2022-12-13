import fetch  from "./fetch";

class Cart {
  static count() {
    return fetch('cartCount')
  }
}

export default Cart