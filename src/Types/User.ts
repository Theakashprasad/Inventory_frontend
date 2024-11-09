
export interface Iuser{
  id: string;
  _id: any;
  fullname: string;
  email: string;
  profilePic: string;
}
export interface Iinventory {
  _id: any;
  fullname: string;
  email: string;
  description: string;
  quantity: string;
  price: string;
  name: string;
}
export interface Icustomer {
  _id: any;
  name: string;
  email: string;
  address: string;
  phone: string;
}
export interface Isale {
  itemName: any;
  customerName: string;
  quantity: string;
  itemPrice: string;
  cash: string;
  owner: string;
  saleDate: string;
}
