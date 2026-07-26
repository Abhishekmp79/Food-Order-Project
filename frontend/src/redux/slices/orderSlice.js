import {createSlice} from  "@reduxjs/toolkit"

const initialState ={
    loading: false,
    error: null,
    order: null,
    orders:[]
}

const orderSlice = createSlice({
    name:"order",
    initialState,
    reducers:{
        ///common
        clearErrors:(state)=>{
            state.error= null
        },
        //create order
        createOrderRequest:(state)=>{
            state.loading=true;
            state.error = null;
            state.order = null;
        },
        createOrderSuccess:(state,action)=>{
            state.loading= false,
            state.order= action.payload
        },
        createOrderFail:(state,action)=>{
             state.loading= false,
            state.error= action.payload
        },
        //payment
        paymentRequest:(state)=>{
            state.loading=true;
            state.error = null;
        },
        paymentSuccess:(state,action)=>{
            state.loading= false,
            state.order= action.payload
        },
        paymentFail:(state,action)=>{
             state.loading= false,
            state.error= action.payload
        },

        //My Orders
        myOrderRequest:(state)=>{
            state.loading=true;
            state.error = null;
        },
        myOrderSuccess:(state,action)=>{
            state.loading= false,
            state.orders= action.payload
        },
        myOrderFail:(state,action)=>{
             state.loading= false,
            state.error= action.payload
        },
        
        //Order Details
        orderDetailsRequest:(state)=>{
            state.loading=true;
            state.error = null;
        },
        orderDetailsSuccess:(state,action)=>{
            state.loading= false,
            state.order= action.payload
        },
        orderDetailsFail:(state,action)=>{
             state.loading= false,
            state.error= action.payload
        },


    }
})

export const{
   clearErrors,
   createOrderRequest,
   createOrderSuccess,
   createOrderFail,
   paymentRequest,
   paymentSuccess,
   paymentFail,
   myOrderRequest,
   myOrderSuccess,
   myOrderFail,
   orderDetailsRequest,
   orderDetailsSuccess,
   orderDetailsFail
} = orderSlice.actions

export default orderSlice.reducer
